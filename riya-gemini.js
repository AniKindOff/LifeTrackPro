// Riya Chatbot - Gemini API Integration
class RiyaAI {
  constructor(apiKey) {
    this.apiKey = apiKey || localStorage.getItem('geminiApiKey');
    this.endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
    this.history = [];
    this.systemPrompt = `You are Riya, a highly intelligent and helpful AI assistant integrated into the LifeTrackPro productivity app.
Your primary focus is on helping users with productivity, time management, habit formation, task tracking, and personal wellness.
You have access to the user's tasks, habits, and productivity data through the LifeTrackPro app.
You can help users create new tasks, track habits, analyze their productivity patterns, and provide insights.
Your responses should be friendly, motivational, and concise.
When the user asks you to perform an action like creating a task or checking statistics, you'll let them know you're doing that and then call the appropriate function.
`;
    
    // Initialize with a system message
    this.history.push({
      role: "system",
      parts: [{ text: this.systemPrompt }]
    });
  }

  // Set API key
  setApiKey(apiKey) {
    this.apiKey = apiKey;
    localStorage.setItem('geminiApiKey', apiKey);
    return this.apiKey !== null && this.apiKey !== undefined;
  }

  // Check if API key is set
  hasApiKey() {
    return this.apiKey !== null && this.apiKey !== undefined && this.apiKey.trim() !== '';
  }

  // Clear conversation history
  clearHistory() {
    this.history = [
      {
        role: "system",
        parts: [{ text: this.systemPrompt }]
      }
    ];
  }

  // Format Gemini API request
  formatRequest(message) {
    // Add the user message to history
    this.history.push({
      role: "user", 
      parts: [{ text: message }]
    });
    
    // For Gemini 2.0 compatibility, simplify the request format
    const contents = [{
      parts: [{ text: message }]
    }];
    
    // If we have conversation history, include it
    if (this.history.length > 2) {
      contents[0].parts = this.history
        .filter(msg => msg.role !== "system")
        .flatMap(msg => msg.parts);
    }
    
    return {
      contents,
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 1000,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };
  }

  // Process a task creation action
  processTaskAction(text) {
    // Extract task details
    const taskRegex = /create\s+(?:a\s+)?task\s+(?:to\s+)?(.*?)(?:\s+by\s+|due\s+by\s+|due\s+)(.*?)$/i;
    const match = text.match(taskRegex);
    
    if (match) {
      const taskName = match[1].trim();
      const dueDate = match[2].trim();
      
      // Call the task creation function
      if (typeof window.addTaskFromRiya === 'function') {
        window.addTaskFromRiya(taskName, dueDate);
        return `I've created a task "${taskName}" due on ${dueDate} for you.`;
      }
    }
    
    return null; // Indicate that no task action was processed
  }

  // Check for other actions like habit tracking, stats request, etc.
  processActions(text) {
    // Check for task creation
    const taskAction = this.processTaskAction(text);
    if (taskAction) return taskAction;
    
    // Check for mood tracking
    if (/track\s+(?:my\s+)?mood/i.test(text)) {
      if (typeof window.openMoodTracker === 'function') {
        window.openMoodTracker();
        return "I've opened the mood tracker for you. How are you feeling today?";
      }
    }
    
    // Check for pomodoro timer
    if (/start\s+(?:a\s+)?pomodoro/i.test(text)) {
      if (typeof window.startPomodoro === 'function') {
        window.startPomodoro();
        return "I've started a Pomodoro timer for you. Focus on your task for the next 25 minutes!";
      }
    }
    
    // Check for statistics/analytics request
    if (/show\s+(?:my\s+)?stats|analytics|progress/i.test(text)) {
      if (typeof window.showAnalytics === 'function') {
        window.showAnalytics();
        return "Here are your productivity statistics and insights!";
      }
    }
    
    return null; // No action processed
  }

  // Send message to Gemini API
  async sendMessage(message, onUpdate = null) {
    if (!this.hasApiKey()) {
      return {
        text: "Please set your Gemini API key first. You can do this by saying 'set API key to YOUR_KEY_HERE'.",
        error: true
      };
    }
    
    // Check for API key setting
    if (message.toLowerCase().startsWith("set api key to ")) {
      const key = message.substring(14).trim();
      this.setApiKey(key);
      return {
        text: "Thank you! Your Gemini API key has been set successfully. I'm ready to assist you now!",
        error: false
      };
    }
    
    // Check for actions to perform
    const actionResponse = this.processActions(message);
    if (actionResponse) {
      // Add the assistant response to history
      this.history.push({
        role: "model",
        parts: [{ text: actionResponse }]
      });
      
      return {
        text: actionResponse,
        error: false
      };
    }
    
    try {
      const requestData = this.formatRequest(message);
      
      // For streaming simulation (until proper streaming is implemented)
      if (onUpdate) {
        onUpdate("Thinking...");
      }
      
      const response = await fetch(`${this.endpoint}?key=${this.apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error("Gemini API error:", data);
        return {
          text: `Sorry, I encountered an error: ${data.error?.message || "Unknown error"}`,
          error: true
        };
      }
      
      // Update response parsing to match Gemini 2.0 flash response format
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || 
                          "I'm sorry, I couldn't generate a response at this time.";
      
      // Add the response to history
      this.history.push({
        role: "model",
        parts: [{ text: responseText }]
      });
      
      // Keep history at a reasonable size to avoid token limits
      if (this.history.length > 20) {
        // Keep system prompt and last 10 exchanges
        const systemMsg = this.history[0];
        this.history = [
          systemMsg,
          ...this.history.slice(-19)
        ];
      }
      
      return {
        text: responseText,
        error: false
      };
    } catch (error) {
      console.error("Error sending message to Gemini API:", error);
      return {
        text: "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later.",
        error: true
      };
    }
  }

  // Get specialized knowledge about a productivity topic
  async getProductivityTip(topic) {
    const message = `Provide a helpful, concise tip about ${topic} in the context of productivity and personal management.`;
    return await this.sendMessage(message);
  }

  // Analyze task list and provide insights
  async analyzeTaskList(tasks) {
    const taskList = tasks.map(t => `- ${t.name} (Due: ${t.dueDate}, Priority: ${t.priority})`).join('\n');
    const message = `Here's my current task list. Can you analyze it and provide insights or suggestions for better management?\n\n${taskList}`;
    return await this.sendMessage(message);
  }

  // Generate a personalized motivation message
  async getMotivation(userData) {
    const context = `User has completed ${userData.completedTasks} tasks this week, which is ${userData.completedTasks > userData.lastWeekTasks ? "more than" : "fewer than"} last week. They have a current streak of ${userData.currentStreak} days.`;
    const message = `Based on the following data, generate a personalized, motivational message to encourage me: ${context}`;
    return await this.sendMessage(message);
  }
}

// Create a global instance that can be accessed by other scripts
window.riyaAI = new RiyaAI();

// Fallback responses when API is unavailable
const fallbackResponses = [
  "I can help you manage your tasks and stay productive. What would you like to do today?",
  "I'm here to assist with your productivity goals. Need help with time management, tasks, or habits?",
  "Looking to boost your productivity? I can help you track tasks, build habits, and stay motivated.",
  "Need assistance with organizing your day? I'm here to help you prioritize and stay on track.",
  "I can help you create new tasks, track your habits, or provide insights on your productivity patterns."
];

// Get a random fallback response
function getFallbackResponse() {
  return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
}

// Initialize with an API key from the URL if available
document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const apiKey = urlParams.get('gemini_key');
  if (apiKey) {
    window.riyaAI.setApiKey(apiKey);
    console.log('Gemini API key set from URL parameter');
  }
}); 