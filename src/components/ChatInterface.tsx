import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bot, 
  User, 
  Send, 
  Mic, 
  Camera, 
  Paperclip, 
  Plus, 
  Settings as SettingsIcon, 
  PanelRightClose, 
  PanelRightOpen, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  Cpu, 
  ChevronRight, 
  ChevronDown,
  ChevronUp,
  Trash2,
  Square,
  CheckSquare,
  StopCircle,
  Volume2,
  Search
} from 'lucide-react';
import { ChatMessage, ToolCall } from '../types';

// ReAct Tool Calls Accordion Component
const ToolCallsAccordion: React.FC<{ toolCalls: ToolCall[]; openNote: (path: string) => void }> = ({ 
  toolCalls, 
  openNote 
}) => {
  const { t } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  if (!toolCalls || toolCalls.length === 0) return null;

  const toolNames = Array.from(new Set(toolCalls.map(t => t.name)));

  // Extract referenced files from parameters or result
  const referencedFiles: string[] = [];
  toolCalls.forEach(tc => {
    if (tc.parameters?.relative_path) referencedFiles.push(tc.parameters.relative_path);
    if (tc.parameters?.target_path) referencedFiles.push(tc.parameters.target_path);
    const matches = String(tc.result || '').match(/\[\[(.*?)\]\]/g);
    if (matches) {
      matches.forEach(m => referencedFiles.push(m.slice(2, -2)));
    }
  });
  const uniqueFiles = Array.from(new Set(referencedFiles));

  return (
    <div className="w-full my-2.5 rounded-xl border border-obsidian-border bg-obsidian-subtle/80 overflow-hidden font-mono text-xs transition-all shadow-sm">
      {/* Compact summary bar */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-obsidian-elevated/70 transition-colors select-none group"
      >
        <div className="flex items-center space-x-2 truncate">
          <span className="text-sm">⚙️</span>
          <span className="font-semibold text-purple-300 group-hover:text-purple-200">
            {t.tools_used} {toolCalls.length}
          </span>
          <span className="text-obsidian-dim truncate hidden sm:inline">
            ({toolNames.join(', ')})
          </span>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-[11px] text-emerald-400 bg-emerald-950/50 border border-emerald-800/40 px-2 py-0.5 rounded-full flex items-center">
            <CheckCircle2 className="w-3 h-3 mr-1" /> {t.tools_executed}
          </span>
          <span className="text-obsidian-dim group-hover:text-white transition-transform duration-200">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </span>
        </div>
      </button>

      {/* Expanded tool details */}
      {isOpen && (
        <div className="border-t border-obsidian-border/70 p-3.5 space-y-3 bg-obsidian-bg/70 animate-fade-in">
          {/* Quick list of accessed files */}
          {uniqueFiles.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pb-2.5 border-b border-obsidian-border/60 text-[11px]">
              <span className="text-obsidian-dim flex items-center">
                <FileText className="w-3 h-3 mr-1 text-purple-400" /> {t.tools_files_in_req}
              </span>
              {uniqueFiles.map((file, fIdx) => (
                <button
                  key={fIdx}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); openNote(file); }}
                  className="wikilink"
                  title={t.tools_preview_note}
                >
                  <FileText className="w-3 h-3 text-purple-400" />
                  <span>{file}</span>
                </button>
              ))}
            </div>
          )}

          {/* Individual tool steps */}
          <div className="space-y-2">
            {toolCalls.map((tc, idx) => (
              <div 
                key={tc.id || idx}
                className="p-2.5 rounded-lg bg-obsidian-surface border border-obsidian-border/70 text-left"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center space-x-1.5 text-purple-400 font-semibold">
                    <span className="text-obsidian-dim">#{idx + 1}</span>
                    <Cpu className="w-3.5 h-3.5 text-purple-400" />
                    <span>{tc.name}</span>
                  </div>
                  <span className="text-[10px] text-obsidian-dim font-mono">{tc.timestamp}</span>
                </div>

                <div className="pl-4 border-l border-purple-800/40 space-y-1 text-[11px] mt-1.5">
                  <div className="text-obsidian-muted">
                    <span className="text-obsidian-dim">{t.tools_params} </span>
                    <span className="text-purple-200">{JSON.stringify(tc.parameters)}</span>
                  </div>
                  {tc.result && (
                    <div className="text-emerald-300">
                      <span className="text-obsidian-dim">{t.tools_result} </span>
                      <span>{tc.result}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const ChatInterface: React.FC = () => {
  const { 
    activeSession, 
    sessions, 
    selectChat, 
    createNewChat, 
    deleteChat, 
    sendMessage, 
    isAgentTyping, 
    currentAgentAction, 
    isSidebarOpen, 
    toggleSidebar, 
    setRoute, 
    notes, 
    openNote, 
    toggleTaskStatus, 
    setMultimodalModal,
    showToast,
    t
  } = useApp();

  const [inputPrompt, setInputPrompt] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<Array<{ name: string; type: 'file' | 'image' | 'audio' }>>([]);
  const [isInlineRecording, setIsInlineRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages, isAgentTyping, currentAgentAction]);

  // Timer for inline voice recording
  useEffect(() => {
    let interval: any;
    if (isInlineRecording) {
      interval = setInterval(() => {
        setRecordSeconds(s => s + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isInlineRecording]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!inputPrompt.trim() && attachedFiles.length === 0) || isAgentTyping) return;

    const currentText = inputPrompt;
    const currentFiles = [...attachedFiles];
    setInputPrompt('');
    setAttachedFiles([]);

    await sendMessage(
      currentText, 
      currentFiles.length > 0 ? currentFiles.map(f => ({ name: f.name, type: f.type })) : undefined
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAttachedFiles(prev => [
        ...prev, 
        { 
          name: file.name, 
          type: file.type.startsWith('image/') ? 'image' : file.type.startsWith('audio/') ? 'audio' : 'file' 
        }
      ]);
    }
  };

  // Toggle inline voice recording with glowing pulse wave
  const handleToggleVoiceRecording = () => {
    if (isInlineRecording) {
      // Stop recording and transcribe
      setIsInlineRecording(false);
      const sampleMemos = [
        'Спланируй задачи на день: финализировать спецификацию и проверить порт 27124.',
        'Добавить в заметку Daily/2026-09-28.md задачу протестировать синхронизацию Syncthing.',
        'Напомнить завтра проверить Caddy TLS сертификат для Obsidian Local REST API.'
      ];
      const memoText = sampleMemos[Math.floor(Math.random() * sampleMemos.length)];
      setInputPrompt(prev => prev ? `${prev} ${memoText}` : memoText);
      showToast('Groq Whisper STT: Аудио расшифровано и добавлено в поле ввода', 'success', 'whisper-large-v3');
    } else {
      setIsInlineRecording(true);
      setRecordSeconds(0);
      showToast('Запись голоса активна...', 'info', 'Говорите в микрофон');
    }
  };

  // Render message content with markdown, interactive tasks and wikilinks
  const renderMessageContent = (message: ChatMessage) => {
    const text = message.content;
    const lines = text.split('\n');

    return (
      <div className="space-y-2 text-sm leading-relaxed">
        {lines.map((line, idx) => {
          // Headers
          if (line.startsWith('## ')) {
            return (
              <h3 key={idx} className="text-base font-bold text-purple-200 mt-3 mb-1">
                {line.replace('## ', '')}
              </h3>
            );
          }
          if (line.startsWith('### ')) {
            return (
              <h4 key={idx} className="text-sm font-semibold text-purple-300 mt-2 mb-1">
                {line.replace('### ', '')}
              </h4>
            );
          }
          // Blockquotes
          if (line.startsWith('> ')) {
            return (
              <blockquote key={idx} className="border-l-2 border-purple-500/80 pl-3 py-1 my-1 text-obsidian-muted italic text-xs sm:text-sm bg-purple-950/20 rounded-r">
                {line.replace('> ', '')}
              </blockquote>
            );
          }

          // Obsidian Tasks syntax: - [ ] or - [x]
          const isTaskLine = line.trim().startsWith('- [ ]') || line.trim().startsWith('- [x]');
          if (isTaskLine) {
            const isCompleted = line.trim().startsWith('- [x]');
            const rawTaskContent = line.replace(/- \[[ x]\]\s*/, '').trim();

            const hasHighPriority = rawTaskContent.includes('⏫');
            const hasMediumPriority = rawTaskContent.includes('🔼');
            const hasLowPriority = rawTaskContent.includes('🔽');

            const dateMatch = rawTaskContent.match(/📅\s*(\d{4}-\d{2}-\d{2})/);
            const dueDate = dateMatch ? dateMatch[1] : null;

            const tagMatches = rawTaskContent.match(/#([\w-]+)/g) || [];

            let cleanTaskLabel = rawTaskContent
              .replace(/⏫|🔼|🔽/g, '')
              .replace(/📅\s*\d{4}-\d{2}-\d{2}/g, '')
              .replace(/#([\w-]+)/g, '')
              .trim();

            return (
              <div 
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleTaskStatus(rawTaskContent, isCompleted);
                }}
                className={`task-item flex items-start space-x-2.5 p-2 rounded-lg border cursor-pointer select-none transition-all my-1.5 ${
                  isCompleted 
                    ? 'bg-obsidian-bg/40 border-obsidian-border/50 text-obsidian-dim' 
                    : 'bg-obsidian-surface border-obsidian-border hover:border-purple-500/50 text-obsidian-text'
                }`}
              >
                <button
                  type="button"
                  className={`mt-0.5 rounded transition-colors shrink-0 ${
                    isCompleted ? 'text-emerald-400' : 'text-purple-400 hover:text-purple-300'
                  }`}
                >
                  {isCompleted ? (
                    <CheckSquare className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Square className="w-4 h-4 text-purple-400" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <span className={`text-xs sm:text-sm font-medium ${isCompleted ? 'line-through text-obsidian-dim' : 'text-white'}`}>
                    {cleanTaskLabel}
                  </span>

                  {/* Metadata badges row */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-1 font-mono text-[11px]">
                    {hasHighPriority && (
                      <span className="px-1.5 py-0.2 rounded bg-rose-950/60 text-rose-300 border border-rose-800/40 font-semibold flex items-center">
                        {t.priority_high}
                      </span>
                    )}
                    {hasMediumPriority && (
                      <span className="px-1.5 py-0.2 rounded bg-amber-950/60 text-amber-300 border border-amber-800/40 flex items-center">
                        {t.priority_medium}
                      </span>
                    )}
                    {hasLowPriority && (
                      <span className="px-1.5 py-0.2 rounded bg-blue-950/60 text-blue-300 border border-blue-800/40 flex items-center">
                        {t.priority_low}
                      </span>
                    )}
                    {dueDate && (
                      <span className="px-1.5 py-0.2 rounded bg-purple-950/60 text-purple-300 border border-purple-800/40 flex items-center">
                        📅 {dueDate}
                      </span>
                    )}
                    {tagMatches.map((t, ti) => (
                      <span key={ti} className="obsidian-tag">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          }

          // Regular lines with [[WikiLinks]] parsing
          const parts = line.split(/(\[\[.*?\]\])/g);
          return (
            <p key={idx} className="min-h-[1.25rem]">
              {parts.map((part, pIdx) => {
                if (part.startsWith('[[') && part.endsWith(']]')) {
                  const target = part.slice(2, -2);
                  return (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openNote(target);
                      }}
                      className="wikilink"
                      title={`Открыть ${target} в Obsidian Vault`}
                    >
                      <FileText className="w-3.5 h-3.5 text-purple-400 inline" />
                      <span>{target}</span>
                    </button>
                  );
                }
                // Handle bold markdown text **...**
                const boldParts = part.split(/(\*\*.*?\*\*)/g);
                return boldParts.map((bPart, bIdx) => {
                  if (bPart.startsWith('**') && bPart.endsWith('**')) {
                    return <strong key={bIdx} className="font-semibold text-white">{bPart.slice(2, -2)}</strong>;
                  }
                  if (bPart.startsWith('`') && bPart.endsWith('`')) {
                    return <code key={bIdx} className="font-mono text-purple-300 bg-purple-950/50 px-1 py-0.5 rounded text-xs border border-purple-800/40">{bPart.slice(1, -1)}</code>;
                  }
                  return bPart;
                });
              })}
            </p>
          );
        })}
      </div>
    );
  };

  // Group sessions by date
  const todayChats = sessions.filter(s => s.dateGroup === 'today');
  const yesterdayChats = sessions.filter(s => s.dateGroup === 'yesterday');
  const past7Chats = sessions.filter(s => s.dateGroup === 'past7days');

  return (
    <div className="flex h-screen bg-obsidian-bg text-obsidian-text overflow-hidden font-sans">
      {/* File input (hidden) */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileSelect} 
        className="hidden" 
      />

      {/* Main Chat Central Column */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative">
        {/* Top Header: Clean, server status icon removed to avoid duplication */}
        <header className="h-14 border-b border-obsidian-border bg-obsidian-subtle/90 backdrop-blur px-4 sm:px-6 flex items-center justify-between z-10">
          <div className="flex items-center space-x-3 truncate">
            <button 
              onClick={() => setRoute('/')}
              className="text-xs font-mono text-obsidian-muted hover:text-white flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-obsidian-surface border border-obsidian-border transition-colors shrink-0"
            >
              <span>{t.landing_btn}</span>
            </button>
            <div className="h-4 w-px bg-obsidian-border shrink-0" />
            <div className="flex items-center space-x-2 truncate">
              <span className="font-bold text-sm text-white truncate">
                {activeSession?.title || 'Obsidian Assistant'}
              </span>
              <span className="text-[11px] font-mono text-purple-400 bg-purple-950/60 border border-purple-800/40 px-2 py-0.5 rounded-full shrink-0">
                ReAct Agent
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {/* Sidebar Toggle Button */}
            <button
              onClick={toggleSidebar}
              title={isSidebarOpen ? t.sidebar_toggle_hide : t.sidebar_toggle_show}
              className="w-8 h-8 rounded-lg bg-obsidian-surface hover:bg-obsidian-elevated text-obsidian-muted hover:text-white flex items-center justify-center border border-obsidian-border transition-colors"
            >
              {isSidebarOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Central Messages Feed (Broadened to max-w-4xl for optimal laptop/desktop display) */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 lg:px-12 py-6 space-y-6">
          <div className="max-w-4xl mx-auto w-full space-y-6">
            {/* If chat is clean / empty: render welcoming start screen */}
            {(!activeSession?.messages || activeSession.messages.length === 0) && !isAgentTyping && (
              <div className="py-8 sm:py-12 flex flex-col items-center text-center animate-fade-in">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800 flex items-center justify-center shadow-xl shadow-purple-950/40 border border-purple-400/30 mb-5">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  {t.empty_title}
                </h2>
                <p className="text-xs sm:text-sm text-obsidian-muted max-w-lg mb-8 leading-relaxed">
                  {t.empty_desc}
                </p>

                {/* 4 Interactive Starter Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full max-w-2xl text-left">
                  <div
                    onClick={() => sendMessage(t.starter_prompt_plan)}
                    className="p-4 rounded-xl bg-obsidian-surface border border-obsidian-border hover:border-purple-500/50 hover:bg-obsidian-elevated/70 cursor-pointer transition-all group shadow-sm"
                  >
                    <div className="flex items-center space-x-2 text-purple-400 font-semibold text-xs sm:text-sm mb-1 group-hover:text-purple-300">
                      <span>🎯</span>
                      <span>{t.prompt_plan_title}</span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-obsidian-muted leading-relaxed">
                      {t.prompt_plan_desc}
                    </p>
                  </div>

                  <div
                    onClick={handleToggleVoiceRecording}
                    className="p-4 rounded-xl bg-obsidian-surface border border-obsidian-border hover:border-cyan-500/50 hover:bg-obsidian-elevated/70 cursor-pointer transition-all group shadow-sm"
                  >
                    <div className="flex items-center space-x-2 text-cyan-400 font-semibold text-xs sm:text-sm mb-1 group-hover:text-cyan-300">
                      <span>🎙️</span>
                      <span>{t.prompt_voice_title}</span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-obsidian-muted leading-relaxed">
                      {t.prompt_voice_desc}
                    </p>
                  </div>

                  <div
                    onClick={() => setMultimodalModal('camera')}
                    className="p-4 rounded-xl bg-obsidian-surface border border-obsidian-border hover:border-indigo-500/50 hover:bg-obsidian-elevated/70 cursor-pointer transition-all group shadow-sm"
                  >
                    <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-xs sm:text-sm mb-1 group-hover:text-indigo-300">
                      <span>📷</span>
                      <span>{t.prompt_ocr_title}</span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-obsidian-muted leading-relaxed">
                      {t.prompt_ocr_desc}
                    </p>
                  </div>

                  <div
                    onClick={() => sendMessage(t.starter_prompt_arch)}
                    className="p-4 rounded-xl bg-obsidian-surface border border-obsidian-border hover:border-emerald-500/50 hover:bg-obsidian-elevated/70 cursor-pointer transition-all group shadow-sm"
                  >
                    <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-xs sm:text-sm mb-1 group-hover:text-emerald-300">
                      <span>🔍</span>
                      <span>{t.prompt_arch_title}</span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-obsidian-muted leading-relaxed">
                      {t.prompt_arch_desc}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeSession?.messages.map((message) => {
              const isUser = message.role === 'user';

              return (
                <div 
                  key={message.id} 
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} w-full animate-fade-in`}
                >
                  {/* Sender Avatar & Time */}
                  <div className={`flex items-center space-x-2 mb-1.5 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                      isUser 
                        ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white' 
                        : 'bg-obsidian-surface border border-purple-500/40 text-purple-400 shadow-sm'
                    }`}>
                      {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <span className="text-xs font-mono text-obsidian-dim">
                      {isUser ? t.sender_user : t.sender_assistant} • {message.timestamp}
                    </span>
                  </div>

                  {/* ReAct Agent Tool Execution: Compact Accordion */}
                  {message.toolCalls && message.toolCalls.length > 0 && (
                    <ToolCallsAccordion 
                      toolCalls={message.toolCalls} 
                      openNote={openNote} 
                    />
                  )}

                  {/* Message Bubble: Broadened max-width */}
                  <div 
                    className={`p-4 sm:p-5 rounded-2xl border text-left shadow-obsidian-card ${
                      isUser 
                        ? 'max-w-full sm:max-w-2xl bg-gradient-to-r from-purple-900/40 to-indigo-900/30 border-purple-700/40 text-white rounded-tr-none' 
                        : 'w-full bg-obsidian-surface border-obsidian-border text-obsidian-text rounded-tl-none'
                    }`}
                  >
                    {/* Attachments */}
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3 pb-2.5 border-b border-obsidian-border/60">
                        {message.attachments.map((att, attIdx) => (
                          <div key={attIdx} className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-obsidian-bg/80 border border-obsidian-border text-xs font-mono text-purple-300">
                            {att.type === 'audio' ? <Mic className="w-3.5 h-3.5 text-purple-400" /> : <FileText className="w-3.5 h-3.5 text-cyan-400" />}
                            <span>{att.name}</span>
                            {att.size && <span className="text-obsidian-dim">({att.size})</span>}
                          </div>
                        ))}
                      </div>
                    )}

                    {renderMessageContent(message)}
                  </div>
                </div>
              );
            })}

            {/* Agent Typing / Action Indicator */}
            {isAgentTyping && (
              <div className="flex flex-col items-start w-full animate-fade-in">
                <div className="flex items-center space-x-2 mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-obsidian-surface border border-purple-500/40 text-purple-400 flex items-center justify-center">
                    <Bot className="w-4 h-4 animate-spin" />
                  </div>
                  <span className="text-xs font-mono text-purple-400">
                    {currentAgentAction || t.agent_thinking}
                  </span>
                </div>
                <div className="w-full p-4 rounded-2xl bg-obsidian-surface border border-obsidian-border rounded-tl-none flex items-center space-x-2 text-xs font-mono text-obsidian-muted">
                  <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
                  <span>{t.agent_calling_api}</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Suggested Quick Prompt Chips (Centered max-w-4xl, single-row guaranteed) */}
        <div className="px-3 sm:px-6 lg:px-8 py-2 w-full shrink-0">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-1 sm:gap-2 w-full overflow-hidden no-scrollbar">
            <button
              onClick={() => sendMessage(t.starter_prompt_plan)}
              className="flex-auto flex items-center justify-center space-x-1 sm:space-x-1.5 px-2 sm:px-2.5 py-1.5 rounded-full bg-obsidian-surface hover:bg-obsidian-elevated border border-purple-500/35 hover:border-purple-500/70 text-purple-200 hover:text-white transition-all text-[10.5px] sm:text-[11px] lg:text-xs font-medium tracking-tight whitespace-nowrap shadow-xs"
            >
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-purple-400 shrink-0" />
              <span>{t.prompt_plan_title}</span>
            </button>

            <button
              onClick={handleToggleVoiceRecording}
              className="flex-auto flex items-center justify-center space-x-1 sm:space-x-1.5 px-2 sm:px-2.5 py-1.5 rounded-full bg-obsidian-surface hover:bg-obsidian-elevated border border-cyan-500/35 hover:border-cyan-500/70 text-cyan-200 hover:text-white transition-all text-[10.5px] sm:text-[11px] lg:text-xs font-medium tracking-tight whitespace-nowrap shadow-xs"
            >
              <Mic className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400 shrink-0" />
              <span>{t.prompt_voice_title}</span>
            </button>

            <button
              onClick={() => setMultimodalModal('camera')}
              className="flex-auto flex items-center justify-center space-x-1 sm:space-x-1.5 px-2 sm:px-2.5 py-1.5 rounded-full bg-obsidian-surface hover:bg-obsidian-elevated border border-indigo-500/35 hover:border-indigo-500/70 text-indigo-200 hover:text-white transition-all text-[10.5px] sm:text-[11px] lg:text-xs font-medium tracking-tight whitespace-nowrap shadow-xs"
            >
              <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-400 shrink-0" />
              <span>{t.prompt_ocr_title}</span>
            </button>

            <button
              onClick={() => sendMessage(t.starter_prompt_arch)}
              className="flex-auto flex items-center justify-center space-x-1 sm:space-x-1.5 px-2 sm:px-2.5 py-1.5 rounded-full bg-obsidian-surface hover:bg-obsidian-elevated border border-emerald-500/35 hover:border-emerald-500/70 text-emerald-200 hover:text-white transition-all text-[10.5px] sm:text-[11px] lg:text-xs font-medium tracking-tight whitespace-nowrap shadow-xs"
            >
              <Search className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400 shrink-0" />
              <span>{t.prompt_arch_title}</span>
            </button>
          </div>
        </div>

        {/* Input Bar Pinned at Bottom (Centered max-w-4xl) */}
        <div className="p-4 sm:px-8 lg:px-12 border-t border-obsidian-border bg-obsidian-subtle/80 backdrop-blur">
          <div className="max-w-4xl mx-auto">
            {/* Attached file tags */}
            {attachedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {attachedFiles.map((file, idx) => (
                  <span key={idx} className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-obsidian-surface border border-purple-500/40 text-xs font-mono text-purple-300">
                    <FileText className="w-3 h-3 text-purple-400" />
                    <span>{file.name}</span>
                    <button 
                      onClick={() => setAttachedFiles(prev => prev.filter((_, i) => i !== idx))}
                      className="ml-1 text-obsidian-dim hover:text-rose-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Active Voice Recording Soundwave Banner (Vibrant pulsating effect) */}
            {isInlineRecording && (
              <div className="mb-2 p-2.5 rounded-xl bg-gradient-to-r from-rose-950/70 via-purple-950/60 to-obsidian-surface border border-rose-500/50 flex items-center justify-between text-xs font-mono animate-fade-in shadow-lg shadow-rose-950/20">
                <div className="flex items-center space-x-3">
                  <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping shrink-0" />
                  <span className="text-rose-400 font-bold uppercase tracking-wider">
                    ● {t.recording_now} 00:{recordSeconds < 10 ? '0' : ''}{recordSeconds}
                  </span>
                  
                  {/* Pulsating equalizer soundwave */}
                  <div className="flex items-center space-x-1 h-4 px-2">
                    {[35, 80, 100, 60, 90, 50, 85, 95, 40, 75, 100, 55].map((h, i) => (
                      <div
                        key={i}
                        className="w-1 bg-gradient-to-t from-rose-500 via-purple-400 to-cyan-400 rounded-full soundwave-bar"
                        style={{
                          height: `${h}%`,
                          animationDelay: `${i * 0.08}s`
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handleToggleVoiceRecording}
                    className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium flex items-center space-x-1 transition-colors shadow-sm text-xs"
                  >
                    <StopCircle className="w-3.5 h-3.5" />
                    <span>{t.stop_transcribe_btn}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsInlineRecording(false)}
                    className="p-1 rounded text-obsidian-muted hover:text-white"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSend} className="relative bg-obsidian-surface border border-obsidian-border focus-within:border-purple-500 rounded-2xl p-2 transition-colors shadow-lg">
              <textarea
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={2}
                placeholder={t.input_placeholder}
                className="w-full bg-transparent text-sm text-white placeholder-obsidian-dim px-3 py-1.5 focus:outline-none resize-none leading-relaxed"
              />

              <div className="flex items-center justify-between pt-1 border-t border-obsidian-border/50 px-2">
                {/* Multimodal Quick Buttons */}
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <button
                    type="button"
                    onClick={handleToggleVoiceRecording}
                    title={t.tooltip_voice}
                    className={`p-2 rounded-xl transition-all flex items-center space-x-1.5 text-xs ${
                      isInlineRecording
                        ? 'bg-rose-950/80 border border-rose-500/80 text-rose-300 shadow-md shadow-rose-950/40 animate-pulse'
                        : 'text-obsidian-muted hover:text-purple-400 hover:bg-obsidian-elevated'
                    }`}
                  >
                    <Mic className={`w-4 h-4 ${isInlineRecording ? 'text-rose-400 animate-bounce' : ''}`} />
                    <span className="hidden sm:inline">
                      {isInlineRecording ? t.recording_now : t.voice_btn}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMultimodalModal('camera')}
                    title={t.tooltip_ocr}
                    className="p-2 rounded-xl text-obsidian-muted hover:text-cyan-400 hover:bg-obsidian-elevated transition-colors flex items-center space-x-1 text-xs"
                  >
                    <Camera className="w-4 h-4" />
                    <span className="hidden sm:inline">{t.ocr_btn}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title={t.tooltip_file}
                    className="p-2 rounded-xl text-obsidian-muted hover:text-white hover:bg-obsidian-elevated transition-colors flex items-center space-x-1 text-xs"
                  >
                    <Paperclip className="w-4 h-4" />
                    <span className="hidden sm:inline">{t.file_btn}</span>
                  </button>
                </div>

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={isAgentTyping || (!inputPrompt.trim() && attachedFiles.length === 0)}
                  className={`px-4 py-2 rounded-xl font-medium text-xs sm:text-sm flex items-center space-x-1.5 transition-all shadow-md ${
                    isAgentTyping || (!inputPrompt.trim() && attachedFiles.length === 0)
                      ? 'bg-obsidian-elevated text-obsidian-dim cursor-not-allowed border border-obsidian-border'
                      : 'bg-obsidian-purple hover:bg-obsidian-purple-hover text-white shadow-purple-900/40 hover:scale-[1.02] active:scale-[0.98]'
                  }`}
                >
                  <span>{t.send_btn}</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Right Drawer (Sidebar) */}
      <aside 
        className={`fixed inset-y-0 right-0 z-30 sm:static sm:z-auto w-80 bg-obsidian-subtle border-l border-obsidian-border flex flex-col transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full sm:hidden'
        }`}
      >
        {/* Drawer Header with "+ Новый диалог" button */}
        <div className="p-4 border-b border-obsidian-border flex items-center justify-between">
          <button
            onClick={createNewChat}
            className="flex-1 py-2.5 px-3 rounded-xl bg-obsidian-purple hover:bg-obsidian-purple-hover text-white font-medium text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all shadow-md shadow-purple-900/30"
          >
            <Plus className="w-4 h-4" />
            <span>{t.new_chat}</span>
          </button>

          <button
            onClick={toggleSidebar}
            className="sm:hidden ml-2 w-9 h-9 rounded-xl bg-obsidian-surface border border-obsidian-border flex items-center justify-center text-obsidian-muted hover:text-white"
          >
            <PanelRightClose className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Chat History Grouped by Date */}
          <div>
            <h4 className="text-xs font-mono font-semibold text-obsidian-dim uppercase tracking-wider mb-2.5">
              {t.chat_history}
            </h4>

            {/* Today */}
            {todayChats.length > 0 && (
              <div className="space-y-1 mb-4">
                <span className="text-[11px] font-mono text-purple-400 block px-2 mb-1">
                  {t.today}
                </span>
                {todayChats.map(s => (
                  <div
                    key={s.id}
                    onClick={() => selectChat(s.id)}
                    className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                      s.id === activeSession?.id
                        ? 'bg-obsidian-surface border border-purple-500/50 text-white shadow-sm'
                        : 'text-obsidian-muted hover:bg-obsidian-elevated hover:text-white'
                    }`}
                  >
                    <span className="truncate flex-1 pr-2">{s.title}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteChat(s.id); }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-obsidian-dim hover:text-rose-400 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Yesterday */}
            {yesterdayChats.length > 0 && (
              <div className="space-y-1 mb-4">
                <span className="text-[11px] font-mono text-obsidian-dim block px-2 mb-1">
                  {t.yesterday}
                </span>
                {yesterdayChats.map(s => (
                  <div
                    key={s.id}
                    onClick={() => selectChat(s.id)}
                    className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                      s.id === activeSession?.id
                        ? 'bg-obsidian-surface border border-purple-500/50 text-white shadow-sm'
                        : 'text-obsidian-muted hover:bg-obsidian-elevated hover:text-white'
                    }`}
                  >
                    <span className="truncate flex-1 pr-2">{s.title}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteChat(s.id); }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-obsidian-dim hover:text-rose-400 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Past 7 days */}
            {past7Chats.length > 0 && (
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-obsidian-dim block px-2 mb-1">
                  {t.past7days}
                </span>
                {past7Chats.map(s => (
                  <div
                    key={s.id}
                    onClick={() => selectChat(s.id)}
                    className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                      s.id === activeSession?.id
                        ? 'bg-obsidian-surface border border-purple-500/50 text-white shadow-sm'
                        : 'text-obsidian-muted hover:bg-obsidian-elevated hover:text-white'
                    }`}
                  >
                    <span className="truncate flex-1 pr-2">{s.title}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteChat(s.id); }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-obsidian-dim hover:text-rose-400 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Access to Vault Section */}
          <div className="pt-4 border-t border-obsidian-border/70">
            <h4 className="text-xs font-mono font-semibold text-obsidian-dim uppercase tracking-wider mb-2.5 flex items-center justify-between">
              <span>{t.quick_vault_title}</span>
              <span className="text-[10px] text-purple-400">{Object.keys(notes).length} files</span>
            </h4>

            <div className="space-y-1.5 font-mono text-xs">
              {Object.values(notes).map((n) => (
                <div
                  key={n.path}
                  onClick={() => openNote(n.path)}
                  className="flex items-center justify-between p-2 rounded-xl bg-obsidian-bg/80 hover:bg-obsidian-surface border border-obsidian-border hover:border-purple-500/40 text-obsidian-muted hover:text-white cursor-pointer transition-all"
                >
                  <div className="flex items-center space-x-2 truncate">
                    <FileText className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span className="truncate">{n.path}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-obsidian-dim shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Drawer Footer: Sole Server Status & Link to Settings */}
        <div className="p-4 border-t border-obsidian-border bg-obsidian-bg/90 space-y-3">
          {/* Connection status indicator (Format: ● REST Hub: Online :27124 (14ms)) */}
          <div className="flex items-center justify-between text-xs font-mono px-1">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="text-emerald-400 font-semibold">{t.rest_hub_status_online}</span>
            </div>
            <span className="text-obsidian-muted text-[11px] font-mono">:27124 (14ms)</span>
          </div>

          {/* Settings Button */}
          <button
            onClick={() => setRoute('/settings')}
            className="w-full py-2.5 px-3 rounded-xl bg-obsidian-surface hover:bg-obsidian-elevated text-obsidian-text hover:text-white border border-obsidian-border hover:border-purple-500/40 text-xs font-medium flex items-center justify-center space-x-2 transition-colors shadow-sm"
          >
            <SettingsIcon className="w-4 h-4 text-purple-400" />
            <span>{t.settings_btn}</span>
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile drawer */}
      {isSidebarOpen && (
        <div 
          onClick={toggleSidebar} 
          className="fixed inset-0 bg-black/60 z-20 sm:hidden"
        />
      )}
    </div>
  );
};
