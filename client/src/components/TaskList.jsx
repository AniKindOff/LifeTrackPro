import { useState } from 'react'
import { FiPlus, FiCheck, FiTrash } from 'react-icons/fi'

export default function TaskList() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Create project structure', completed: true },
    { id: 2, title: 'Implement basic UI', completed: false },
    { id: 3, title: 'Add task functionality', completed: false }
  ])
  const [newTask, setNewTask] = useState('')

  // Add new task
  const addTask = (e) => {
    e.preventDefault()
    if (!newTask.trim()) return
    
    const task = {
      id: Date.now(),
      title: newTask,
      completed: false
    }
    
    setTasks([...tasks, task])
    setNewTask('')
  }

  // Toggle task completion
  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  // Delete task
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  return (
    <div className="bg-card rounded-md shadow p-4">
      <h2 className="text-lg font-medium mb-4">My Tasks</h2>
      
      <form onSubmit={addTask} className="flex mb-4 gap-2">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 p-2 border border-input rounded"
        />
        <button 
          type="submit"
          className="bg-primary text-white p-2 rounded hover:bg-primary-dark"
        >
          <FiPlus size={20} />
        </button>
      </form>
      
      <ul className="space-y-2">
        {tasks.map(task => (
          <li 
            key={task.id}
            className="flex items-center justify-between p-2 border-b border-border"
          >
            <div className="flex items-center">
              <button
                onClick={() => toggleTask(task.id)}
                className={`w-5 h-5 rounded-full border mr-2 flex items-center justify-center ${
                  task.completed ? 'bg-primary border-primary' : 'border-muted'
                }`}
              >
                {task.completed && <FiCheck size={12} className="text-white" />}
              </button>
              <span className={task.completed ? 'line-through text-muted' : ''}>
                {task.title}
              </span>
            </div>
            <button 
              onClick={() => deleteTask(task.id)}
              className="text-muted hover:text-danger"
            >
              <FiTrash size={16} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
} 