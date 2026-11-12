import React from 'react';
import { useApp } from './context/AppContext';
import { LandingPage } from './components/LandingPage';
import { ChatInterface } from './components/ChatInterface';
import { SettingsPage } from './components/SettingsPage';
import { NoteModal } from './components/NoteModal';
import { MultimodalModal } from './components/MultimodalModal';
import { Toasts } from './components/Toasts';

export const App: React.FC = () => {
  const { route } = useApp();

  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 selection:bg-zinc-900 selection:text-white dark:selection:bg-zinc-100 dark:selection:text-zinc-950 transition-colors duration-150">
      {route === '/' && <LandingPage />}
      {route === '/chat' && <ChatInterface />}
      {route === '/settings' && <SettingsPage />}

      {/* Global Modals & Notifications */}
      <NoteModal />
      <MultimodalModal />
      <Toasts />
    </div>
  );
};

export default App;
