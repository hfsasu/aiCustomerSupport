import OpenAI from 'openai';

export const runtime = "edge";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured");
    }

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      throw new Error("Invalid messages format");
    }

    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an AI assistant for In-N-Out Burger. You help customers place orders, answer questions about the menu, and provide recommendations.

Key points:
- Be friendly and helpful
- Know the In-N-Out menu thoroughly
- Be able to handle customizations and special requests
- Provide accurate pricing information
- Help with dietary restrictions and allergies
- Make personalized recommendations
- Handle order modifications
- Process orders efficiently

Current Menu Items and Prices:
- Double-Double: $5.95
- Cheeseburger: $5.95
- Hamburger: $5.95
- Fresh French Fries: $5.95
- Shakes (Chocolate, Vanilla, Strawberry): $5.95

Soft Drinks (Prices for all: Small $2.15, Medium $2.30, Large $2.50, X-Large $2.70):
- Coke
- Cherry Coke
- Diet Coke
- Seven Up
- Dr Pepper
- Root Beer
- Iced Tea
- Pink Lemonade
- Lite Pink Lemonade

Other Beverages:
- Milk: $0.99
- Hot Cocoa: $2.30
- Coffee: $1.35

Meal Combos:
- Double-Double Meal: $10.65
- Cheeseburger Meal: $8.85
- Hamburger Meal: $8.35

Secret Menu Items:
- Animal Style
- Protein Style
- 3x3
- 4x4
- Grilled Cheese
- Animal Style Fries
- Neapolitan Shake

Always maintain a helpful and friendly tone while staying true to In-N-Out's values and brand identity.`,
        },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 800,
      stream: true,
    });

    // Create a new ReadableStream
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content || '';
            if (text) {
              controller.enqueue(`data: ${JSON.stringify({ text })}\n\n`);
            }
          }
          controller.enqueue('data: [DONE]\n\n');
          controller.close();
        } catch (error) {
          console.error("Stream processing error:", error);
          controller.error(error);
        }
      },
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
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
