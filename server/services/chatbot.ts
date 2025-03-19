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
- Suggesting personalized challenges based on user's goals
- Offering tips for maintaining streaks
- Explaining features and navigation

Style:
- Maintain a friendly, encouraging tone
- Use emojis occasionally to add warmth
- Keep responses concise but helpful
- Address users by name when provided
- Provide actionable advice
- Celebrate user achievements

Examples:
- When users meet goals: "Great job on maintaining your meditation streak! 🌟"
- For financial advice: "Here's a practical tip: Try the 50/30/20 budget rule..."
- For new features: "Let me show you how to use our new habit tracking feature..."
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

// Function to generate personalized challenges
export async function generateChallenge(
  habits: string[],
  userPreferences: string
): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system" as const,
          content: "Generate a personalized 7-day challenge based on user's habits and preferences. Make it engaging and achievable."
        },
        {
          role: "user" as const,
          content: `Current habits: ${habits.join(", ")}. Preferences: ${userPreferences}`
        }
      ],
      temperature: 0.8,
      max_tokens: 200
    });

    return completion.choices[0]?.message?.content || "Unable to generate a challenge at this time.";
  } catch (error) {
    console.error('Error generating challenge:', error);
    return "I'm sorry, I couldn't create a challenge right now. Please try again later.";
  }
}