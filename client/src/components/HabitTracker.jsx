import { useState } from 'react'
import { FiPlus, FiCheck, FiTrash } from 'react-icons/fi'

export default function HabitTracker() {
  const [habits, setHabits] = useState([
    { id: 1, name: 'Morning Meditation', streak: 5, daysChecked: [1, 2, 3, 4, 5] },
    { id: 2, name: 'Read 30 Minutes', streak: 2, daysChecked: [4, 5] },
    { id: 3, name: 'Exercise', streak: 0, daysChecked: [] }
  ])
  const [newHabit, setNewHabit] = useState('')
  
  // Current day (1-7 for the week)
  const today = new Date().getDay() || 7

  // Add new habit
  const addHabit = (e) => {
    e.preventDefault()
    if (!newHabit.trim()) return
    
    const habit = {
      id: Date.now(),
      name: newHabit,
      streak: 0,
      daysChecked: []
    }
    
    setHabits([...habits, habit])
    setNewHabit('')
  }

  // Toggle habit for today
  const toggleHabit = (id) => {
    setHabits(habits.map(habit => {
      if (habit.id !== id) return habit
      
      const daysChecked = habit.daysChecked.includes(today)
        ? habit.daysChecked.filter(day => day !== today)
        : [...habit.daysChecked, today]
      
      const streak = daysChecked.includes(today) ? habit.streak + 1 : Math.max(0, habit.streak - 1)
      
      return { ...habit, daysChecked, streak }
    }))
  }

  // Delete habit
  const deleteHabit = (id) => {
    setHabits(habits.filter(habit => habit.id !== id))
  }

  // Generate week days (Sun-Sat)
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

  return (
    <div className="bg-card rounded-md shadow p-4">
      <h2 className="text-lg font-medium mb-4">My Habits</h2>
      
      <form onSubmit={addHabit} className="flex mb-4 gap-2">
        <input
          type="text"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          placeholder="Add a new habit..."
          className="flex-1 p-2 border border-input rounded"
        />
        <button 
          type="submit"
          className="bg-primary text-white p-2 rounded hover:bg-primary-dark"
        >
          <FiPlus size={20} />
        </button>
      </form>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-2">Habit</th>
              <th className="p-2 text-center">Streak</th>
              {weekDays.map((day, index) => (
                <th key={index} className="p-2 text-center">
                  {day}
                </th>
              ))}
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {habits.map(habit => (
              <tr key={habit.id} className="border-b border-border">
                <td className="p-2">{habit.name}</td>
                <td className="p-2 text-center font-medium">
                  {habit.streak}
                </td>
                {[1, 2, 3, 4, 5, 6, 7].map(day => (
                  <td key={day} className="p-2 text-center">
                    <button
                      onClick={() => day === today && toggleHabit(habit.id)}
                      className={`w-6 h-6 rounded-full border ${
                        habit.daysChecked.includes(day) 
                          ? 'bg-secondary border-secondary' 
                          : 'border-muted'
                      } ${day === today ? 'cursor-pointer' : 'opacity-60 cursor-default'}`}
                    >
                      {habit.daysChecked.includes(day) && 
                        <FiCheck size={12} className="m-auto text-white" />
                      }
                    </button>
                  </td>
                ))}
                <td className="p-2 text-right">
                  <button 
                    onClick={() => deleteHabit(habit.id)}
                    className="text-muted hover:text-danger"
                  >
                    <FiTrash size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 