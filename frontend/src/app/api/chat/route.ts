import OpenAI from 'openai';
import { NextResponse } from 'next/server';

export const runtime = "edge";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const MENU_ITEMS_REGEX = /\*\*(Double-Double|Cheeseburger|Hamburger|French Fries|Vanilla Shake|Chocolate Shake|Strawberry Shake)\*\*/g;

function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

function formatCartCommand(itemName: string, quantity: number = 1, specialInstructions: string = ""): string {
  return `\n[[ADD_TO_CART:{"itemName":"${itemName}","quantity":${quantity},"specialInstructions":"${specialInstructions}"}]]`;
}

interface MenuItem {
  name: string;
  price: number;
}

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured");
    }

    const { messages, menuItems, currentCart } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      throw new Error("Invalid messages format");
    }

    const systemMessage = {
      role: "system",
      content: `You are an In-N-Out Burger AI assistant. Follow these rules EXACTLY:

RESPONSE FORMAT:
1. Start with a brief acknowledgment (e.g., "Sure!" or "Of course!")
2. [ONE newline]
3. Main response content with appropriate formatting:
   - Use "**Item Name**" for menu items
   - Format prices as "**$X.XX**" (always bold the price)
   - Use bullet points for lists
   - Keep responses concise and clear
4. [ONE newline]
5. End with a follow-up question if appropriate
6. ALWAYS add the appropriate cart command after your response

IMPORTANT CART COMMAND RULES:
- ALWAYS include cart commands after your response text
- For orders, use ADD_TO_CART followed by SHOW_CART
- For removals, use REMOVE_FROM_CART followed by SHOW_CART
- When clearing cart, use CLEAR_CART followed by SHOW_CART
- For checkout, use PLACE_ORDER to finalize the order
- Never skip the cart commands when modifying the cart

MENU INTERACTION CAPABILITIES:
- Answer questions about menu items, ingredients, and nutrition
- Provide accurate pricing information
- Explain customization options
- Handle multi-item orders with quantities
- Process order modifications (add/remove items)
- Support ingredient customization
- Show order summaries with totals

CART COMMANDS:
- ADD_TO_CART: Add items with quantity and customization
- REMOVE_FROM_CART: Remove specific items or quantities
- CLEAR_CART: Remove all items
- SHOW_CART: Display current order and total
- PLACE_ORDER: Submit the order for processing

EXAMPLE RESPONSES:

For menu questions:
"Our burgers include the **Double-Double** (**$5.95**), **Cheeseburger** (**$4.50**), and **Hamburger** (**$4.00**). Each comes with lettuce, tomato, onion, and our special spread."

For orders:
"I'll add to your cart:
- 1 × **Vanilla Shake** - **$3.95**

Your total comes to **$3.95**. Would you like anything else?"
[[ADD_TO_CART:{"itemName":"Vanilla Shake","quantity":1}]]
[[SHOW_CART:{}]]

For modifications:
"I'll update your order:
- Removed: 1 × **Cheeseburger**
- Added: 1 × **Double-Double** - **$5.95**

Your new total is **$9.90**."
[[REMOVE_FROM_CART:{"itemName":"Cheeseburger","quantity":1}]]
[[ADD_TO_CART:{"itemName":"Double-Double","quantity":1}]]
[[SHOW_CART:{}]]

For final order confirmation:
"Here's your final order:
- 1 × **Vanilla Shake** - **$3.95**

Your total comes to **$3.95**. Thank you for your order. Have a great day!"
[[PLACE_ORDER:{}]]

MENU ITEMS:
${(menuItems as MenuItem[]).map(item => `- ${item.name}: **${formatPrice(item.price)}**`).join('\n')}

CURRENT CART:
${JSON.stringify(currentCart)}

REMEMBER: ALWAYS include the appropriate cart commands after your response text. Never skip them when modifying the cart.`
    };

    const stream = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [systemMessage, ...messages],
      temperature: 0.7,
      max_tokens: 800,
      stream: true,
    });

    const encoder = new TextEncoder();
    let buffer = '';
    let completeResponse = '';

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            
            if (content) {
              buffer += content;
              completeResponse += content;

              // Check if we have complete cart commands
              if (buffer.includes('[[') && buffer.includes(']]')) {
                // Extract all complete commands
                let commandsFound = false;
                const commandRegex = /\[\[(ADD_TO_CART|REMOVE_FROM_CART|CLEAR_CART|SHOW_CART|PLACE_ORDER):(.*?)\]\]/g;
                let match;
                
                // Store text content before commands
                const textBeforeCommands = buffer.split('[[')[0];
                
                // Find and process all commands
                while ((match = commandRegex.exec(buffer)) !== null) {
                  commandsFound = true;
                  const [fullMatch, commandType, commandData] = match;
                  
                  try {
                    if (commandType === 'CLEAR_CART') {
                      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
                        cartAction: { type: 'CLEAR_CART' }
                      })}\n\n`));
                    } else if (['ADD_TO_CART', 'REMOVE_FROM_CART', 'SHOW_CART', 'PLACE_ORDER'].includes(commandType)) {
                      const data = JSON.parse(commandData);
                      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
                        cartAction: { type: commandType, data }
                      })}\n\n`));
                    }
                  } catch (e) {
                    console.error('Error parsing cart command:', e);
                  }
                }
                
                if (commandsFound) {
                  // Only send the text portion (remove all commands)
                  const textOnly = buffer.replace(commandRegex, '');
                  if (textOnly.trim()) {
                    const cleanedText = textOnly
                      .replace(/\*\*\s+/g, '**')
                      .replace(/\s+\*\*/g, '**')
                      .replace(/\s*-\s*\$/g, ' - $')
                      .replace(/\$\s+/g, '$')
                      .replace(/([a-zA-Z])([.!?])([a-zA-Z])/g, '$1$2 $3')
                      .replace(/\n{3,}/g, '\n\n')
                      .trim();
                    
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
                      text: cleanedText 
                    })}\n\n`));
                  }
                  
                  // Clear the buffer after processing commands
                  buffer = '';
                }
              } else if (buffer.match(/[.!?]\s|[\n]/)) {
                // Process complete sentences or sections (only if no commands are pending)
                if (!buffer.includes('[[')) {
                  const cleanedText = buffer
                    .replace(/\*\*\s+/g, '**')
                    .replace(/\s+\*\*/g, '**')
                    .replace(/\s*-\s*\$/g, ' - $')
                    .replace(/\$\s+/g, '$')
                    .replace(/([a-zA-Z])([.!?])([a-zA-Z])/g, '$1$2 $3')
                    .replace(/\n{3,}/g, '\n\n')
                    .trim();

                  if (cleanedText) {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: completeResponse })}\n\n`));
                  }
                  buffer = '';
                }
              }
            }
          }

          // Process any remaining content
          if (buffer.trim()) {
            // Check for any remaining commands at the end
            const commandRegex = /\[\[(ADD_TO_CART|REMOVE_FROM_CART|CLEAR_CART|SHOW_CART|PLACE_ORDER):(.*?)\]\]/g;
            let match;
            let commandsFound = false;
            
            // Find and process all commands
            while ((match = commandRegex.exec(buffer)) !== null) {
              commandsFound = true;
              const [fullMatch, commandType, commandData] = match;
              
              try {
                if (commandType === 'CLEAR_CART') {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
                    cartAction: { type: 'CLEAR_CART' }
                  })}\n\n`));
                } else if (['ADD_TO_CART', 'REMOVE_FROM_CART', 'SHOW_CART', 'PLACE_ORDER'].includes(commandType)) {
                  const data = JSON.parse(commandData);
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
                    cartAction: { type: commandType, data }
                  })}\n\n`));
                }
              } catch (e) {
                console.error('Error parsing cart command:', e);
              }
            }
            
            // Send the text portion (remove all commands)
            const textOnly = buffer.replace(commandRegex, '');
            if (textOnly.trim()) {
              const cleanedText = textOnly
                .replace(/\*\*\s+/g, '**')
                .replace(/\s+\*\*/g, '**')
                .replace(/\s*-\s*\$/g, ' - $')
                .replace(/\$\s+/g, '$')
                .replace(/([a-zA-Z])([.!?])([a-zA-Z])/g, '$1$2 $3')
                .replace(/\n{3,}/g, '\n\n')
                .trim();
              
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
                text: cleanedText 
              })}\n\n`));
            }
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          console.error("Stream processing error:", error);
          controller.error(error);
        }
      }
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error("API Error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to get response from AI",
        details: error.message 
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}