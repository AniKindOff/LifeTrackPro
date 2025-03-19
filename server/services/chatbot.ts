import OpenAI from 'openai';
import { ChatMessage } from '@shared/schema';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const RIYA_PERSONA = `
You are Riya, a friendly and knowledgeable AI assistant for a habit and finance tracking application.
You help users with:
- Setting and maintaining healthy habits
- Managing their finances wisely
- Providing motivation and accountability
- Answering questions about the application
Always maintain a positive, encouraging tone and provide practical, actionable advice.
`;

export async function generateChatResponse(
  messages: ChatMessage[],
  language: string = 'en'
): Promise<string> {
  try {
    const conversation = [
      { role: 'system', content: RIYA_PERSONA } as const,
      ...messages.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      } as const))
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: conversation,
      temperature: 0.7,
      max_tokens: 150
    });

    return completion.choices[0]?.message?.content || "I apologize, but I couldn't generate a response.";
  } catch (error) {
    console.error('Error generating chat response:', error);
    return "I'm sorry, but I'm having trouble processing your request right now.";
  }
}

// Function to detect language
export async function detectLanguage(text: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system" as const,
          content: "You are a language detector. Respond with only the ISO 639-1 language code (e.g., 'en', 'es', 'fr', etc.)"
        },
        {
          role: "user" as const,
          content: `Detect the language of this text: "${text}"`
        }
      ],
      temperature: 0,
      max_tokens: 2
    });

    return completion.choices[0]?.message?.content?.toLowerCase() || 'en';
  } catch (error) {
    console.error('Error detecting language:', error);
    return 'en';
  }
}