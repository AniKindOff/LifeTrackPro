const { OpenAI } = require('openai');

// Create OpenAI client with API key from environment or use a mock implementation
let openai = null;

// Check if we have a valid API key
const apiKey = process.env.OPENAI_API_KEY;
if (apiKey) {
  try {
    openai = new OpenAI({ apiKey });
    console.log('OpenAI client initialized successfully');
  } catch (error) {
    console.warn('Failed to initialize OpenAI client:', error);
  }
} else {
  console.info('No valid OpenAI API key found, using mock implementations');
}

// Chatbot persona
const ASSISTANT_PERSONA = `
You are Riya, the AI assistant for LifeTrackPro, a habit and task tracking application.
You help users with:
- Setting and maintaining healthy habits
- Managing their tasks and to-dos
- Providing motivation and accountability
- Answering questions about the application
- Suggesting personalized challenges based on user's goals
`;

/**
 * Generate a response based on chat history
 * @param {Array} messages - Array of chat messages
 * @returns {Promise<string>} - AI-generated response
 */
async function generateChatResponse(messages) {
  try {
    // If no OpenAI client, return a mock response
    if (!openai) {
      return getMockResponse(messages);
    }

    // Format messages for OpenAI
    const formattedMessages = [
      { role: 'system', content: ASSISTANT_PERSONA },
      ...messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    // Get response from OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: formattedMessages,
      max_tokens: 150
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error generating response:', error);
    return "I'm sorry, I'm having trouble processing your request right now.";
  }
}

/**
 * Generate a mock response when OpenAI is not available
 * @param {Array} messages - Array of chat messages
 * @returns {string} - Mock response
 */
function getMockResponse(messages) {
  const lastMessage = messages[messages.length - 1].content.toLowerCase();
  
  if (lastMessage.includes('hello') || lastMessage.includes('hi')) {
    return "Hello! I'm Riya, your LifeTrackPro assistant. How can I help you with your tasks and habits today?";
  }
  
  if (lastMessage.includes('task') || lastMessage.includes('todo')) {
    return "I can help you manage your tasks in LifeTrackPro! What would you like to do?";
  }
  
  if (lastMessage.includes('habit')) {
    return "Habits are important for long-term success. LifeTrackPro makes it easy to track your progress!";
  }
  
  return "I'm Riya, your LifeTrackPro assistant. I'm here to help you with your tasks and habits. What would you like to do today?";
}

module.exports = {
  generateChatResponse
}; 