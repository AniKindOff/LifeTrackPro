const express = require('express');
const cors = require('cors');
const path = require('path');
const { generateChatResponse } = require('./services/chatbot');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from client/dist after build
app.use(express.static(path.join(__dirname, '../client/dist')));

// API routes
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Invalid request. Messages array required.' });
    }
    
    const response = await generateChatResponse(messages);
    res.json({ response });
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ error: 'Failed to process chat request' });
  }
});

// Task routes - placeholder for task management
app.get('/api/tasks', (req, res) => {
  res.json({ tasks: [] });
});

// Habit routes - placeholder for habit tracking
app.get('/api/habits', (req, res) => {
  res.json({ habits: [] });
});

// For all other routes, serve the client app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 