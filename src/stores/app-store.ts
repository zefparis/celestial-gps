import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  language: 'fr' | 'en';
  theme: 'dark' | 'light';
  units: 'metric' | 'imperial';
  onboardingComplete: boolean;
  calibrationComplete: boolean;
  
  setLanguage: (language: 'fr' | 'en') => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setUnits: (units: 'metric' | 'imperial') => void;
  setOnboardingComplete: (complete: boolean) => void;
  setCalibrationComplete: (complete: boolean) => void;
  resetApp: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      language: 'fr',
      theme: 'dark',
      units: 'metric',
      onboardingComplete: false,
      calibrationComplete: false,
      
      setLanguage: (language) => {
        localStorage.setItem('language', language);
        set({ language });
      },
      setTheme: (theme) => set({ theme }),
      setUnits: (units) => set({ units }),
      setOnboardingComplete: (complete) => set({ onboardingComplete: complete }),
      setCalibrationComplete: (complete) => set({ calibrationComplete: complete }),
      resetApp: () => set({
        onboardingComplete: false,
        calibrationComplete: false
      })
    }),
    {
      name: 'celestial-gps-app'
    }
  )
);
