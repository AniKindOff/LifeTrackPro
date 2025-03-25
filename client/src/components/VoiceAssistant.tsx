import React, { useEffect, useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from './ui/button';
import { voiceService } from '../services/voiceService';

export const VoiceAssistant: React.FC = () => {
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    return () => {
      voiceService.stopListening();
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      voiceService.stopListening();
      setIsListening(false);
    } else {
      voiceService.startListening();
      setIsListening(true);
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className={`fixed bottom-4 right-4 h-12 w-12 rounded-full ${
        isListening ? 'bg-red-500 hover:bg-red-600' : ''
      }`}
      onClick={toggleListening}
    >
      {isListening ? (
        <MicOff className="h-6 w-6 text-white" />
      ) : (
        <Mic className="h-6 w-6" />
      )}
    </Button>
  );
}; 