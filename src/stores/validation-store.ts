import { create } from 'zustand';
import type { ValidationResult, ValidationConfig, ValidationStatus } from '@/types/validation';
import { DEFAULT_VALIDATION_CONFIG } from '@/types/validation';

interface ValidationStore {
  config: ValidationConfig;
  currentResult: ValidationResult | null;
  history: ValidationResult[];
  isValidating: boolean;
  
  setConfig: (config: Partial<ValidationConfig>) => void;
  setCurrentResult: (result: ValidationResult | null) => void;
  addToHistory: (result: ValidationResult) => void;
  clearHistory: () => void;
  setIsValidating: (validating: boolean) => void;
  
  getAverageIntegrity: () => number;
  getSpoofingCount: () => number;
  getStatusCounts: () => Record<ValidationStatus, number>;
}

const MAX_HISTORY_SIZE = 1000;

export const useValidationStore = create<ValidationStore>((set, get) => ({
  config: DEFAULT_VALIDATION_CONFIG,
  currentResult: null,
  history: [],
  isValidating: false,
  
  setConfig: (newConfig) => set((state) => ({
    config: { ...state.config, ...newConfig }
  })),
  
  setCurrentResult: (result) => set({ currentResult: result }),
  
  addToHistory: (result) => set((state) => {
    const newHistory = [result, ...state.history].slice(0, MAX_HISTORY_SIZE);
    return { history: newHistory };
  }),
  
  clearHistory: () => set({ history: [] }),
  
  setIsValidating: (validating) => set({ isValidating: validating }),
  
  getAverageIntegrity: () => {
    const { history } = get();
    if (history.length === 0) return 0;
    const sum = history.reduce((acc, r) => acc + r.integrityScore, 0);
    return sum / history.length;
  },
  
  getSpoofingCount: () => {
    const { history } = get();
    return history.filter(r => r.status === 'SPOOFING').length;
  },
  
  getStatusCounts: () => {
    const { history } = get();
    const counts: Record<ValidationStatus, number> = {
      NOMINAL: 0,
      DRIFT: 0,
      SPOOFING: 0,
      UNCERTAIN: 0
    };
    history.forEach(r => counts[r.status]++);
    return counts;
  }
}));
