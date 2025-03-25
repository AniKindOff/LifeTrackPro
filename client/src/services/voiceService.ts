import { useHealthStore } from '../stores/healthStore';
import { useProductivityStore } from '../stores/productivityStore';
import { useGoalStore } from '../stores/goalStore';

class VoiceService {
  private recognition: SpeechRecognition | null = null;
  private isListening = false;
  private wakeWord = 'hey life';

  constructor() {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new (window.webkitSpeechRecognition as any)();
      this.setupRecognition();
    }
  }

  private setupRecognition() {
    if (!this.recognition) return;

    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript.toLowerCase())
        .join('');

      if (transcript.includes(this.wakeWord)) {
        this.handleWakeWord();
      }
    };

    this.recognition.onerror = (event: SpeechRecognitionError) => {
      console.error('Speech recognition error:', event.error);
    };
  }

  private handleWakeWord() {
    this.speak('Hello! How can I help you today?');
    this.startCommandListening();
  }

  private startCommandListening() {
    if (!this.recognition) return;

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript.toLowerCase())
        .join('');

      this.processCommand(transcript);
    };
  }

  private processCommand(transcript: string) {
    const healthStore = useHealthStore.getState();
    const productivityStore = useProductivityStore.getState();
    const goalStore = useGoalStore.getState();

    if (transcript.includes('water intake')) {
      this.speak(`Your current water intake is ${healthStore.waterIntake}ml`);
    } else if (transcript.includes('mood')) {
      this.speak(`Your current mood is ${healthStore.currentMood}`);
    } else if (transcript.includes('productivity')) {
      this.speak(`Your productivity score is ${productivityStore.productivityScore}%`);
    } else if (transcript.includes('goals')) {
      const goals = goalStore.goals;
      this.speak(`You have ${goals.length} goals. ${goals.filter(g => g.progress === 100).length} are completed.`);
    } else if (transcript.includes('add water')) {
      healthStore.addWater();
      this.speak('Added 250ml to your water intake');
    } else if (transcript.includes('update mood')) {
      const mood = transcript.includes('happy') ? '😊 Happy' :
                   transcript.includes('neutral') ? '😐 Neutral' :
                   transcript.includes('sad') ? '😔 Sad' :
                   transcript.includes('stressed') ? '😤 Stressed' :
                   transcript.includes('tired') ? '😴 Tired' : null;
      
      if (mood) {
        healthStore.updateMood(mood);
        this.speak(`Updated your mood to ${mood}`);
      }
    } else {
      this.speak('I\'m not sure how to help with that. You can ask about water intake, mood, productivity, or goals.');
    }
  }

  private speak(text: string) {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  }

  public startListening() {
    if (!this.recognition) {
      console.error('Speech recognition is not supported in this browser');
      return;
    }

    if (!this.isListening) {
      this.recognition.start();
      this.isListening = true;
      console.log('Voice assistant is listening...');
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
      console.log('Voice assistant stopped listening');
    }
  }
}

export const voiceService = new VoiceService(); 