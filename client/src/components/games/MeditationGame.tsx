import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { 
  BrainCircuit, 
  Moon, 
  Sun, 
  Cloud, 
  Music, 
  Volume2, 
  Wind, 
  CloudRain, 
  VolumeX, 
  PlayCircle, 
  PauseCircle 
} from 'lucide-react';
import { useRiya } from '@/hooks/use-riya';

// Types
type Scene = 'forest' | 'beach' | 'night' | 'rain' | 'space';
type SoundKey = 'rain' | 'waves' | 'birds' | 'fire' | 'wind';

interface SceneConfig {
  name: string;
  icon: React.ReactNode;
  primaryColor: string;
  backgroundClass: string;
  mainSound: SoundKey;
  description: string;
}

export function MeditationGame() {
  const { addReward } = useRiya();
  
  // State
  const [isActive, setIsActive] = useState(false);
  const [selectedScene, setSelectedScene] = useState<Scene>('forest');
  const [remainingTime, setRemainingTime] = useState(300); // 5 minutes in seconds
  const [timeOption, setTimeOption] = useState<number>(300);
  const [breatheIn, setBreatheIn] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [particlesVisible, setParticlesVisible] = useState(true);
  const [totalSessionTime, setTotalSessionTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  
  // Refs
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const sessionStartTimeRef = useRef<number | null>(null);

  // Scene configurations
  const scenes: Record<Scene, SceneConfig> = {
    forest: {
      name: 'Forest',
      icon: <BrainCircuit className="size-5" />,
      primaryColor: 'green',
      backgroundClass: 'bg-gradient-to-b from-green-900 to-green-500',
      mainSound: 'birds',
      description: 'Peaceful forest with chirping birds and rustling leaves'
    },
    beach: {
      name: 'Beach',
      icon: <Sun className="size-5" />,
      primaryColor: 'blue',
      backgroundClass: 'bg-gradient-to-b from-blue-500 to-cyan-300',
      mainSound: 'waves',
      description: 'Calming waves against a serene shoreline'
    },
    night: {
      name: 'Night',
      icon: <Moon className="size-5" />,
      primaryColor: 'purple',
      backgroundClass: 'bg-gradient-to-b from-indigo-900 to-violet-700',
      mainSound: 'wind',
      description: 'Quiet night with gentle winds and distant sounds'
    },
    rain: {
      name: 'Rainy Day',
      icon: <CloudRain className="size-5" />,
      primaryColor: 'gray',
      backgroundClass: 'bg-gradient-to-b from-gray-700 to-gray-500',
      mainSound: 'rain',
      description: 'Gentle rain pattering against windows and surfaces'
    },
    space: {
      name: 'Space',
      icon: <Cloud className="size-5" />,
      primaryColor: 'indigo',
      backgroundClass: 'bg-gradient-to-b from-indigo-900 to-purple-900',
      mainSound: 'wind',
      description: 'Expansive cosmic ambience for deep meditation'
    }
  };

  // Initialize timer and sound when scene or active state changes
  useEffect(() => {
    if (isActive) {
      // Start the main timer
      timerRef.current = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            completeSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      // Start the breathing animation interval
      const breatheInterval = setInterval(() => {
        setBreatheIn(prev => !prev);
      }, 4000); // 4 seconds in, 4 seconds out
      
      // Record session start time
      sessionStartTimeRef.current = Date.now();
      
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
        clearInterval(breatheInterval);
      };
    } else {
      // Clean up if paused or stopped
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  }, [isActive, selectedScene]);

  // Handle breathing circle animation
  const breatheVariants = {
    in: { scale: 1.3, opacity: 0.9, transition: { duration: 4, ease: "easeInOut" } },
    out: { scale: 1, opacity: 0.6, transition: { duration: 4, ease: "easeInOut" } }
  };

  // Handle particles animation
  const particles = Array.from({ length: 20 }, (_, i) => i);
  
  const getRandomPosition = () => {
    return {
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 5 + 2,
      delay: Math.random() * 5
    };
  };

  // Format time for display (MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start meditation session
  const startSession = () => {
    setIsActive(true);
    setSessionComplete(false);
    setRemainingTime(timeOption);
  };

  // Pause meditation session
  const pauseSession = () => {
    setIsActive(false);
  };

  // Complete meditation session
  const completeSession = () => {
    setIsActive(false);
    setSessionComplete(true);
    
    // Calculate total session time
    if (sessionStartTimeRef.current) {
      const sessionDurationMs = Date.now() - sessionStartTimeRef.current;
      const sessionMinutes = Math.floor(sessionDurationMs / (1000 * 60));
      setTotalSessionTime(sessionMinutes);
      
      // Add reward based on time spent
      const rewardAmount = Math.max(50, Math.floor(sessionMinutes * 10));
      addReward(rewardAmount, `Completed ${sessionMinutes} minute meditation session`);
      
      // Reset start time
      sessionStartTimeRef.current = null;
    }
  };

  // Choose a new scene
  const selectScene = (scene: Scene) => {
    setSelectedScene(scene);
  };

  // Set a new time option
  const selectTimeOption = (seconds: number) => {
    setTimeOption(seconds);
    if (!isActive) {
      setRemainingTime(seconds);
    }
  };

  // Toggle particle visibility
  const toggleParticles = () => {
    setParticlesVisible(!particlesVisible);
  };
  
  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {/* Active meditation view */}
        {isActive ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`relative rounded-lg overflow-hidden ${scenes[selectedScene].backgroundClass} min-h-[500px] flex flex-col items-center justify-center p-6`}
          >
            {/* Floating particles */}
            {particlesVisible && (
              <div className="absolute inset-0 overflow-hidden">
                {particles.map((i) => {
                  const { x, y, size, delay } = getRandomPosition();
                  return (
                    <motion.div
                      key={i}
                      className="absolute rounded-full bg-white/30"
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        width: `${size}px`,
                        height: `${size}px`,
                      }}
                      animate={{
                        y: [y, y - 20, y - 40, y - 60, y - 80],
                        opacity: [0, 0.5, 0.8, 0.5, 0],
                        scale: [1, 1.2, 1.5, 1.2, 1]
                      }}
                      transition={{
                        duration: 10 + delay,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  );
                })}
              </div>
            )}
            
            {/* Controls */}
            <div className="absolute top-4 right-4 flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="bg-white/10 hover:bg-white/20 text-white"
                onClick={toggleMute}
              >
                {isMuted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="bg-white/10 hover:bg-white/20 text-white"
                onClick={toggleParticles}
              >
                <Wind className="size-5" />
              </Button>
            </div>
            
            {/* Scene name */}
            <div className="absolute top-4 left-4">
              <Badge variant="outline" className="bg-white/10 text-white border-white/20">
                {scenes[selectedScene].name}
              </Badge>
            </div>
            
            {/* Breathing circle */}
            <motion.div
              variants={breatheVariants}
              animate={breatheIn ? "in" : "out"}
              className="relative z-10 rounded-full bg-white/30 backdrop-blur-md w-40 h-40 flex items-center justify-center mb-8"
            >
              <div className="text-white text-center">
                <p className="text-lg font-medium">{breatheIn ? "Breathe In" : "Breathe Out"}</p>
                <p className="text-3xl font-bold mt-2">{formatTime(remainingTime)}</p>
              </div>
            </motion.div>
            
            {/* Session controls */}
            <div className="relative z-10 mt-8">
              <Button
                size="lg"
                variant="outline"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                onClick={pauseSession}
              >
                <PauseCircle className="mr-2 size-5" />
                Pause Session
              </Button>
            </div>
          </motion.div>
        ) : (
          // Setup/completion view
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BrainCircuit className="size-5" />
                Mind Relaxation
              </CardTitle>
              <CardDescription>
                {sessionComplete 
                  ? `Congratulations! You completed a ${totalSessionTime} minute meditation session.`
                  : 'Take a moment to relax, breathe, and clear your mind'
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Scene selection */}
              <div>
                <h3 className="text-sm font-medium mb-3">Choose Environment</h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {(Object.keys(scenes) as Scene[]).map((scene) => (
                    <Button
                      key={scene}
                      variant={selectedScene === scene ? "default" : "outline"} 
                      className={`flex flex-col h-20`}
                      onClick={() => selectScene(scene)}
                    >
                      {scenes[scene].icon}
                      <span className="mt-1">{scenes[scene].name}</span>
                    </Button>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {scenes[selectedScene].description}
                </p>
              </div>
              
              {/* Time selection */}
              <div>
                <h3 className="text-sm font-medium mb-3">Session Duration</h3>
                <div className="flex flex-wrap gap-2">
                  {[300, 600, 900, 1200, 1800].map((seconds) => (
                    <Button
                      key={seconds}
                      variant={timeOption === seconds ? "default" : "outline"}
                      onClick={() => selectTimeOption(seconds)}
                    >
                      {seconds / 60} min
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Sound controls */}
              <div>
                <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Music className="size-4" />
                  Sound Options
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Volume</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={toggleMute}
                  >
                    {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
                  </Button>
                </div>
                <div className="pt-2">
                  <Slider
                    defaultValue={[70]}
                    max={100}
                    step={1}
                    disabled={isMuted}
                  />
                </div>
              </div>
              
              {/* Session stats (when completed) */}
              {sessionComplete && (
                <Card className="bg-muted/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Session Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Duration</p>
                        <p className="text-xl font-bold">{totalSessionTime} minutes</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Environment</p>
                        <p className="text-xl font-bold">{scenes[selectedScene].name}</p>
                      </div>
                    </div>
                    <Badge className="mt-4 bg-green-100 text-green-800 border-green-200">
                      +{Math.max(50, Math.floor(totalSessionTime * 10))} coins earned
                    </Badge>
                  </CardContent>
                </Card>
              )}
            </CardContent>
            
            <CardFooter>
              <Button 
                onClick={startSession} 
                className="w-full"
                size="lg"
              >
                <PlayCircle className="mr-2 size-5" />
                Start Meditation Session
              </Button>
            </CardFooter>
          </Card>
        )}
      </AnimatePresence>
    </div>
  );
} 