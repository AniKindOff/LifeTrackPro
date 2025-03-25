import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Send, 
  Mic, 
  MicOff, 
  Globe, 
  Bot, 
  X,
  Languages,
  Loader2
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

type Language = "en" | "hi" | "hinglish";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  language: Language;
}

export default function ChatInterface() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<Language>("en");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: "user",
      timestamp: new Date(),
      language: currentLanguage,
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage("");
    setIsTyping(true);

    try {
      // Simulate AI thinking time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getAIResponse(message, currentLanguage),
        sender: "ai",
        timestamp: new Date(),
        language: currentLanguage,
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const getAIResponse = (message: string, language: Language): string => {
    // This is a simple response system. In a real app, you'd connect to an AI service
    const responses = {
      en: {
        greeting: "Hello! How can I help you today?",
        farewell: "Goodbye! Have a great day!",
        default: "I understand. Please tell me more.",
      },
      hi: {
        greeting: "नमस्ते! मैं आपकी कैसे मदद कर सकती हूं?",
        farewell: "अलविदा! आपका दिन शुभ हो!",
        default: "मैं समझ गई। कृपया और बताएं।",
      },
      hinglish: {
        greeting: "Namaste! Main aapki kya help kar sakti hoon?",
        farewell: "Alvida! Aapka din shubh ho!",
        default: "Main samajh gayi. Please aur batayein.",
      },
    };

    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      return responses[language].greeting;
    }
    if (lowerMessage.includes("bye") || lowerMessage.includes("goodbye")) {
      return responses[language].farewell;
    }
    return responses[language].default;
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Implement voice recording logic here
  };

  const toggleLanguage = () => {
    const languages: Language[] = ["en", "hi", "hinglish"];
    const currentIndex = languages.indexOf(currentLanguage);
    const nextIndex = (currentIndex + 1) % languages.length;
    setCurrentLanguage(languages[nextIndex]);
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full h-14 w-14 shadow-lg bg-primary hover:bg-primary/90"
        >
          <Bot className="h-6 w-6" />
        </Button>
      ) : (
        <Card className="w-96 h-[600px] flex flex-col shadow-lg">
          <div className="p-4 border-b flex items-center justify-between bg-primary/5">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/ai-avatar.svg" alt="Riya AI" />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  R
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">Riya AI</h3>
                <p className="text-xs text-muted-foreground">
                  {currentLanguage === "en" && "English"}
                  {currentLanguage === "hi" && "हिंदी"}
                  {currentLanguage === "hinglish" && "Hinglish"}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {msg.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3 flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Riya is typing...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleLanguage}
                className="h-8 w-8"
                title="Change Language"
              >
                <Globe className="h-4 w-4" />
              </Button>
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  currentLanguage === "en"
                    ? "Type your message..."
                    : currentLanguage === "hi"
                    ? "अपना संदेश लिखें..."
                    : "Apna message likhein..."
                }
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                disabled={isTyping}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleRecording}
                className={`h-8 w-8 ${
                  isRecording ? "text-destructive" : ""
                }`}
                title="Voice Input"
              >
                {isRecording ? (
                  <MicOff className="h-4 w-4" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>
              <Button
                size="icon"
                onClick={sendMessage}
                className="h-8 w-8"
                disabled={!message.trim() || isTyping}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
