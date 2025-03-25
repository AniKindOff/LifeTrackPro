import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import type { ChatMessage } from '../../shared/schema';

// Create Gemini client with API key from environment or use a mock implementation
let genAI: GoogleGenerativeAI | null = null;
let geminiModel: any = null;

// Check if we have a valid API key
const apiKey = process.env.GEMINI_API_KEY;
if (apiKey) {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    geminiModel = genAI.getGenerativeModel({ model: "gemini-pro" });
    console.log('Gemini client initialized successfully');
  } catch (error) {
    console.warn('Failed to initialize Gemini client:', error);
  }
} else {
  console.info('No valid Gemini API key found, using mock implementations');
}

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
    if (!geminiModel) {
      return "I apologize, but I couldn't generate a response. The AI service is unavailable.";
    }

    // Convert messages to Gemini format
    const chatHistory = messages.slice(0, -1).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // Get the latest user message
    const latestMessage = messages[messages.length - 1];
    
    // Start a chat
    const chat = geminiModel.startChat({
      history: chatHistory,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 150,
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });

    // Send message and get response
    const result = await chat.sendMessage(RIYA_PERSONA + "\n\n" + latestMessage.content);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating chat response:', error);
    return "I'm sorry, but I'm having trouble processing your request right now.";
  }
}

// Function to detect language
export async function detectLanguage(text: string): Promise<string> {
  try {
    if (!geminiModel) {
      return 'en';
    }

    const result = await geminiModel.generateContent(`
      Detect the language of this text and respond with only the ISO 639-1 language code (e.g., 'en', 'es', 'fr', etc.).
      Text: "${text}"
      Language code:
    `);
    const response = result.response;
    const langCode = response.text().trim().toLowerCase();
    return langCode.length <= 5 ? langCode : 'en';
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
    if (!geminiModel) {
      return "Unable to generate a challenge at this time.";
    }

    const result = await geminiModel.generateContent(`
      Generate a personalized 7-day challenge based on user's habits and preferences. Make it engaging and achievable.
      Current habits: ${habits.join(", ")}. 
      Preferences: ${userPreferences}
    `);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating challenge:', error);
    return "I'm sorry, I couldn't create a challenge right now. Please try again later.";
  }
}