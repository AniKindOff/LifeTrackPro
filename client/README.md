# LifeTrackPro Client

## Sound System Reference

LifeTrackPro uses a centralized sound management system for consistent audio feedback throughout the application.

### Using Sound Effects

```typescript
// Import the hook
import { useSound } from '@/hooks/use-sound';

function MyComponent() {
  // Get sound functions from the hook
  const { playSound, soundEnabled } = useSound();
  
  const handleButtonClick = () => {
    // Only play sound if enabled
    if (soundEnabled) {
      playSound('click');
    }
    
    // Rest of your code...
  };
  
  return (
    <button onClick={handleButtonClick}>
      Click Me
    </button>
  );
}
```

### Available Sound Effects

- UI Sounds: `click`, `success`, `notification`, `levelUp`, `error`, `complete`, `delete`
- Game Sounds: `gameStart`, `gameWin`, `gameLose`, `correct`, `wrong`

### Playing Background Music

```typescript
const { playMusic, stopMusic, pauseMusic, resumeMusic } = useSound();

// Start playing background music
playMusic('gameMusic');

// Stop music when component unmounts
useEffect(() => {
  return () => stopMusic();
}, [stopMusic]);

// Handle visibility changes
useEffect(() => {
  const handleVisibilityChange = () => {
    if (document.hidden) {
      pauseMusic();
    } else {
      resumeMusic();
    }
  };
  
  document.addEventListener('visibilitychange', handleVisibilityChange);
  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}, [pauseMusic, resumeMusic]);
```

### Available Music Types

- `gameMusic`
- `focusMusic`
- `relaxMusic`

### Sound Settings in the UI

The application includes sound settings in the Settings page, allowing users to:

1. Toggle sound effects on/off
2. Adjust sound volume

These settings are automatically saved to localStorage and applied throughout the application. 