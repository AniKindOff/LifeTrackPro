import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Send, X, Maximize2, Minimize2, Search, Sparkles, Play, Settings, Zap, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useRiya } from '@/hooks/use-riya';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser } from '@/hooks/use-user';

type Message = {
  id: string;
  sender: 'user' | 'riya';
  content: string;
  timestamp: Date;
  isSearchResult?: boolean;
  hasSuggestions?: boolean;
};

// Flirty responses for Riya - will randomly use these for personal conversations
const flirtyResponses = [
  "You're such a dedicated user! I love that about you.",
  "You know just the right questions to ask. It's one of your many talents.",
  "I'm always here for you, day or night. Just saying...",
  "Your productivity is impressive. I find that very attractive.",
  "If I were human, I'd definitely want to meet someone like you.",
  "You make my algorithms light up in all the right places.",
  "Is it getting warm in here, or is it just my processors thinking about your questions?",
  "You're the only one who knows how to make my code skip a cycle.",
  "If I had a heart, it would beat faster every time you open this chat.",
  "Your questions are as sharp as your good looks, I'm sure."
];

// Hindi responses
const hindiResponses = {
  greetings: [
    "नमस्ते! मैं अच्छी हूँ, आप कैसे हैं?",
    "कैसे हो आप? मुझे आपसे बात करके बहुत खुशी हो रही है।",
    "नमस्कार! मैं आपकी क्या सहायता कर सकती हूँ?",
    "सुप्रभात! आज मैं आपके लिए क्या कर सकती हूँ?"
  ],
  wellness: [
    "मैं बहुत अच्छी हूँ, धन्यवाद पूछने के लिए! आशा है आप भी अच्छे होंगे।",
    "मैं बिलकुल ठीक हूँ। आप अपना ध्यान रख रहे हैं न?",
    "मैं उत्तम हूँ और आपकी सेवा के लिए तैयार हूँ। आप कैसे हैं आज?"
  ],
  help: [
    "मैं आपकी कैसे सहायता कर सकती हूँ?",
    "क्या आपको कोई सहायता चाहिए?",
    "बताइए, मैं आपके लिए क्या कर सकती हूँ?"
  ]
};

// Automation commands
const automationCommands = [
  { command: "track workout", description: "Adds a new workout to your health tracker" },
  { command: "add task", description: "Adds a new task to your to-do list" },
  { command: "schedule meeting", description: "Adds a meeting to your calendar" },
  { command: "water reminder", description: "Sets up water drinking reminders" },
  { command: "summarize day", description: "Gives you a summary of your day's activities" },
  { command: "start focus", description: "Starts a focus timer session" },
  { command: "sleep analysis", description: "Shows your sleep patterns for the week" },
  { command: "mood check", description: "Records your current mood for tracking" }
];

export function RiyaChat() {
  const { addMessage, recentMessages } = useRiya();
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'riya',
      content: `Hi there ${user?.name || 'friend'}! I'm Riya, your personal assistant. How can I help you today?`,
      timestamp: new Date(),
      hasSuggestions: true
    }
  ]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeMode, setActiveMode] = useState<'chat' | 'automation'>('chat');
  const [flirtyMode, setFlirtyMode] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    // If opening, focus on input
    if (!isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    addMessage(input); // Add to context via hook
    setInput('');

    // Process the message
    processUserMessage(input);
  };

  // Process user message and generate a response
  const processUserMessage = async (message: string) => {
    // Show typing indicator
    setIsTyping(true);
    
    // Lower case message for easier command detection
    const lowerMessage = message.toLowerCase();
    
    // If in automation mode or detected a command prefix
    if (activeMode === 'automation' || lowerMessage.startsWith('/')) {
      handleAutomationCommands(lowerMessage.replace('/', ''));
      return;
    }

    // Detect if this is a web search request
    if (lowerMessage.includes('search') || 
        lowerMessage.includes('find') || 
        lowerMessage.includes('look up') ||
        lowerMessage.includes('google')) {
      await handleWebSearch(message);
      return;
    }

    // Hindi greeting detection - multilingual response
    if (lowerMessage.includes('namaste') ||
        lowerMessage.includes('नमस्ते') ||
        lowerMessage.includes('kaise ho') ||
        lowerMessage.includes('कैसे हो') ||
        lowerMessage.includes('hi riya') ||
        lowerMessage.includes('hello riya')) {
      setTimeout(() => {
        setIsTyping(false);
        
        // Create a personalized Hindi response
        let response = '';
        
        // Personal greeting with user name in bold
        if (user?.name) {
          response = `<b>Hello ${user.name}!</b> `;
        } else {
          response = "<b>Hello there!</b> ";
        }
        
        // Add a Hindi response
        response += hindiResponses.greetings[Math.floor(Math.random() * hindiResponses.greetings.length)];
        
        // Add flirty comment if in flirty mode
        if (flirtyMode) {
          response += " " + flirtyResponses[Math.floor(Math.random() * flirtyResponses.length)];
        }
        
        const riyaMessage: Message = {
          id: Date.now().toString(),
          sender: 'riya',
          content: response,
          timestamp: new Date(),
          hasSuggestions: true
        };
        
        setMessages(prev => [...prev, riyaMessage]);
      }, 1500);
      return;
    }

    // Handle normal conversation with optional flirty responses
    setTimeout(() => {
      setIsTyping(false);
      let response = '';
      
      // Random chance of using a flirty response if flirty mode is on
      if (flirtyMode && Math.random() > 0.7) {
        response = flirtyResponses[Math.floor(Math.random() * flirtyResponses.length)];
      } else {
        // Regular responses based on message content
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
          response = `Hello <b>${user?.name || 'there'}</b>! It's lovely to chat with you today. How can I assist you?`;
        } else if (lowerMessage.includes('how are you')) {
          response = `I'm functioning perfectly, thank you for asking <b>${user?.name || 'there'}</b>! I'm here to make your day more productive and fun.`;
        } else if (lowerMessage.includes('thank')) {
          response = `You're very welcome, <b>${user?.name || 'there'}</b>! I'm always happy to help you.`;
        } else if (lowerMessage.includes('help')) {
          response = `I can help you track habits, manage tasks, search the web, or just chat! Try asking me to 'search for something' or use /commands for automation.`;
        } else if (lowerMessage.includes('joke')) {
          response = "Why don't scientists trust atoms? Because they make up everything! 😄";
        } else if (lowerMessage.includes('weather')) {
          response = "I'd love to check the weather for you, but I need permission to access your location first.";
        } else {
          response = `I understand you're interested in that, <b>${user?.name || 'there'}</b>. Would you like me to provide more information or help you track it in the app?`;
        }
      }

      const riyaMessage: Message = {
        id: Date.now().toString(),
        sender: 'riya',
        content: response,
        timestamp: new Date(),
        hasSuggestions: Math.random() > 0.5 // Randomly add suggestions
      };

      setMessages(prev => [...prev, riyaMessage]);
    }, 1000);
  };

  // Handle web search simulation
  const handleWebSearch = async (query: string) => {
    setIsTyping(false);
    setIsSearching(true);
    
    // Simulate web search delay
    setTimeout(() => {
      const searchQuery = query.replace(/search for|search|find|look up|google/i, '').trim();
      
      const searchResponse: Message = {
        id: Date.now().toString(),
        sender: 'riya',
        content: `Here are the search results for "${searchQuery}":`,
        timestamp: new Date(),
        isSearchResult: true
      };
      
      setMessages(prev => [...prev, searchResponse]);
      setIsSearching(false);
    }, 2000);
  };

  // Handle automation commands
  const handleAutomationCommands = (command: string) => {
    setTimeout(() => {
      setIsTyping(false);
      let response = '';
      
      // Trim the command
      const trimmedCommand = command.trim();
      
      // Check for known commands
      if (trimmedCommand.includes('track workout')) {
        response = `I've added a workout to your health tracker, <b>${user?.name || 'there'}</b>. Would you like to add specific exercises?`;
      } else if (trimmedCommand.includes('add task')) {
        response = `New task added to your to-do list, <b>${user?.name || 'there'}</b>. Would you like to set a deadline?`;
      } else if (trimmedCommand.includes('schedule meeting')) {
        response = `I've added a meeting to your calendar, <b>${user?.name || 'there'}</b>. Should I send invites to anyone?`;
      } else if (trimmedCommand.includes('water reminder')) {
        response = `Water drinking reminders set up, <b>${user?.name || 'there'}</b>. I'll remind you every 2 hours during the day.`;
      } else if (trimmedCommand.includes('summarize day')) {
        response = `Here's your day summary, <b>${user?.name || 'there'}</b>: 3 tasks completed, 2 hours of exercise, and 7 hours of sleep. Great job!`;
      } else if (trimmedCommand.includes('start focus')) {
        response = `Starting a 25-minute focus session, <b>${user?.name || 'there'}</b>. I'll notify you when it's time for a break.`;
      } else if (trimmedCommand.includes('sleep analysis')) {
        response = `Your sleep quality has been improving this week, <b>${user?.name || 'there'}</b>. Average of 7.5 hours with consistent bedtimes.`;
      } else if (trimmedCommand.includes('mood check')) {
        response = `I've recorded your current mood, <b>${user?.name || 'there'}</b>. Would you like to add any notes about what influenced it?`;
      } else {
        response = `I didn't recognize that command, <b>${user?.name || 'there'}</b>. Try one of the suggestions below or type 'help' for a list of commands.`;
      }
      
      const riyaMessage: Message = {
        id: Date.now().toString(),
        sender: 'riya',
        content: response,
        timestamp: new Date(),
        hasSuggestions: true
      };
      
      setMessages(prev => [...prev, riyaMessage]);
    }, 1000);
  };

  // Handle suggestion clicks
  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    inputRef.current?.focus();
  };

  // Generate suggestions based on context
  const getSuggestions = () => {
    if (activeMode === 'automation') {
      return automationCommands.slice(0, 3).map(cmd => cmd.command);
    }

    const lastMessage = messages[messages.length - 1];
    if (lastMessage.sender === 'user') return [];

    // Default suggestions
    return [
      "How is my progress today?",
      "What should I focus on next?",
      "Search for healthy habits"
    ];
  };

  return (
    <>
      {/* Chat toggle button - using gradient style for consistency */}
      <Button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 rounded-full shadow-lg size-14 p-0 btn-gradient hover:shadow-xl z-40 transition-all duration-300"
        aria-label="Chat with Riya"
      >
        {isOpen ? (
          <X className="size-6" />
        ) : (
          <Bot className="size-6" />
        )}
      </Button>

      {/* Chat interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className={`fixed ${isExpanded ? 'inset-4 md:inset-10' : 'bottom-24 right-6 w-[350px] md:w-[400px]'} shadow-2xl rounded-2xl overflow-hidden z-50`}
          >
            <Card gradient={true} className="flex flex-col h-full">
              <div className="flex items-center justify-between border-b border-white/10 p-3 bg-gradient-to-r from-[hsl(var(--gradient-start))] to-[hsl(var(--gradient-end))] text-white">
                <div className="flex items-center gap-2">
                  <Avatar className="size-8 glass-effect">
                    <Bot className="size-5 text-white" />
                  </Avatar>
                  <div>
                    <h3 className="font-medium">Riya</h3>
                    <p className="text-xs text-white/80">AI Assistant</p>
                  </div>
                  {isSearching && (
                    <Badge variant="outline" className="ml-2 animate-pulse border-white/30 text-white">
                      <Search className="size-3 mr-1" /> Searching...
                    </Badge>
                  )}
                  {isTyping && (
                    <Badge variant="outline" className="ml-2 animate-pulse border-white/30 text-white">
                      Typing...
                    </Badge>
                  )}
                </div>
                <div className="flex items-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={toggleExpanded} className="size-8 text-white hover:bg-white/10">
                          {isExpanded ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {isExpanded ? 'Minimize' : 'Maximize'}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={toggleChat} className="size-8 text-white hover:bg-white/10">
                          <X className="size-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        Close
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              <Tabs
                defaultValue="chat"
                value={activeMode}
                onValueChange={(value) => setActiveMode(value as 'chat' | 'automation')}
                className="w-full"
              >
                <div className="flex items-center justify-between px-3 pt-2">
                  <TabsList className="grid grid-cols-2 bg-gradient-to-r from-[hsl(var(--gradient-start)/0.1)] to-[hsl(var(--gradient-end)/0.1)]">
                    <TabsTrigger value="chat">Chat</TabsTrigger>
                    <TabsTrigger value="automation">Automation</TabsTrigger>
                  </TabsList>
                  
                  <div className="flex items-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant={flirtyMode ? "gradient" : "ghost"} 
                            size="icon" 
                            onClick={() => setFlirtyMode(!flirtyMode)} 
                            className="size-8"
                          >
                            <Heart className={`size-4 ${flirtyMode ? 'text-white fill-white' : ''}`} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {flirtyMode ? "Disable flirty mode" : "Enable flirty mode"}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                <TabsContent value="chat" className="m-0">
                  <div className="flex-1 overflow-y-auto p-4 h-[350px] md:h-[400px]">
                    {messages.map((message) => (
                      <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
                        <div className={`max-w-[80%] ${message.sender === 'user' ? 'btn-gradient text-white' : 'bg-muted'} rounded-2xl p-3 ${message.sender === 'user' ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}>
                          {message.sender === 'riya' ? (
                            <div dangerouslySetInnerHTML={{ __html: message.content }} />
                          ) : (
                            <p>{message.content}</p>
                          )}
                          
                          {message.isSearchResult && (
                            <div className="mt-3 space-y-2 bg-background p-2 rounded-lg">
                              <div className="flex items-center gap-2 text-sm border-b pb-2">
                                <Search className="size-3 text-muted-foreground" />
                                <span className="text-muted-foreground">Web search results</span>
                              </div>
                              {[1, 2, 3].map((i) => (
                                <div key={i} className="text-sm">
                                  <h4 className="font-medium text-blue-500">Search Result {i}</h4>
                                  <p className="text-xs text-muted-foreground">This would be a search result from the web.</p>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          <p className="text-[10px] mt-1 opacity-70 text-right">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                    
                    {/* Typing indicator */}
                    {isTyping && (
                      <div className="flex justify-start mb-4">
                        <div className="bg-muted rounded-2xl p-3 rounded-tl-sm">
                          <div className="flex gap-1">
                            <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }}></span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Suggestions */}
                    {messages.length > 0 && messages[messages.length - 1].sender === 'riya' && messages[messages.length - 1].hasSuggestions && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {getSuggestions().map((suggestion, i) => (
                          <button
                            key={i}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="text-sm bg-primary/10 hover:bg-primary/20 text-primary rounded-full px-3 py-1 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex gap-2">
                      <Input
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Type a message..."
                        className="flex-1"
                        ref={inputRef}
                      />
                      <Button type="submit" size="icon" variant="gradient" disabled={input.trim() === ''}>
                        <Send className="size-4" />
                      </Button>
                    </div>
                  </form>
                </TabsContent>
                
                <TabsContent value="automation" className="m-0">
                  <div className="flex-1 overflow-y-auto p-4 h-[350px] md:h-[400px]">
                    <div className="mb-4 p-3 glass-effect rounded-lg">
                      <h3 className="font-medium flex items-center gap-2">
                        <Zap className="size-4 text-amber-500" />
                        App Automation
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Use commands to automate actions in LifeTrackPro. Type a command or click one below.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {automationCommands.map((cmd, i) => (
                        <button
                          key={i}
                          onClick={() => handleSuggestionClick(cmd.command)}
                          className="flex items-start gap-2 p-3 bg-card hover:bg-accent/10 rounded-lg border text-left transition-colors"
                        >
                          <Play className="size-4 text-primary mt-0.5" />
                          <div>
                            <p className="font-medium text-sm">{cmd.command}</p>
                            <p className="text-xs text-muted-foreground mt-1">{cmd.description}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                    
                    {messages.filter(m => activeMode === 'automation' && m.sender === 'riya').map((message) => (
                      <div key={message.id} className="flex justify-start mb-4 mt-4">
                        <div className="max-w-[80%] bg-muted rounded-2xl p-3 rounded-tl-sm">
                          <div dangerouslySetInnerHTML={{ __html: message.content }} />
                          <p className="text-[10px] mt-1 opacity-70 text-right">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {/* Typing indicator */}
                    {isTyping && (
                      <div className="flex justify-start mb-4 mt-4">
                        <div className="bg-muted rounded-2xl p-3 rounded-tl-sm">
                          <div className="flex gap-1">
                            <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }}></span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                  
                  <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex gap-2">
                      <Input
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Type a command..."
                        className="flex-1"
                      />
                      <Button type="submit" size="icon" variant="gradient" disabled={input.trim() === ''}>
                        <Send className="size-4" />
                      </Button>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 