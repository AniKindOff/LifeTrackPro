import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { MessageCircle, Send } from 'lucide-react';
import type { ChatMessage } from '@shared/schema';

export default function ChatInterface() {
  const [message, setMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const messages = useQuery<ChatMessage[]>({
    queryKey: ['/api/chat/messages'],
  });

  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      const res = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error('Failed to send message');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat/messages'] });
      setMessage('');
    },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.data]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[90vw] sm:w-[440px] h-[80vh]">
        <SheetHeader>
          <SheetTitle>Chat with Riya</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col h-full pt-4">
          <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
            {messages.data?.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 flex ${
                  msg.role === 'assistant' ? 'justify-start' : 'justify-end'
                }`}
              >
                <Card
                  className={`max-w-[80%] ${
                    msg.role === 'assistant'
                      ? 'bg-secondary'
                      : 'bg-primary text-primary-foreground'
                  }`}
                >
                  <CardContent className="p-3">
                    <p className="text-sm">{msg.content}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </ScrollArea>
          
          <div className="border-t pt-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (message.trim()) {
                  sendMessage.mutate(message);
                }
              }}
              className="flex gap-2"
            >
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!message.trim() || sendMessage.isPending}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
