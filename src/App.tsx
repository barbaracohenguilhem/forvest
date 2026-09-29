import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { LandingPage } from './routes/LandingPage';
import { AppShell } from './routes/AppShell';
import { api } from './services/api';
import { User } from './types';

function AppContent() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(() => api.getCurrentUser());

  useEffect(() => {
    // Check session on load
    const user = api.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    navigate('/app');
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <LandingPage
            currentUser={currentUser}
            onEnterApp={() => navigate('/app')}
            onAuthSuccess={handleAuthSuccess}
          />
        }
      />
      <Route
        path="/app/*"
        element={
          <AppShell
            onBackToMarketing={() => navigate('/')}
          />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
