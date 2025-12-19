import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useAppStore } from '@/stores/app-store';
import { WelcomeScreen } from '@/features/onboarding/WelcomeScreen';
import { PermissionsRequest } from '@/features/onboarding/PermissionsRequest';
import { MainDashboard } from '@/features/dashboard/MainDashboard';
import '@/i18n/config';

function OnboardingRouter() {
  const navigate = useNavigate();
  const { onboardingComplete, setOnboardingComplete } = useAppStore();
  const [step, setStep] = useState<'welcome' | 'permissions'>('welcome');

  useEffect(() => {
    if (onboardingComplete) {
      navigate('/dashboard');
    }
  }, [onboardingComplete, navigate]);

  if (step === 'welcome') {
    return (
      <WelcomeScreen 
        onStart={() => setStep('permissions')}
        onLearnMore={() => setStep('permissions')}
      />
    );
  }

  return (
    <PermissionsRequest 
      onComplete={() => {
        setOnboardingComplete(true);
        navigate('/dashboard');
      }}
    />
  );
}

function AppRoutes() {
  const { onboardingComplete } = useAppStore();

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          onboardingComplete ? <Navigate to="/dashboard" replace /> : <OnboardingRouter />
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          onboardingComplete ? <MainDashboard /> : <Navigate to="/" replace />
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-bg-void text-text-primary">
        <AppRoutes />
        <Toaster 
          position="top-center"
          toastOptions={{
            style: {
              background: 'var(--bg-elevated)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-strong)'
            }
          }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
