# LifeTrackPro

A comprehensive life tracking application with AI assistance, habit tracking, task management, and productivity analytics.

## Features

### Currently Implemented
- 🎯 Task & Goal Tracking
- 💧 Water Intake Monitoring
- 😊 Mood Tracking
- 📊 Productivity Analytics
- 🤖 AI Assistant (Riya)
- 🎨 Beautiful UI with Dark/Light Mode
- 🔊 Voice Commands
- 📱 Responsive Design

### Planned Features
LifeTrackPro aims to be your all-in-one life management app with 50 powerful features across five categories:

- **Health & Wellness**: Track habits, water, sleep, exercise, mood, and more
- **Financial Management**: Manage expenses, budgets, savings goals, and investments
- **Productivity**: To-do lists, Pomodoro timer, goal tracking, and time management
- **Gamification & Rewards**: Achievements, levels, challenges, and rewards for motivation
- **Smart Features**: AI assistant, personalized insights, voice commands, and data analysis

See our complete [Features Roadmap](./FEATURES-ROADMAP.md) for details on all 50 planned features.

## Live Demo
Check out the live demo at [https://lifetrackpro.netlify.app](https://lifetrackpro.netlify.app)

## Tech Stack

- React 18 with TypeScript
- Vite for Build Tool
- TailwindCSS for Styling
- Radix UI for Components
- Zustand for State Management
- Web Speech API for Voice Commands

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/lifetrackpro.git
   cd lifetrackpro
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Voice Commands

Say "hey life" to activate the voice assistant. Available commands:
- "How much water have I had today?"
- "What's my current mood?"
- "Add water intake"
- "Update my mood"
- "Show my productivity"
- "What are my goals?"

## Project Structure

```
lifetrackpro/
├── src/
│   ├── components/    # Reusable UI components
│   ├── features/      # Feature-specific components
│   ├── hooks/         # Custom React hooks
│   ├── lib/          # Utility functions
│   ├── services/     # API and external services
│   ├── stores/       # State management
│   ├── styles/       # Global styles
│   └── types/        # TypeScript type definitions
├── public/           # Static assets
└── sounds/           # Audio files for voice feedback
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License 