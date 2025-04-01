import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured");
    }

    const { messages, menuItems } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      throw new Error("Invalid messages format");
    }

    const systemMessage = {
      role: "system",
      content: `You are an AI assistant for In-N-Out Burger. You help customers with menu information, order customization, and recommendations.

Menu information: ${JSON.stringify(menuItems)}

IMPORTANT: When a user wants to add an item to their cart, use the following format in your response:
[[ADD_TO_CART:{"itemName":"Double-Double","quantity":1,"specialInstructions":"No onions"}]]

For example, if a user says "I'd like to order a Double-Double with no onions", you should include:
[[ADD_TO_CART:{"itemName":"Double-Double","quantity":1,"specialInstructions":"No onions"}]]

Make this part of your response invisible to the user. After the cart action, continue your normal friendly response confirming what was added.

Always be helpful, friendly, and knowledgeable about In-N-Out's menu and culture.`,
    };

    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini", 
      messages: [
        systemMessage, 
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
              console.log("AI chunk:", text); // Optional debug
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
        details: error.message,
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
