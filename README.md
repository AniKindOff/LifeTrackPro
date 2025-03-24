# LifeTrackPro

A streamlined task and habit tracking application with Riya AI Assistant.

## Features

- ✅ Task management
- 📈 Habit tracking
- 🤖 Riya AI assistant
- 🌓 Dark/light mode
- ⚡ Fast and responsive UI

## Getting Started

### Prerequisites

- Node.js (16.x or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

3. Configure environment variables:
   - Rename `.env.example` to `.env`
   - Add your OpenAI API key in the `.env` file

### Running the Application

For Windows users, simply double-click the `launch-lifetrackpro.bat` file.

Alternatively, you can start manually:

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

The application will be available at:
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000

## Usage

- **Tasks**: Add, complete, and delete tasks in the Tasks tab
- **Habits**: Track daily habits and build streaks in the Habits tab
- **Riya AI Assistant**: Click the chat button in the bottom right to get help

## Performance Optimizations

This version has been optimized for performance:
- Minimal dependencies
- Efficient React components
- Optimized API calls
- Static assets are preloaded

## License

MIT 