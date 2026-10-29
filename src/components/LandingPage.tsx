import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Server, 
  Mic, 
  Bot, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Database, 
  Lock, 
  X, 
  CheckCircle2, 
  Terminal, 
  Cpu, 
  FileText,
  Zap
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, login, bypassAuth, setRoute, t, language, setLanguage } = useApp();
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('agent@obsidian-hub.local');
  const [password, setPassword] = useState('••••••••••••');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div className="min-h-screen bg-obsidian-bg text-obsidian-text relative overflow-hidden flex flex-col selection:bg-obsidian-purple selection:text-white transition-colors duration-200">
      {/* Background glow ornaments */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-purple-900/20 via-indigo-900/10 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 -left-48 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="w-full border-b border-obsidian-border/60 backdrop-blur-md bg-obsidian-bg/80 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setRoute('/')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-purple-900/30 border border-purple-500/30">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold tracking-tight text-lg bg-gradient-to-r from-white via-purple-100 to-purple-300 bg-clip-text text-transparent">
                Obsidian AI Hub
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-mono text-purple-400 bg-purple-950/60 border border-purple-800/40 px-2 py-0.5 rounded-full">
                v3.0 REST Hub
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Quick Language Toggle */}
            <div className="flex rounded-lg bg-obsidian-surface border border-obsidian-border p-0.5 text-xs font-mono">
              {(['ru', 'uk', 'en'] as const).map(code => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLanguage(code)}
                  className={`px-2 py-0.5 rounded-md uppercase font-semibold transition-all ${
                    language === code 
                      ? 'bg-purple-600 text-white shadow-xs' 
                      : 'text-obsidian-dim hover:text-white'
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>

            <button
              onClick={bypassAuth}
              className="text-xs sm:text-sm text-obsidian-muted hover:text-white px-3 py-1.5 rounded-lg border border-obsidian-border hover:border-obsidian-border-hover transition-colors font-medium hidden sm:inline-block"
            >
              {t.hero_badge_bypass}
            </button>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="text-xs sm:text-sm bg-obsidian-purple hover:bg-obsidian-purple-hover text-white px-4 py-2 rounded-lg font-medium shadow-lg shadow-purple-900/40 transition-all flex items-center space-x-1.5 hover:shadow-purple-700/50 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{t.login_btn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex flex-col items-center text-center relative z-10">
        {/* Status Pill */}
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-obsidian-surface border border-purple-500/30 text-purple-300 text-xs sm:text-sm font-medium mb-8 animate-fade-in shadow-inner">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Local REST API :27124 • 24/7 Self-Hosted Hub</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight max-w-4xl text-white mb-6 leading-tight">
          {t.hero_title_1} <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
            {t.hero_title_2}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl text-base sm:text-lg md:text-xl text-obsidian-muted mb-10 leading-relaxed">
          {t.hero_subtitle}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-16">
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-base shadow-xl shadow-purple-900/50 transition-all flex items-center justify-center space-x-3 group hover:scale-[1.02] active:scale-[0.98] border border-purple-400/20"
          >
            <span>{t.hero_cta_start}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={bypassAuth}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-obsidian-surface/90 hover:bg-obsidian-elevated text-obsidian-text border border-obsidian-border hover:border-purple-500/40 font-medium text-base transition-all flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span>{t.hero_cta_demo}</span>
          </button>
        </div>

        {/* Live Architecture Interactive Terminal Preview */}
        <div className="w-full max-w-4xl bg-obsidian-surface/90 border border-obsidian-border rounded-2xl p-4 sm:p-6 shadow-2xl mb-20 text-left backdrop-blur-xl">
          <div className="flex items-center justify-between pb-4 border-b border-obsidian-border/60 mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-xs font-mono text-obsidian-muted">{t.terminal_caddy_status}</span>
            </div>
            <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>{t.terminal_tls}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-3 rounded-lg bg-obsidian-bg/80 border border-obsidian-border/70">
              <div className="flex items-center space-x-2 text-purple-400 font-semibold mb-2">
                <Server className="w-4 h-4" />
                <span>{t.terminal_card1_title}</span>
              </div>
              <p className="text-obsidian-muted">{t.terminal_card1_desc}</p>
              <p className="text-emerald-400 mt-1">{t.terminal_card1_status}</p>
              <p className="text-obsidian-dim mt-0.5">/srv/obsidian/vault</p>
            </div>

            <div className="p-3 rounded-lg bg-obsidian-bg/80 border border-obsidian-border/70">
              <div className="flex items-center space-x-2 text-cyan-400 font-semibold mb-2">
                <Cpu className="w-4 h-4" />
                <span>{t.terminal_card2_title}</span>
              </div>
              <p className="text-obsidian-muted">{t.terminal_card2_desc}</p>
              <p className="text-cyan-400 mt-1">{t.terminal_card2_status}</p>
              <p className="text-obsidian-dim mt-0.5">TTN &le; 3--5s</p>
            </div>

            <div className="p-3 rounded-lg bg-obsidian-bg/80 border border-obsidian-border/70">
              <div className="flex items-center space-x-2 text-amber-400 font-semibold mb-2">
                <Database className="w-4 h-4" />
                <span>{t.terminal_card3_title}</span>
              </div>
              <p className="text-obsidian-muted">{t.terminal_card3_desc}</p>
              <p className="text-amber-400 mt-1">{t.terminal_card3_status}</p>
              <p className="text-obsidian-dim mt-0.5">{t.terminal_card3_sub}</p>
            </div>
          </div>
        </div>

        {/* Feature Cards Section (4 key pillars) */}
        <div className="w-full mb-16 text-left">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              {t.features_title}
            </h2>
            <p className="text-obsidian-muted max-w-xl mx-auto text-sm sm:text-base">
              {t.features_desc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-obsidian-surface border border-obsidian-border hover:border-purple-500/50 transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-950/20">
              <div className="w-12 h-12 rounded-xl bg-purple-950/60 border border-purple-800/40 text-purple-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Server className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
                {t.feature_1_title}
              </h3>
              <p className="text-sm text-obsidian-muted leading-relaxed">
                {t.feature_1_desc}
              </p>
              <div className="mt-4 pt-3 border-t border-obsidian-border/50 flex items-center text-xs font-mono text-purple-400">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                <span>{t.feature_1_badge}</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-obsidian-surface border border-obsidian-border hover:border-cyan-500/50 transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-950/20">
              <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                {t.feature_2_title}
              </h3>
              <p className="text-sm text-obsidian-muted leading-relaxed">
                {t.feature_2_desc}
              </p>
              <div className="mt-4 pt-3 border-t border-obsidian-border/50 flex items-center text-xs font-mono text-cyan-400">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                <span>{t.feature_2_badge}</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-obsidian-surface border border-obsidian-border hover:border-indigo-500/50 transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-950/20">
              <div className="w-12 h-12 rounded-xl bg-indigo-950/60 border border-indigo-800/40 text-indigo-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                {t.feature_3_title}
              </h3>
              <p className="text-sm text-obsidian-muted leading-relaxed">
                {t.feature_3_desc}
              </p>
              <div className="mt-4 pt-3 border-t border-obsidian-border/50 flex items-center text-xs font-mono text-indigo-400">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                <span>{t.feature_3_badge}</span>
              </div>
            </div>

            {/* Card 4 */}
            <div className="p-6 rounded-2xl bg-obsidian-surface border border-obsidian-border hover:border-emerald-500/50 transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-950/20">
              <div className="w-12 h-12 rounded-xl bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                {t.feature_4_title}
              </h3>
              <p className="text-sm text-obsidian-muted leading-relaxed">
                {t.feature_4_desc}
              </p>
              <div className="mt-4 pt-3 border-t border-obsidian-border/50 flex items-center text-xs font-mono text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                <span>{t.feature_4_badge}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-obsidian-border/60 py-6 text-center text-xs text-obsidian-dim">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>{t.landing_footer_tech}</span>
          <div className="flex items-center space-x-4">
            <span className="hover:text-obsidian-muted cursor-pointer" onClick={() => setRoute('/settings')}>
              {t.landing_footer_config}
            </span>
            <span>•</span>
            <span className="hover:text-obsidian-muted cursor-pointer" onClick={bypassAuth}>
              {t.landing_footer_goto_chat}
            </span>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <div 
          onClick={() => setIsAuthModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-obsidian-surface border border-obsidian-border rounded-2xl shadow-obsidian-modal p-6 sm:p-8 overflow-hidden"
          >
            {/* Top decorative gradient line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500" />

            {/* Close Button (✕) in the top right corner */}
            <button
              onClick={() => setIsAuthModalOpen(false)}
              title={t.auth_close_title}
              className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-obsidian-bg hover:bg-obsidian-elevated border border-obsidian-border hover:border-purple-400 text-obsidian-muted hover:text-white flex items-center justify-center transition-all group"
            >
              <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
            </button>

            {/* Modal Header */}
            <div className="text-left mb-6">
              <div className="inline-flex items-center space-x-2 text-xs font-mono text-purple-400 mb-2">
                <Lock className="w-3.5 h-3.5" />
                <span>{t.auth_modal_badge}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {authTab === 'login' ? t.auth_modal_title_login : t.auth_modal_title_register}
              </h2>
              <p className="text-xs sm:text-sm text-obsidian-muted mt-1">
                {t.auth_modal_subtitle}
              </p>
            </div>

            {/* Tabs */}
            <div className="flex rounded-lg bg-obsidian-bg p-1 border border-obsidian-border mb-6">
              <button
                type="button"
                onClick={() => setAuthTab('login')}
                className={`flex-1 py-2 text-xs sm:text-sm font-medium rounded-md transition-all ${
                  authTab === 'login'
                    ? 'bg-obsidian-purple text-white shadow-sm'
                    : 'text-obsidian-muted hover:text-white'
                }`}
              >
                {t.auth_login_tab}
              </button>
              <button
                type="button"
                onClick={() => setAuthTab('register')}
                className={`flex-1 py-2 text-xs sm:text-sm font-medium rounded-md transition-all ${
                  authTab === 'register'
                    ? 'bg-obsidian-purple text-white shadow-sm'
                    : 'text-obsidian-muted hover:text-white'
                }`}
              >
                {t.auth_register_tab}
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-medium text-obsidian-muted mb-1.5">
                  {t.auth_email_label}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="vault.admin@local.domain"
                  className="w-full bg-obsidian-bg border border-obsidian-border rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-obsidian-muted">
                    {t.auth_password_label}
                  </label>
                  <span className="text-xs text-purple-400 hover:underline cursor-pointer">
                    {t.auth_forgot_pass}
                  </span>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-obsidian-bg border border-obsidian-border rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-obsidian-muted">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded bg-obsidian-bg border-obsidian-border text-purple-600 focus:ring-purple-500"
                  />
                  <span>{t.auth_remember_key}</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-obsidian-purple hover:bg-obsidian-purple-hover text-white font-medium text-sm transition-all shadow-lg shadow-purple-900/40 flex items-center justify-center space-x-2 mt-2"
              >
                <span>{authTab === 'login' ? t.login_btn : t.auth_register_tab}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={bypassAuth}
                className="w-full mt-2 py-2.5 px-3 text-xs sm:text-sm text-purple-400 hover:text-purple-300 font-medium transition-colors flex items-center justify-center space-x-1 hover:underline"
              >
                <span>{t.auth_demo_button}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
