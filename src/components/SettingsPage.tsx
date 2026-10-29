import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  Server, 
  Key, 
  Database, 
  Shield, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  Wifi, 
  WifiOff, 
  Cpu, 
  Trash2,
  Palette,
  Sun,
  Moon,
  CircleDot,
  Globe,
  Check
} from 'lucide-react';
import { AppTheme, AppLanguage } from '../i18n/translations';

export const SettingsPage: React.FC = () => {
  const { 
    setRoute, 
    settings, 
    updateSettings, 
    sqliteJobs, 
    retryJob, 
    clearCompletedJobs,
    toggleOfflineMode,
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
    }, 600);
  };

  return (
    <div className="min-h-screen bg-obsidian-bg text-obsidian-text flex flex-col font-sans transition-colors duration-200">
      {/* Top Header */}
      <header className="border-b border-obsidian-border bg-obsidian-subtle/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setRoute('/chat')}
              className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-obsidian-surface hover:bg-obsidian-elevated border border-obsidian-border text-obsidian-text hover:text-white transition-colors text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.back_to_chat}</span>
            </button>
            <div className="h-4 w-px bg-obsidian-border" />
            <h1 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <Server className="w-5 h-5 text-purple-400" />
              <span>{t.settings_title}</span>
            </h1>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={toggleOfflineMode}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center space-x-1.5 border transition-all ${
                settings.offlineMode
                  ? 'bg-amber-950/60 border-amber-600 text-amber-300 shadow-md shadow-amber-950/30'
                  : 'bg-emerald-950/40 border-emerald-700/60 text-emerald-300'
              }`}
            >
              {settings.offlineMode ? (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.offline_status}</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t.online_status}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Secure Store Notice Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-obsidian-surface border border-purple-800/40 flex items-start space-x-3.5 shadow-md">
          <div className="p-2 rounded-xl bg-purple-900/50 border border-purple-700/50 text-purple-300 shrink-0 mt-0.5">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white flex items-center space-x-2">
              <span>{t.secure_store_title}</span>
              <span className="text-[11px] font-mono text-purple-400 bg-purple-900/60 px-2 py-0.5 rounded-full border border-purple-700/40">
                AES-GCM-256
              </span>
            </h4>
            <p className="text-xs text-obsidian-muted mt-1 leading-relaxed">
              {t.secure_store_desc}
            </p>
          </div>
        </div>

        {/* SECTION 1 (NEW): Appearance & Localization (Внешний вид и локализация) */}
        <section className="bg-obsidian-surface border border-obsidian-border rounded-2xl p-5 sm:p-6 shadow-obsidian-card animate-fade-in">
          <div className="pb-4 border-b border-obsidian-border mb-6">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <Palette className="w-5 h-5 text-purple-400" />
              <span>{t.appearance_section_title}</span>
            </h2>
            <p className="text-xs text-obsidian-muted mt-0.5">
              {t.appearance_section_desc}
            </p>
          </div>

          <div className="space-y-6">
            {/* 1. Theme Selector */}
            <div>
              <label className="block text-xs font-mono text-purple-300 font-semibold mb-3 flex items-center space-x-1.5">
                <Sun className="w-3.5 h-3.5 text-purple-400" />
                <span>{t.theme_label}</span>
              </label>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {/* Option 1: Light Theme */}
                <div
                  onClick={() => setTheme('light')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                    theme === 'light'
                      ? 'bg-purple-950/20 border-purple-500 shadow-md shadow-purple-950/30 ring-1 ring-purple-500'
                      : 'bg-obsidian-bg/80 border-obsidian-border hover:border-purple-500/40 hover:bg-obsidian-elevated/60'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500">
                      <Sun className="w-5 h-5" />
                    </div>
                    {theme === 'light' ? (
                      <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs shadow-sm">
                        <Check className="w-3 h-3" />
                      </span>
                    ) : (
                      <span className="w-5 h-5 rounded-full border border-obsidian-border" />
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-white mb-0.5">
                      {t.theme_light_name}
                    </h4>
                    <p className="text-xs text-obsidian-muted leading-relaxed">
                      {t.theme_light_desc}
                    </p>
                  </div>

                  {/* Palette preview bar */}
                  <div className="mt-3 pt-2.5 border-t border-obsidian-border/50 flex items-center space-x-1.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#f8fafc] border border-slate-300 shadow-xs" title="Background #f8fafc" />
                    <span className="w-3.5 h-3.5 rounded-full bg-[#ffffff] border border-slate-300 shadow-xs" title="Surface #ffffff" />
                    <span className="w-3.5 h-3.5 rounded-full bg-[#8b5cf6]" title="Accent #8b5cf6" />
                    <span className="w-3.5 h-3.5 rounded-full bg-[#0f172a]" title="Text #0f172a" />
                  </div>
                </div>

                {/* Option 2: Obsidian Dark (Default) */}
                <div
                  onClick={() => setTheme('dark')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                    theme === 'dark'
                      ? 'bg-purple-950/20 border-purple-500 shadow-md shadow-purple-950/30 ring-1 ring-purple-500'
                      : 'bg-obsidian-bg/80 border-obsidian-border hover:border-purple-500/40 hover:bg-obsidian-elevated/60'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-9 h-9 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                      <Moon className="w-5 h-5" />
                    </div>
                    {theme === 'dark' ? (
                      <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs shadow-sm">
                        <Check className="w-3 h-3" />
                      </span>
                    ) : (
                      <span className="w-5 h-5 rounded-full border border-obsidian-border" />
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-white mb-0.5">
                      {t.theme_dark_name}
                    </h4>
                    <p className="text-xs text-obsidian-muted leading-relaxed">
                      {t.theme_dark_desc}
                    </p>
                  </div>

                  {/* Palette preview bar */}
                  <div className="mt-3 pt-2.5 border-t border-obsidian-border/50 flex items-center space-x-1.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#0c0e14] border border-[#2a324b]" title="Background #0c0e14" />
                    <span className="w-3.5 h-3.5 rounded-full bg-[#171c2b] border border-[#2a324b]" title="Surface #171c2b" />
                    <span className="w-3.5 h-3.5 rounded-full bg-[#8b5cf6]" title="Accent #8b5cf6" />
                    <span className="w-3.5 h-3.5 rounded-full bg-[#f3f4f6]" title="Text #f3f4f6" />
                  </div>
                </div>

                {/* Option 3: OLED / True Black */}
                <div
                  onClick={() => setTheme('oled')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                    theme === 'oled'
                      ? 'bg-purple-950/20 border-purple-500 shadow-md shadow-purple-950/30 ring-1 ring-purple-500'
                      : 'bg-obsidian-bg/80 border-obsidian-border hover:border-purple-500/40 hover:bg-obsidian-elevated/60'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-9 h-9 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                      <CircleDot className="w-5 h-5" />
                    </div>
                    {theme === 'oled' ? (
                      <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs shadow-sm">
                        <Check className="w-3 h-3" />
                      </span>
                    ) : (
                      <span className="w-5 h-5 rounded-full border border-obsidian-border" />
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-white mb-0.5">
                      {t.theme_oled_name}
                    </h4>
                    <p className="text-xs text-obsidian-muted leading-relaxed">
                      {t.theme_oled_desc}
                    </p>
                  </div>

                  {/* Palette preview bar */}
                  <div className="mt-3 pt-2.5 border-t border-obsidian-border/50 flex items-center space-x-1.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#000000] border border-[#333333]" title="Background #000000" />
                    <span className="w-3.5 h-3.5 rounded-full bg-[#111114] border border-[#333333]" title="Surface #111114" />
                    <span className="w-3.5 h-3.5 rounded-full bg-[#8b5cf6]" title="Accent #8b5cf6" />
                    <span className="w-3.5 h-3.5 rounded-full bg-[#ffffff]" title="Text #ffffff" />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Language Selector */}
            <div className="pt-2 border-t border-obsidian-border/60">
              <label className="block text-xs font-mono text-purple-300 font-semibold mb-3 flex items-center space-x-1.5">
                <Globe className="w-3.5 h-3.5 text-purple-400" />
                <span>{t.lang_label}</span>
              </label>

              {/* Segmented language buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { code: 'ru' as AppLanguage, name: t.lang_ru, flag: '🇷🇺', sub: 'Русский' },
                  { code: 'uk' as AppLanguage, name: t.lang_uk, flag: '🇺🇦', sub: 'Українська' },
                  { code: 'en' as AppLanguage, name: t.lang_en, flag: '🇬🇧', sub: 'English' }
                ].map((item) => {
                  const isActive = language === item.code;
                  return (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => setLanguage(item.code)}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all duration-150 ${
                        isActive
                          ? 'bg-purple-950/20 border-purple-500 shadow-sm ring-1 ring-purple-500'
                          : 'bg-obsidian-bg/80 border-obsidian-border hover:border-purple-500/40 hover:bg-obsidian-elevated/60 text-obsidian-muted hover:text-white'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <span className="text-xl select-none">{item.flag}</span>
                        <div>
                          <span className="text-sm font-semibold text-white block leading-tight">
                            {item.name}
                          </span>
                          <span className="text-[11px] font-mono text-obsidian-dim uppercase">
                            {item.code}
                          </span>
                        </div>
                      </div>

                      {isActive && (
                        <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Obsidian REST Hub Configuration */}
        <section className="bg-obsidian-surface border border-obsidian-border rounded-2xl p-5 sm:p-6 shadow-obsidian-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-obsidian-border mb-5 gap-2">
            <div>
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <Server className="w-5 h-5 text-purple-400" />
                <span>{t.rest_hub_title}</span>
              </h2>
              <p className="text-xs text-obsidian-muted mt-0.5">
                {t.rest_hub_desc}
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <span className="inline-flex items-center text-xs font-mono text-emerald-400 bg-emerald-950/50 px-2.5 py-1 rounded-lg border border-emerald-800/50">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
                {t.ping_ok} {pingLatency !== null && `(${pingLatency} ms)`}
              </span>
              <button
                onClick={handlePingHub}
                disabled={isPinging}
                className="px-3 py-1 rounded-lg bg-obsidian-elevated hover:bg-obsidian-border border border-obsidian-border text-xs text-obsidian-text hover:text-white flex items-center space-x-1.5 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin text-purple-400' : ''}`} />
                <span>{t.ping_btn}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-obsidian-muted mb-1.5">
                {t.server_url_label}
              </label>
              <input
                type="text"
                value={settings.serverUrl}
                onChange={(e) => updateSettings({ serverUrl: e.target.value })}
                className="w-full bg-obsidian-bg border border-obsidian-border rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-obsidian-muted mb-1.5">
                {t.server_port_label}
              </label>
              <input
                type="number"
                value={settings.serverPort}
                onChange={(e) => updateSettings({ serverPort: Number(e.target.value) })}
                className="w-full bg-obsidian-bg border border-obsidian-border rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-mono text-obsidian-muted mb-1.5">
                {t.token_label}
              </label>
              <div className="relative">
                <input
                  type={showTokens['obsidian'] ? 'text' : 'password'}
                  value={settings.obsidianApiKey}
                  onChange={(e) => updateSettings({ obsidianApiKey: e.target.value })}
                  className="w-full bg-obsidian-bg border border-obsidian-border rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-purple-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => toggleShowToken('obsidian')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-obsidian-dim hover:text-white"
                >
                  {showTokens['obsidian'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Caddy Proxy Status Card */}
          <div className="mt-4 p-3.5 rounded-xl bg-obsidian-bg/80 border border-obsidian-border flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono gap-2">
            <div className="flex items-center space-x-2 text-obsidian-muted">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Caddy TLS Reverse Proxy: <strong className="text-white">{t.caddy_active}</strong></span>
            </div>
            <div className="text-obsidian-dim flex items-center space-x-1">
              <span>{t.caddy_desc}</span>
            </div>
          </div>
        </section>

        {/* SECTION 3: BYOK Providers */}
        <section className="bg-obsidian-surface border border-obsidian-border rounded-2xl p-5 sm:p-6 shadow-obsidian-card">
          <div className="pb-4 border-b border-obsidian-border mb-5">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Key className="w-5 h-5 text-cyan-400" />
              <span>{t.byok_title}</span>
            </h2>
            <p className="text-xs text-obsidian-muted mt-0.5">
              {t.byok_desc}
            </p>
          </div>

          <div className="space-y-4">
            {/* Groq Whisper */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono text-purple-300 flex items-center space-x-1.5">
                  <Cpu className="w-3.5 h-3.5 text-purple-400" />
                  <span>GROQ_API_KEY (Whisper Large v3 STT)</span>
                </label>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                  TTN &lt; 1s
                </span>
              </div>
              <div className="relative">
                <input
                  type={showTokens['groq'] ? 'text' : 'password'}
                  value={settings.groqApiKey}
                  onChange={(e) => updateSettings({ groqApiKey: e.target.value })}
                  placeholder="gsk_live_whisper_..."
                  className="w-full bg-obsidian-bg border border-obsidian-border rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-purple-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => toggleShowToken('groq')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-obsidian-dim hover:text-white"
                >
                  {showTokens['groq'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Google Gemini */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono text-cyan-300 flex items-center space-x-1.5">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span>GEMINI_API_KEY (Gemini 2.0 Flash / Vision)</span>
                </label>
                <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
                  ReAct Loop
                </span>
              </div>
              <div className="relative">
                <input
                  type={showTokens['gemini'] ? 'text' : 'password'}
                  value={settings.geminiApiKey}
                  onChange={(e) => updateSettings({ geminiApiKey: e.target.value })}
                  placeholder="AIzaSy..."
                  className="w-full bg-obsidian-bg border border-obsidian-border rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-purple-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => toggleShowToken('gemini')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-obsidian-dim hover:text-white"
                >
                  {showTokens['gemini'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* OpenAI */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono text-indigo-300 flex items-center space-x-1.5">
                  <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                  <span>OPENAI_API_KEY (GPT-4o Mini / Embeddings)</span>
                </label>
                <span className="text-[11px] font-mono text-indigo-400 bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-800/40">
                  Fallback Engine
                </span>
              </div>
              <div className="relative">
                <input
                  type={showTokens['openai'] ? 'text' : 'password'}
                  value={settings.openaiApiKey}
                  onChange={(e) => updateSettings({ openaiApiKey: e.target.value })}
                  placeholder="sk-proj-..."
                  className="w-full bg-obsidian-bg border border-obsidian-border rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-purple-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => toggleShowToken('openai')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-obsidian-dim hover:text-white"
                >
                  {showTokens['openai'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: SQLite Offline Queue Monitor */}
        <section className="bg-obsidian-surface border border-obsidian-border rounded-2xl p-5 sm:p-6 shadow-obsidian-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-obsidian-border mb-5 gap-2">
            <div>
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <Database className="w-5 h-5 text-amber-400" />
                <span>{t.offline_queue_title}</span>
              </h2>
              <p className="text-xs text-obsidian-muted mt-0.5">
                {t.offline_queue_desc}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={clearCompletedJobs}
                className="px-3 py-1.5 rounded-lg bg-obsidian-elevated hover:bg-obsidian-border text-xs text-obsidian-muted hover:text-white border border-obsidian-border transition-colors flex items-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t.clear_completed_btn}</span>
              </button>
            </div>
          </div>

          {/* SQLite Table Info */}
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-obsidian-border text-obsidian-dim">
                  <th className="pb-2.5 font-medium">{t.table_col_id}</th>
                  <th className="pb-2.5 font-medium">{t.table_col_stage}</th>
                  <th className="pb-2.5 font-medium">{t.table_col_action}</th>
                  <th className="pb-2.5 font-medium">{t.table_col_target}</th>
                  <th className="pb-2.5 font-medium">{t.table_col_status}</th>
                  <th className="pb-2.5 font-medium text-right">{t.table_col_operations}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-obsidian-border/50">
                {sqliteJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-obsidian-bg/50 transition-colors">
                    <td className="py-3 text-obsidian-muted">{job.id}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          job.pipeline_stage === 'RAW_EXTRACT'
                            ? 'bg-purple-950/70 border border-purple-800 text-purple-300'
                            : 'bg-cyan-950/70 border border-cyan-800 text-cyan-300'
                        }`}
                      >
                        {job.pipeline_stage}
                      </span>
                    </td>
                    <td className="py-3 text-white font-medium">{job.action_type}</td>
                    <td className="py-3 text-purple-300">{job.target_path}</td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] ${
                          job.status === 'completed'
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                            : job.status === 'processing'
                            ? 'bg-blue-950/60 text-blue-400 border border-blue-800/40 animate-pulse'
                            : job.status === 'failed'
                            ? 'bg-rose-950/60 text-rose-400 border border-rose-800/40'
                            : 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
                        }`}
                      >
                        <span>{job.status}</span>
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      {job.status !== 'completed' ? (
                        <button
                          onClick={() => retryJob(job.id)}
                          className="px-2 py-1 rounded bg-obsidian-elevated hover:bg-obsidian-border border border-obsidian-border text-obsidian-text hover:text-white transition-colors"
                        >
                          {t.sync_btn}
                        </button>
                      ) : (
                        <span className="text-obsidian-dim">0</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 pt-3 border-t border-obsidian-border/50 flex flex-col sm:flex-row items-center justify-between text-xs text-obsidian-dim font-mono gap-2">
            <span>sync_job_queue (op-sqlite)</span>
            <span>Zero-loss Auto-Sync</span>
          </div>
        </section>
      </main>
    </div>
  );
};
