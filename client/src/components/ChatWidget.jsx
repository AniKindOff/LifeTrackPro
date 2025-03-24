import { useState, useRef, useEffect } from 'react'
import { FiSend, FiX } from 'react-icons/fi'

export default function ChatWidget({ onClose }) {
  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', content: 'Hi! I\'m Riya, your LifeTrackPro assistant. How can I help you today?' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Send message to assistant
  const sendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return
    
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)
    
    try {
      // Simulate API call
      setTimeout(() => {
        const assistantMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: getMockResponse(input)
        }
        
        setMessages(prev => [...prev, assistantMessage])
        setLoading(false)
      }, 1000)
      
      // Uncomment to use real API
      /* 
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(({ role, content }) => ({ role, content }))
        }),
      })
      
      const data = await response.json()
      
      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.response
      }
      
      setMessages(prev => [...prev, assistantMessage])
      setLoading(false)
      */
    } catch (error) {
      console.error('Error sending message:', error)
      setLoading(false)
      
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }])
    }
  }
  
  // Mock responses for demo
  const getMockResponse = (input) => {
    const text = input.toLowerCase()
    
    if (text.includes('hello') || text.includes('hi')) {
      return "Hello! I'm Riya, your LifeTrackPro assistant. How can I help you with your tasks and habits today?"
    }
    
    if (text.includes('task') || text.includes('todo')) {
      return "I can help you manage your tasks in LifeTrackPro! Try adding a new task in the Tasks tab."
    }
    
    if (text.includes('habit')) {
      return "Habits are important for long-term success. LifeTrackPro makes it easy to track your progress in the Habits tab."
    }
    
    if (text.includes('help')) {
      return "As your LifeTrackPro assistant, I can help you with managing tasks, tracking habits, and providing productivity tips."
    }
    
    return "I'm Riya, your LifeTrackPro assistant. I'm here to help you stay productive. Is there something specific you'd like help with?"
  }

  return (
    <div className="fixed bottom-20 right-4 w-80 bg-card rounded-md shadow-lg border border-border overflow-hidden">
      <div className="p-3 border-b border-border flex justify-between items-center bg-primary text-white">
        <h3 className="font-medium">Riya Assistant</h3>
        <button 
          onClick={onClose}
          className="p-1 rounded-full hover:bg-primary-dark"
        >
          <FiX size={20} />
        </button>
      </div>
      
      <div className="h-80 overflow-y-auto p-3 space-y-3">
        {messages.map(message => (
          <div 
            key={message.id}
            className={`p-2 rounded-lg max-w-[80%] ${
              message.role === 'user' 
                ? 'bg-primary text-white ml-auto' 
                : 'bg-muted/20 text-foreground'
            }`}
          >
            {message.content}
          </div>
        ))}
        {loading && (
          <div className="bg-muted/20 text-foreground p-2 rounded-lg max-w-[80%]">
            <div className="flex space-x-1">
              <div className="w-2 h-2 rounded-full bg-muted animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-muted animate-bounce delay-100"></div>
              <div className="w-2 h-2 rounded-full bg-muted animate-bounce delay-200"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={sendMessage} className="p-3 border-t border-border flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border border-input rounded"
          disabled={loading}
        />
        <button 
          type="submit"
          className={`p-2 rounded ${
            loading || !input.trim() 
              ? 'bg-muted text-muted-foreground' 
              : 'bg-primary text-white hover:bg-primary-dark'
          }`}
          disabled={loading || !input.trim()}
        >
          <FiSend size={20} />
        </button>
      </form>
    </div>
  )
}