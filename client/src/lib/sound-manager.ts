/**
 * Sound Manager for LifeTrackPro
 * Manages all sound effects and game audio
 */

// Sound effect URLs - using relative paths
const SOUND_EFFECTS = {
  // UI sounds
  click: '/sounds/click.mp3',
  success: '/sounds/success.mp3',
  notification: '/sounds/notification.mp3',
  levelUp: '/sounds/levelup.mp3',
  error: '/sounds/error.mp3',
  complete: '/sounds/complete.mp3',
  delete: '/sounds/delete.mp3',
  
  // Game sounds
  gameStart: '/sounds/gameStart.mp3',
  gameWin: '/sounds/gameWin.mp3',
  gameLose: '/sounds/gameLose.mp3',
  correct: '/sounds/correct.mp3',
  wrong: '/sounds/incorrect.mp3',
  
  // Background music
  gameMusic: '/sounds/bgMusic.mp3',
  focusMusic: '/sounds/focus-music.mp3',
  relaxMusic: '/sounds/relax-music.mp3',
};

// Typed sound effect keys
export type SoundEffectKey = keyof typeof SOUND_EFFECTS;

// Volume levels
const DEFAULT_VOLUME = 0.5;
const BACKGROUND_VOLUME = 0.3;

// Background music types
export type MusicType = 'gameMusic' | 'focusMusic' | 'relaxMusic';

// For background music tracking
let currentBackgroundMusic: HTMLAudioElement | null = null;

/**
 * Play a sound effect
 * @param effect The sound effect to play
 * @param volume Volume level (0.0 to 1.0)
 * @returns The audio element that was played
 */
export const playSound = (effect: SoundEffectKey, volume = DEFAULT_VOLUME): HTMLAudioElement | null => {
  try {
    // Check if sound is enabled in local storage
    const soundEnabled = localStorage.getItem('sound_enabled') !== 'false';
    if (!soundEnabled) return null;
    
    // Create audio element
    const audio = new Audio(SOUND_EFFECTS[effect]);
    audio.volume = volume;
    
    // Capture promise from play() to handle errors silently
    const playPromise = audio.play();
    
    // Handle promise errors silently
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.error(`Sound playback error: ${error}`);
      });
    }
    
    return audio;
  } catch (error) {
    console.error(`Failed to play sound effect "${effect}":`, error);
    return null;
  }
};

/**
 * Play background music
 * @param musicType The type of background music to play
 * @param volume Volume level (0.0 to 1.0)
 * @param loop Whether to loop the music
 * @returns The audio element for the background music
 */
export const playBackgroundMusic = (
  musicType: 'gameMusic' | 'focusMusic' | 'relaxMusic',
  volume = BACKGROUND_VOLUME,
  loop = true
): HTMLAudioElement | null => {
  try {
    // Check if sound is enabled in local storage
    const soundEnabled = localStorage.getItem('sound_enabled') !== 'false';
    if (!soundEnabled) return null;
    
    // Stop any currently playing background music
    if (currentBackgroundMusic) {
      currentBackgroundMusic.pause();
      currentBackgroundMusic.currentTime = 0;
    }
    
    // Create new audio element
    const audio = new Audio(SOUND_EFFECTS[musicType]);
    audio.volume = volume;
    audio.loop = loop;
    
    // Save reference to current background music
    currentBackgroundMusic = audio;
    
    // Play the music
    const playPromise = audio.play();
    
    // Handle promise errors silently
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.error(`Background music playback error: ${error}`);
        currentBackgroundMusic = null;
      });
    }
    
    return audio;
  } catch (error) {
    console.error(`Failed to play background music "${musicType}":`, error);
    return null;
  }
};

/**
 * Stop currently playing background music
 */
export const stopBackgroundMusic = (): void => {
  if (currentBackgroundMusic) {
    currentBackgroundMusic.pause();
    currentBackgroundMusic.currentTime = 0;
    currentBackgroundMusic = null;
  }
};

/**
 * Pause currently playing background music
 */
export const pauseBackgroundMusic = (): void => {
  if (currentBackgroundMusic) {
    currentBackgroundMusic.pause();
  }
};

/**
 * Resume currently playing background music
 */
export const resumeBackgroundMusic = (): void => {
  if (currentBackgroundMusic) {
    currentBackgroundMusic.play().catch(error => {
      console.error(`Failed to resume background music:`, error);
    });
  }
};

/**
 * Set the volume for background music
 * @param volume Volume level (0.0 to 1.0)
 */
export const setBackgroundMusicVolume = (volume: number): void => {
  if (currentBackgroundMusic) {
    currentBackgroundMusic.volume = Math.max(0, Math.min(1, volume));
  }
};

/**
 * Preload sound effects for better performance
 * @param effects List of sound effects to preload
 */
export const preloadSounds = (effects: SoundEffectKey[]): void => {
  effects.forEach(effect => {
    const audio = new Audio();
    audio.src = SOUND_EFFECTS[effect];
    audio.preload = 'auto';
  });
}; 