import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HealthTracker } from './components/features/health/HealthTracker';
import { VoiceAssistant } from './components/VoiceAssistant';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="lifetrackpro-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HealthTracker waterIntake={0} currentMood="neutral" waterGoal={2000} onWaterAdd={() => {}} onMoodUpdate={() => {}} />} />
        </Routes>
        <VoiceAssistant />
        <Toaster />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App; 