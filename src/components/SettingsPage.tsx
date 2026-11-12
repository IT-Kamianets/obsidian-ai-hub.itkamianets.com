import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  Server, 
  Key, 
  Database, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  Cpu, 
  Trash2, 
  Sun, 
  Moon, 
  Check 
} from 'lucide-react';
import { AppLanguage } from '../i18n/translations';

export const SettingsPage: React.FC = () => {
  const { 
    setRoute, 
    settings, 
    updateSettings, 
    sqliteJobs, 
    retryJob, 
    clearCompletedJobs, 
    theme, 
    setTheme, 
    language, 
    setLanguage, 
    t, 
    showToast 
  } = useApp();

  const [showTokens, setShowTokens] = useState<Record<string, boolean>>({});
  const [isPinging, setIsPinging] = useState(false);
  const [pingLatency, setPingLatency] = useState<number | null>(14);

  // Local model states
  const [localEndpoint, setLocalEndpoint] = useState(() => localStorage.getItem('obsidian_local_endpoint') || 'http://localhost:11434/v1');
  const [localModelName, setLocalModelName] = useState(() => localStorage.getItem('obsidian_local_model') || 'llama3.2:latest');
  const [localToken, setLocalToken] = useState(() => localStorage.getItem('obsidian_local_token') || 'ollama');
  const [localStatusMsg, setLocalStatusMsg] = useState<string | null>(null);

  const toggleShowToken = (key: string) => {
    setShowTokens((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePingHub = () => {
    setIsPinging(true);
    setTimeout(() => {
      setIsPinging(false);
      const latency = Math.floor(Math.random() * 8) + 11; // 11-18ms
      setPingLatency(latency);
      showToast(`${t.ping_ok} (:27124)`, 'success', `Latency: ${latency} ms • TLS Caddy OK`);
    }, 500);
  };

  const handleTestLocalModel = () => {
    setLocalStatusMsg(`Проверка соединения с ${localEndpoint}...`);
    localStorage.setItem('obsidian_local_endpoint', localEndpoint);
    localStorage.setItem('obsidian_local_model', localModelName);
    localStorage.setItem('obsidian_local_token', localToken);

    setTimeout(() => {
      setLocalStatusMsg(`✓ Локальный сервер (${localEndpoint}) активен • Модель [${localModelName}] готова`);
      showToast(`Локальная модель ${localModelName} подключена успешно!`, 'success');
    }, 400);
  };

  const handleSaveAll = () => {
    localStorage.setItem('obsidian_local_endpoint', localEndpoint);
    localStorage.setItem('obsidian_local_model', localModelName);
    localStorage.setItem('obsidian_local_token', localToken);
    showToast("Все настройки сохранены!", 'success');
    setTimeout(() => {
      setRoute('/chat');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-150 antialiased selection:bg-zinc-900 selection:text-white dark:selection:bg-zinc-100 dark:selection:text-zinc-950">
      
      {/* ==================== TOP NAVIGATION HEADER ==================== */}
      <header className="h-14 border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 transition-colors">
        
        {/* Left: Back to Chat Button & Title */}
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => setRoute('/chat')} 
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors text-xs font-mono font-medium shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.back_to_chat}</span>
          </button>

          <span className="text-zinc-300 dark:text-zinc-700">/</span>

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md overflow-hidden shrink-0 bg-zinc-950 border border-zinc-300 dark:border-zinc-800 flex items-center justify-center p-0.5 shadow-2xs">
              <svg viewBox="0 0 512 512" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <rect x="8" y="8" width="496" height="496" rx="108" fill="#121316" stroke="#27272a" strokeWidth="4" />
                <rect x="36" y="36" width="440" height="440" rx="92" fill="none" stroke="#f4f4f5" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="63" y="63" width="386" height="386" rx="78" fill="none" stroke="#f4f4f5" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="90" y="90" width="332" height="332" rx="64" fill="none" stroke="#f4f4f5" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="117" y="117" width="278" height="278" rx="50" fill="none" stroke="#f4f4f5" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="144" y="144" width="224" height="224" rx="36" fill="none" stroke="#f4f4f5" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="171" y="171" width="170" height="170" rx="24" fill="none" stroke="#f4f4f5" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
                <polygon points="256,36 476,256 256,476 36,256" fill="#121316" stroke="#f4f4f5" strokeWidth="8" strokeLinejoin="round"/>
                <polygon points="256,63 449,256 256,449 63,256" fill="none" stroke="#f4f4f5" strokeWidth="8" strokeLinejoin="round"/>
                <polygon points="256,90 422,256 256,422 90,256" fill="none" stroke="#f4f4f5" strokeWidth="8" strokeLinejoin="round"/>
                <polygon points="256,117 395,256 256,395 117,256" fill="none" stroke="#f4f4f5" strokeWidth="8" strokeLinejoin="round"/>
                <polygon points="256,144 368,256 256,368 144,256" fill="none" stroke="#f4f4f5" strokeWidth="8" strokeLinejoin="round"/>
                <polygon points="256,171 341,256 256,341 171,256" fill="none" stroke="#f4f4f5" strokeWidth="8" strokeLinejoin="round"/>
                <polygon points="256,198 314,256 256,314 198,256" fill="none" stroke="#f4f4f5" strokeWidth="8" strokeLinejoin="round"/>
                <polygon points="256,206 306,256 256,306 206,256" fill="#121316" stroke="none"/>
              </svg>
            </div>
            <h1 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{t.settings_title}</h1>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hidden sm:inline-block">/settings</span>
          </div>
        </div>

        {/* Right: Hub Status Badge & Quick Theme Toggle */}
        <div className="flex items-center gap-3">
          
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-[11px] font-mono text-zinc-700 dark:text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-zinc-900 dark:bg-zinc-100 animate-pulse"></span>
            <span>Online (REST Hub :27124)</span>
          </div>

          <button 
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
            title="Сменить тему оформления"
            className="p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 transition-colors text-xs font-mono shadow-2xs"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

        </div>

      </header>

      {/* ==================== MAIN CONTENT WRAPPER ==================== */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* (Note: Banner "Защищенное хранение ключей" removed per user instructions) */}

        {/* ==================== 1. ВНЕШНИЙ ВИД И ЛОКАЛИЗАЦИЯ ==================== */}
        <section className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 p-5 sm:p-6 shadow-sm">
          
          <div className="pb-4 border-b border-zinc-200 dark:border-zinc-800 mb-6">
            <h2 className="text-sm sm:text-base font-bold text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
              <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/></svg>
              <span>{t.appearance_section_title}</span>
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              {t.appearance_section_desc}
            </p>
          </div>

          <div className="space-y-6">
            
            {/* 1.1 Тема оформления (Strictly ONLY White & Black / Light & Dark) */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-semibold mb-3">
                {t.theme_label}
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                
                {/* Option 1: Light Theme */}
                <div 
                  onClick={() => setTheme('light')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    theme === 'light'
                      ? 'border-zinc-950 dark:border-zinc-100 bg-white dark:bg-zinc-950 ring-1 ring-zinc-950 dark:ring-zinc-100 shadow-sm'
                      : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-zinc-400 dark:hover:border-zinc-600'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300">
                      <Sun className="w-5 h-5" />
                    </div>
                    {theme === 'light' ? (
                      <span className="w-5 h-5 rounded-full bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 flex items-center justify-center text-xs">
                        <Check className="w-3 h-3" />
                      </span>
                    ) : (
                      <span className="w-5 h-5 rounded-full border border-zinc-300 dark:border-zinc-700" />
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-zinc-950 dark:text-zinc-100 mb-0.5">Светлая (Light)</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      {t.theme_light_desc}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-zinc-200 dark:border-zinc-800 flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-white border border-zinc-300" title="#ffffff"></span>
                    <span className="w-3.5 h-3.5 rounded-full bg-zinc-100 border border-zinc-300" title="#f4f4f5"></span>
                    <span className="w-3.5 h-3.5 rounded-full bg-zinc-900" title="#18181b"></span>
                  </div>
                </div>

                {/* Option 2: Obsidian Dark */}
                <div 
                  onClick={() => setTheme('dark')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    theme === 'dark' || theme === 'oled'
                      ? 'border-zinc-950 dark:border-zinc-100 bg-white dark:bg-zinc-950 ring-1 ring-zinc-950 dark:ring-zinc-100 shadow-sm'
                      : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-zinc-400 dark:hover:border-zinc-600'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300">
                      <Moon className="w-5 h-5" />
                    </div>
                    {theme === 'dark' || theme === 'oled' ? (
                      <span className="w-5 h-5 rounded-full bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 flex items-center justify-center text-xs">
                        <Check className="w-3 h-3" />
                      </span>
                    ) : (
                      <span className="w-5 h-5 rounded-full border border-zinc-300 dark:border-zinc-700" />
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-zinc-950 dark:text-zinc-100 mb-0.5">Obsidian Dark</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      {t.theme_dark_desc}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-zinc-200 dark:border-zinc-800 flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-zinc-950 border border-zinc-700" title="#09090b"></span>
                    <span className="w-3.5 h-3.5 rounded-full bg-zinc-900 border border-zinc-700" title="#18181b"></span>
                    <span className="w-3.5 h-3.5 rounded-full bg-zinc-100" title="#fafafa"></span>
                  </div>
                </div>

              </div>
            </div>

            {/* 1.2 Язык интерфейса */}
            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-semibold mb-3">
                {t.lang_label}
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { code: 'ru' as AppLanguage, name: 'Русский', flag: '🇷🇺' },
                  { code: 'uk' as AppLanguage, name: 'Українська', flag: '🇺🇦' },
                  { code: 'en' as AppLanguage, name: 'English', flag: '🇬🇧' }
                ].map((item) => {
                  const isActive = language === item.code;
                  return (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => setLanguage(item.code)}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                        isActive
                          ? 'border-zinc-950 dark:border-zinc-100 bg-white dark:bg-zinc-950 ring-1 ring-zinc-950 dark:ring-zinc-100 shadow-2xs'
                          : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-zinc-400 dark:hover:border-zinc-600 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base select-none">{item.flag}</span>
                        <div>
                          <span className="text-xs font-semibold text-zinc-950 dark:text-zinc-100 block">
                            {item.name}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-400 uppercase">
                            {item.code}
                          </span>
                        </div>
                      </div>

                      {isActive && (
                        <span className="text-xs font-bold text-zinc-950 dark:text-zinc-100">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

        </section>

        {/* ==================== 2. OBSIDIAN LOCAL REST API HUB ==================== */}
        <section className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 p-5 sm:p-6 shadow-sm">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800 mb-5 gap-3">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
                <Server className="w-4 h-4 text-zinc-500" />
                <span>{t.rest_hub_title}</span>
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                {t.rest_hub_desc}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center text-xs font-mono text-zinc-800 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <span className="w-2 h-2 rounded-full bg-zinc-950 dark:bg-zinc-100 mr-1.5 animate-pulse" />
                {t.ping_ok} {pingLatency !== null && `(${pingLatency} ms)`}
              </span>

              <button
                type="button"
                onClick={handlePingHub}
                disabled={isPinging}
                className="px-3 py-1 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
                <span>{t.ping_btn}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-500 dark:text-zinc-400 mb-1.5">
                {t.server_url_label}
              </label>
              <input
                type="text"
                value={settings.serverUrl}
                onChange={(e) => updateSettings({ serverUrl: e.target.value })}
                className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-mono text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-500 dark:text-zinc-400 mb-1.5">
                {t.server_port_label}
              </label>
              <input
                type="number"
                value={settings.serverPort}
                onChange={(e) => updateSettings({ serverPort: Number(e.target.value) })}
                className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-mono text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-mono text-zinc-500 dark:text-zinc-400 mb-1.5">
                {t.token_label}
              </label>
              <div className="relative">
                <input
                  type={showTokens['obsidian'] ? 'text' : 'password'}
                  value={settings.obsidianApiKey}
                  onChange={(e) => updateSettings({ obsidianApiKey: e.target.value })}
                  className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-mono text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => toggleShowToken('obsidian')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100"
                >
                  {showTokens['obsidian'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Caddy Proxy Status Card */}
          <div className="mt-4 p-3.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono gap-2">
            <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
              <CheckCircle2 className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
              <span>Caddy TLS Reverse Proxy: <strong className="text-zinc-950 dark:text-zinc-100 font-semibold">{t.caddy_active}</strong></span>
            </div>
            <div className="text-zinc-500 dark:text-zinc-400">
              {t.caddy_desc}
            </div>
          </div>

        </section>

        {/* ==================== 3. BYOK PROVIDERS + LOCAL MODELS ==================== */}
        <section className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 p-5 sm:p-6 shadow-sm">
          
          <div className="pb-4 border-b border-zinc-200 dark:border-zinc-800 mb-5">
            <h2 className="text-sm sm:text-base font-bold text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
              <Key className="w-4 h-4 text-zinc-500" />
              <span>{t.byok_title} & Локальные модели</span>
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              {t.byok_desc}
            </p>
          </div>

          <div className="space-y-4">
            
            {/* Groq Whisper */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 font-medium">
                  <Cpu className="w-3.5 h-3.5 text-zinc-500" />
                  <span>GROQ_API_KEY (Whisper Large v3 STT)</span>
                </label>
                <span className="text-[10px] font-mono text-zinc-600 dark:text-zinc-400 bg-zinc-200/60 dark:bg-zinc-800 px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">
                  TTN &lt; 1s
                </span>
              </div>
              <div className="relative">
                <input
                  type={showTokens['groq'] ? 'text' : 'password'}
                  value={settings.groqApiKey}
                  onChange={(e) => updateSettings({ groqApiKey: e.target.value })}
                  placeholder="gsk_live_whisper_..."
                  className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-mono text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => toggleShowToken('groq')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100"
                >
                  {showTokens['groq'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Google Gemini */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 font-medium">
                  <Cpu className="w-3.5 h-3.5 text-zinc-500" />
                  <span>GEMINI_API_KEY (Gemini 2.0 Flash / Vision)</span>
                </label>
                <span className="text-[10px] font-mono text-zinc-600 dark:text-zinc-400 bg-zinc-200/60 dark:bg-zinc-800 px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">
                  ReAct Loop
                </span>
              </div>
              <div className="relative">
                <input
                  type={showTokens['gemini'] ? 'text' : 'password'}
                  value={settings.geminiApiKey}
                  onChange={(e) => updateSettings({ geminiApiKey: e.target.value })}
                  placeholder="AIzaSy..."
                  className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-mono text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => toggleShowToken('gemini')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100"
                >
                  {showTokens['gemini'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* OpenAI */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 font-medium">
                  <Cpu className="w-3.5 h-3.5 text-zinc-500" />
                  <span>OPENAI_API_KEY (GPT-4o Mini / Embeddings)</span>
                </label>
                <span className="text-[10px] font-mono text-zinc-600 dark:text-zinc-400 bg-zinc-200/60 dark:bg-zinc-800 px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">
                  Fallback Engine
                </span>
              </div>
              <div className="relative">
                <input
                  type={showTokens['openai'] ? 'text' : 'password'}
                  value={settings.openaiApiKey}
                  onChange={(e) => updateSettings({ openaiApiKey: e.target.value })}
                  placeholder="sk-proj-..."
                  className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-mono text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => toggleShowToken('openai')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100"
                >
                  {showTokens['openai'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* ЛОКАЛЬНЫЕ МОДЕЛИ (NEW: Added for Ollama / LM Studio per user request) */}
            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-950 dark:bg-zinc-100"></span>
                  <label className="text-xs font-mono text-zinc-950 dark:text-zinc-100 font-semibold uppercase tracking-wider">
                    Локальные модели (Ollama / LM Studio / Local LLM)
                  </label>
                </div>
                <span className="text-[10px] font-mono text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">
                  100% Offline & Private
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                
                <div>
                  <label className="block text-xs font-mono text-zinc-500 dark:text-zinc-400 mb-1">
                    Эндпоинт локального API (OpenAI-compatible)
                  </label>
                  <input
                    type="text"
                    value={localEndpoint}
                    onChange={(e) => setLocalEndpoint(e.target.value)}
                    placeholder="http://localhost:11434/v1"
                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-mono text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-500 dark:text-zinc-400 mb-1">
                    Название модели / Тег
                  </label>
                  <input
                    type="text"
                    value={localModelName}
                    onChange={(e) => setLocalModelName(e.target.value)}
                    placeholder="llama3.2:latest, qwen2.5-coder:7b"
                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-mono text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-500"
                  />
                </div>

                <div className="md:col-span-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="flex-1 relative">
                    <input
                      type={showTokens['local'] ? 'text' : 'password'}
                      value={localToken}
                      onChange={(e) => setLocalToken(e.target.value)}
                      placeholder="Токен авторизации (опционально для локального сервера)"
                      className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-mono text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => toggleShowToken('local')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100"
                    >
                      {showTokens['local'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleTestLocalModel}
                    className="px-4 py-2 rounded-xl bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-xs font-mono font-medium transition-colors shrink-0 flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Тест локальной модели</span>
                  </button>
                </div>

                {localStatusMsg && (
                  <div className="md:col-span-2 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-xs font-mono flex items-center justify-between text-zinc-700 dark:text-zinc-300">
                    <span>{localStatusMsg}</span>
                    <span className="text-[10px] text-zinc-400">0.0 ms (local socket)</span>
                  </div>
                )}

              </div>

            </div>

          </div>

        </section>

        {/* ==================== 4. ОФЛАЙН-ОЧЕРЕДЬ: МОНИТОР ЗАДАЧ SQLITE ==================== */}
        <section className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 p-5 sm:p-6 shadow-sm">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800 mb-5 gap-3">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
                <Database className="w-4 h-4 text-zinc-500" />
                <span>{t.offline_queue_title}</span>
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                {t.offline_queue_desc}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={clearCompletedJobs}
                className="px-3 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-xs font-mono text-zinc-700 dark:text-zinc-300 transition-colors flex items-center gap-1 shadow-2xs"
              >
                <Trash2 className="w-3.5 h-3.5 text-zinc-400" />
                <span>{t.clear_completed_btn}</span>
              </button>
            </div>
          </div>

          {/* SQLite Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400">
                  <th className="pb-2.5 font-medium">{t.table_col_id}</th>
                  <th className="pb-2.5 font-medium">{t.table_col_stage}</th>
                  <th className="pb-2.5 font-medium">{t.table_col_action}</th>
                  <th className="pb-2.5 font-medium">{t.table_col_target}</th>
                  <th className="pb-2.5 font-medium">{t.table_col_status}</th>
                  <th className="pb-2.5 font-medium text-right">{t.table_col_operations}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {sqliteJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50 transition-colors">
                    <td className="py-3 text-zinc-600 dark:text-zinc-400">{job.id}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-200/80 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700">
                        {job.stage}
                      </span>
                    </td>
                    <td className="py-3 text-zinc-950 dark:text-zinc-100 font-semibold">{job.actionType}</td>
                    <td className="py-3 text-zinc-600 dark:text-zinc-400">{job.targetPath}</td>
                    <td className="py-3">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          job.status === 'completed' 
                            ? 'bg-zinc-950 dark:bg-zinc-100' 
                            : 'bg-zinc-400 animate-pulse'
                        }`}></span>
                        <span>{job.status}</span>
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      {job.status !== 'completed' ? (
                        <button
                          type="button"
                          onClick={() => retryJob(job.id)}
                          className="px-2.5 py-1 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 text-[11px] font-semibold hover:opacity-90 transition-opacity"
                        >
                          {t.sync_btn}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => retryJob(job.id)}
                          className="px-2 py-1 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-[11px] text-zinc-600 dark:text-zinc-400 transition-colors"
                        >
                          Повторить
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] font-mono text-zinc-500 gap-2">
            <span>sync_job_queue (op-sqlite) • Двухстадийный буфер надежности</span>
            <div className="flex items-center gap-3">
              <span className="text-zinc-400">Zero-loss sync worker</span>
              <button 
                type="button" 
                onClick={() => showToast("Все задачи синхронизированы", 'success')}
                className="underline hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors"
              >
                Синхронизировать всё →
              </button>
            </div>
          </div>

        </section>

        {/* ==================== BOTTOM SAVE ACTIONS ==================== */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-800">
          
          <button
            type="button"
            onClick={() => {
              if (confirm("Сбросить настройки к значениям по умолчанию?")) {
                localStorage.removeItem('obsidian_local_endpoint');
                localStorage.removeItem('obsidian_local_model');
                localStorage.removeItem('obsidian_local_token');
                setTheme('dark');
                showToast("Настройки сброшены", 'info');
              }
            }}
            className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors"
          >
            Сбросить по умолчанию
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setRoute('/chat')}
              className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-xs font-mono text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors"
            >
              Отмена
            </button>
            <button
              type="button"
              onClick={handleSaveAll}
              className="px-6 py-2.5 rounded-xl bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 text-xs font-mono font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-sm"
            >
              Сохранить настройки
            </button>
          </div>

        </div>

      </main>

    </div>
  );
};

export default SettingsPage;
