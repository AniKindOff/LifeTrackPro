import { useState, useEffect, useCallback } from 'react';
import {
  playSound as playSoundEffect,
  playBackgroundMusic,
  stopBackgroundMusic,
  pauseBackgroundMusic,
  resumeBackgroundMusic,
  setBackgroundMusicVolume,
  preloadSounds,
  SoundEffectKey,
  MusicType
} from '@/lib/sound-manager';

interface SoundHook {
  playSound: (id: SoundEffectKey, volume?: number) => void;
  playMusic: (type: MusicType, volume?: number, loop?: boolean) => void;
  stopMusic: () => void;
  pauseMusic: () => void;
  resumeMusic: () => void;
  setMusicVolume: (volume: number) => void;
  toggleMute: () => void;
  isMuted: boolean;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

export function useSound(): SoundHook {
  const [isMuted, setIsMuted] = useState(
    localStorage.getItem('sound_muted') === 'true'
  );
  
  const [soundEnabled, setSoundEnabled] = useState(
    localStorage.getItem('sound_enabled') !== 'false'
  );

  // Update localStorage when sound settings change
  useEffect(() => {
    localStorage.setItem('sound_muted', isMuted.toString());
  }, [isMuted]);
  
  useEffect(() => {
    localStorage.setItem('sound_enabled', soundEnabled.toString());
  }, [soundEnabled]);
  
  // Preload common sound effects on hook initialization
  useEffect(() => {
    preloadSounds([
      'click', 'success', 'error', 'complete', 'gameStart', 'gameWin', 'gameLose'
    ]);
  }, []);

  // Play a sound effect
  const playSound = useCallback((id: SoundEffectKey, volume?: number) => {
    if (isMuted || !soundEnabled) return null;
    return playSoundEffect(id, volume);
  }, [isMuted, soundEnabled]);

  // Play background music
  const playMusic = useCallback((type: MusicType, volume?: number, loop = true) => {
    if (isMuted || !soundEnabled) return null;
    return playBackgroundMusic(type, volume, loop);
  }, [isMuted, soundEnabled]);

  // Toggle global mute
  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
    
    // If unmuting, and music was playing, resume it
    if (isMuted && soundEnabled) {
      resumeBackgroundMusic();
    } else {
      pauseBackgroundMusic();
    }
  }, [isMuted, soundEnabled]);

  return {
    playSound,
    playMusic,
    stopMusic: stopBackgroundMusic,
    pauseMusic: pauseBackgroundMusic,
    resumeMusic: resumeBackgroundMusic,
    setMusicVolume: setBackgroundMusicVolume,
    toggleMute,
    isMuted,
    soundEnabled,
    setSoundEnabled
  };
} 