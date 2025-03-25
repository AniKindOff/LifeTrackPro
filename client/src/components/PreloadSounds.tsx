import { useEffect } from 'react';
import { preloadSounds, SoundEffectKey } from '@/lib/sound-manager';

export function PreloadSounds() {
  useEffect(() => {
    // Preload common sound effects on app start
    const commonSounds: SoundEffectKey[] = [
      'click',
      'success',
      'error',
      'notification',
      'complete',
      'delete',
      'gameStart',
      'gameWin',
      'gameLose',
      'correct',
      'wrong'
    ];
    
    // Use setTimeout to not block app initialization
    setTimeout(() => {
      preloadSounds(commonSounds);
      console.log('✓ Sound effects preloaded');
    }, 1000);
  }, []);

  // This component doesn't render anything
  return null;
}

export default PreloadSounds; 