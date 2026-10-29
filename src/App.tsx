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
    <div className="min-h-screen bg-obsidian-bg text-obsidian-text selection:bg-obsidian-purple selection:text-white">
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
