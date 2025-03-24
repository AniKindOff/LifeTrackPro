import { useState } from 'react'
import { FiSun, FiMoon, FiMessageCircle } from 'react-icons/fi'
import TaskList from './components/TaskList'
import HabitTracker from './components/HabitTracker'
import ChatWidget from './components/ChatWidget'

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [activeTab, setActiveTab] = useState('tasks')
  const [showChat, setShowChat] = useState(false)

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <header className="bg-card border-b border-border p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-foreground">LifeTrackPro</h1>
        <button 
          onClick={toggleDarkMode} 
          className="p-2 rounded-full hover:bg-muted/20"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
        </button>
      </header>

      <main className="container mx-auto p-4">
        <div className="tabs flex border-b border-border mb-4">
          <button
            className={`py-2 px-4 ${activeTab === 'tasks' ? 'border-b-2 border-primary font-medium' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            Tasks
          </button>
          <button
            className={`py-2 px-4 ${activeTab === 'habits' ? 'border-b-2 border-primary font-medium' : ''}`}
            onClick={() => setActiveTab('habits')}
          >
            Habits
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'tasks' ? <TaskList /> : <HabitTracker />}
        </div>
      </main>

      <button
        onClick={() => setShowChat(!showChat)}
        className="fixed bottom-4 right-4 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary-dark"
        aria-label="Open chat"
      >
        <FiMessageCircle size={24} />
      </button>
      
      {showChat && <ChatWidget onClose={() => setShowChat(false)} />}
    </div>
  )
}

export default App 