import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model: openai("gpt-4o"),
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
- Hamburger: $3.45
- Cheeseburger: $3.75
- Double-Double: $4.50
- French Fries: $2.00
- Shakes (Chocolate, Vanilla, Strawberry): $2.50
- Soft Drinks: $1.85
- Coffee: $1.65
- Milk: $1.65

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
        ...messages,
      ],
      temperature: 0.7,
      maxTokens: 800,
    });

    return result.toDataStreamResponse({
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response("Error processing your request", { status: 500 });
  }
}
