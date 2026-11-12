import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  FileText, 
  CheckCircle2, 
  Cpu, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  Trash2, 
  Square, 
  CheckSquare, 
  Search, 
  ArrowLeft, 
  RefreshCw,
  Sun,
  Moon
} from 'lucide-react';
import { ChatMessage, ToolCall } from '../types';

// ==================== 1. REACT TOOL CALLS ACCORDION ====================
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
    <div className="w-full my-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 overflow-hidden font-mono text-xs transition-all shadow-2xs">
      {/* Summary Bar */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors select-none group"
      >
        <div className="flex items-center space-x-2 truncate">
          <span className="text-zinc-500 font-semibold text-xs">⚙</span>
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
            {t.tools_used} {toolCalls.length}
          </span>
          <span className="text-zinc-500 dark:text-zinc-400 truncate hidden sm:inline text-[11px]">
            ({toolNames.join(', ')})
          </span>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-[11px] font-mono text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-2 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-zinc-900 dark:text-zinc-100" /> {t.tools_executed}
          </span>
          <span className="text-zinc-400 group-hover:text-zinc-950 dark:group-hover:text-zinc-100 transition-colors">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </span>
        </div>
      </button>

      {/* Expanded tool details */}
      {isOpen && (
        <div className="border-t border-zinc-200 dark:border-zinc-800 p-3.5 space-y-3 bg-white dark:bg-zinc-950/70">
          {/* Quick list of accessed files */}
          {uniqueFiles.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pb-2.5 border-b border-zinc-200 dark:border-zinc-800 text-[11px]">
              <span className="text-zinc-500 flex items-center">
                <FileText className="w-3 h-3 mr-1 text-zinc-400" /> {t.tools_files_in_req}
              </span>
              {uniqueFiles.map((file, fIdx) => (
                <button
                  key={fIdx}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); openNote(file); }}
                  className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 text-zinc-800 dark:text-zinc-200 underline decoration-dashed underline-offset-2"
                  title={t.tools_preview_note}
                >
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
                className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-left font-mono"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center space-x-1.5 text-zinc-900 dark:text-zinc-100 font-semibold">
                    <span className="text-zinc-400">#{idx + 1}</span>
                    <Cpu className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{tc.name}</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono">{tc.timestamp}</span>
                </div>

                <div className="pl-3 border-l border-zinc-300 dark:border-zinc-700 space-y-1 text-[11px] mt-1.5">
                  <div className="text-zinc-600 dark:text-zinc-400">
                    <span className="text-zinc-400">{t.tools_params} </span>
                    <span className="text-zinc-800 dark:text-zinc-200">{JSON.stringify(tc.parameters)}</span>
                  </div>
                  {tc.result && (
                    <div className="text-zinc-700 dark:text-zinc-300">
                      <span className="text-zinc-400">{t.tools_result} </span>
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

// ==================== 2. MAIN CHAT INTERFACE COMPONENT ====================
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
    theme,
    setTheme,
    language,
    setLanguage,
    t
  } = useApp();

  // Left Sidebar State (Vault Explorer)
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [vaultSearchQuery, setVaultSearchQuery] = useState('');
  const [collapsedFolders, setCollapsedFolders] = useState<Record<string, boolean>>({});

  // Center & Input states
  const [inputPrompt, setInputPrompt] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<Array<{ name: string; type: 'file' | 'image' | 'audio' }>>([]);
  const [attachedNotes, setAttachedNotes] = useState<string[]>([]);
  const [isDragOverInput, setIsDragOverInput] = useState(false);
  const [isAttachMenuOpen, setIsAttachMenuOpen] = useState(false);
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('Flash Средний');

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomInputRef = useRef<HTMLInputElement>(null);

  // Nickname & Dynamic Greetings
  const [nickname, setNickname] = useState(() => localStorage.getItem('obsidian_chat_user_name') || 'Alex');
  
  const greetingsPool = useMemo(() => {
    if (language === 'uk') {
      return [
        `Привіт, ${nickname}. З чого почнемо?`,
        `Добрий день, ${nickname}. Чим займемося сьогодні?`,
        `Який план на сьогодні, ${nickname}?`,
        `Готовий до роботи. З чого почнемо, ${nickname}?`,
        `${nickname}, з чого почнемо сьогодні?`,
        `З чого почнемо, ${nickname}?`
      ];
    }
    if (language === 'en') {
      return [
        `Hello, ${nickname}. What should we start with?`,
        `Good day, ${nickname}. What are we doing today?`,
        `What is the plan for today, ${nickname}?`,
        `Ready to work. Where shall we begin, ${nickname}?`,
        `${nickname}, where should we start today?`,
        `Where shall we begin, ${nickname}?`
      ];
    }
    return [
      `Привет, ${nickname}. С чего начнем?`,
      `Добрый день, ${nickname}. Чем займемся сегодня?`,
      `Какой план на сегодня, ${nickname}?`,
      `Готов к работе. С чего начнем, ${nickname}?`,
      `${nickname}, с чего начнем сегодня?`,
      `С чего начнем, ${nickname}?`
    ];
  }, [nickname, language]);

  const [greetingIndex, setGreetingIndex] = useState(() => Math.floor(Math.random() * 6));

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const attachMenuRef = useRef<HTMLDivElement>(null);
  const modelMenuRef = useRef<HTMLDivElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages, isAgentTyping, currentAgentAction]);

  // Click outside listener for attach, model, and language dropdown menus (using mousedown for reliability)
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (attachMenuRef.current && !attachMenuRef.current.contains(target)) {
        setIsAttachMenuOpen(false);
      }
      if (modelMenuRef.current && !modelMenuRef.current.contains(target)) {
        setIsModelMenuOpen(false);
      }
      if (langMenuRef.current && !langMenuRef.current.contains(target)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, []);

  // Keyboard shortcut Ctrl+K / Cmd+K for Vault search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('vaultSearchInput');
        searchInput?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Cycle dynamic greeting
  const cycleGreeting = () => {
    setGreetingIndex((prev) => (prev + 1) % greetingsPool.length);
  };

  // Create new chat with fresh randomized greeting
  const handleCreateNewChat = () => {
    createNewChat();
    setGreetingIndex(Math.floor(Math.random() * greetingsPool.length));
  };

  // Edit Nickname
  const editNickname = () => {
    const newName = prompt("Введите ваше имя / никнейм для приветствия:", nickname);
    if (newName && newName.trim()) {
      const clean = newName.trim();
      setNickname(clean);
      localStorage.setItem('obsidian_chat_user_name', clean);
      showToast(`Имя пользователя изменено: ${clean}`, 'info');
    }
  };

  // Drag and Drop Note into Chat Input
  const handleDragStartNote = (e: React.DragEvent, path: string) => {
    e.dataTransfer.setData('text/plain', `[[${path}]]`);
    e.dataTransfer.setData('application/obsidian-file', path);
    e.dataTransfer.effectAllowed = 'copyMove';
  };

  const handleDragOverInput = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    if (!isDragOverInput) setIsDragOverInput(true);
  };

  const handleDragLeaveInput = (e: React.DragEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    if (
      e.clientX <= rect.left ||
      e.clientX >= rect.right ||
      e.clientY <= rect.top ||
      e.clientY >= rect.bottom
    ) {
      setIsDragOverInput(false);
    }
  };

  const handleDropOnInput = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverInput(false);

    let droppedPath = e.dataTransfer.getData('application/obsidian-file');
    if (!droppedPath) {
      const rawText = e.dataTransfer.getData('text/plain');
      if (rawText.startsWith('[[') && rawText.endsWith(']]')) {
        droppedPath = rawText.slice(2, -2);
      } else if (rawText) {
        droppedPath = rawText;
      }
    }

    if (droppedPath) {
      // Just attach the note without inserting extra instruction text
      setAttachedNotes(prev => prev.includes(droppedPath) ? prev : [...prev, droppedPath]);

      const filename = droppedPath.split('/').pop() || droppedPath;
      showToast(
        language === 'uk' ? `Файл прикріплено: ${filename}` : language === 'en' ? `Attached: ${filename}` : `Файл прикреплен: ${filename}`,
        'info',
        droppedPath
      );

      // Focus active input
      setTimeout(() => {
        if (hasMessages) {
          bottomInputRef.current?.focus();
        } else {
          inputRef.current?.focus();
        }
      }, 50);
    }
  };

  const removeAttachedNote = (path: string) => {
    setAttachedNotes(prev => prev.filter(p => p !== path));
  };

  // Handle message dispatch
  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = inputPrompt.trim();
    if ((!text && attachedFiles.length === 0 && attachedNotes.length === 0) || isAgentTyping) return;

    if (text.toLowerCase() === '/settings') {
      setInputPrompt('');
      setAttachedNotes([]);
      setRoute('/settings');
      return;
    }

    const currentFiles = [...attachedFiles];
    const currentNotes = [...attachedNotes];
    
    // Combine regular files and attached vault notes as message attachments
    const noteAttachments: Array<{ name: string; type: 'file' | 'image' | 'audio' }> = currentNotes.map(nPath => ({
      name: nPath,
      type: 'file'
    }));
    const combinedAttachments = [...currentFiles, ...noteAttachments];

    let finalPrompt = text;
    if (!finalPrompt && currentNotes.length > 0) {
      finalPrompt = currentNotes.map(p => `[[${p}]]`).join(', ');
    }

    setInputPrompt('');
    setAttachedFiles([]);
    setAttachedNotes([]);
    setIsAttachMenuOpen(false);

    await sendMessage(
      finalPrompt, 
      combinedAttachments.length > 0 ? combinedAttachments.map(f => ({ name: f.name, type: f.type })) : undefined
    );
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      showToast(`Файл прикреплен: ${file.name}`, 'info');
    }
  };

  const insertWikilinkPrompt = () => {
    setIsAttachMenuOpen(false);
    const note = prompt("Какую заметку прикрепить? (например: Daily/2026-09-28.md):", "Daily/2026-09-28.md");
    if (note && note.trim()) {
      const clean = note.trim();
      setAttachedNotes(prev => prev.includes(clean) ? prev : [...prev, clean]);
      showToast(
        language === 'uk' ? `Нотатку прикріплено: ${clean}` : language === 'en' ? `Attached note: ${clean}` : `Заметка прикреплена: ${clean}`,
        'info'
      );
    }
  };

  const toggleFolder = (folderName: string) => {
    setCollapsedFolders(prev => ({ ...prev, [folderName]: !prev[folderName] }));
  };

  // Group Vault Notes by folder
  const vaultFolders = useMemo(() => {
    const map: Record<string, string[]> = {
      Daily: [],
      Projects: [],
      Inbox: [],
      Templates: []
    };

    Object.keys(notes).forEach(path => {
      const parts = path.split('/');
      if (parts.length > 1) {
        const folder = parts[0];
        if (!map[folder]) map[folder] = [];
        map[folder].push(path);
      } else {
        if (!map['Root']) map['Root'] = [];
        map['Root'].push(path);
      }
    });

    return map;
  }, [notes]);

  // Filtered notes based on search query
  const isPathVisible = (path: string) => {
    if (!vaultSearchQuery.trim()) return true;
    return path.toLowerCase().includes(vaultSearchQuery.toLowerCase());
  };

  // Render message content with markdown, tasks, and wikilinks
  const renderMessageContent = (message: ChatMessage) => {
    const text = message.content;
    const lines = text.split('\n');

    return (
      <div className="space-y-2 text-sm leading-relaxed">
        {lines.map((line, idx) => {
          // Headers
          if (line.startsWith('## ')) {
            return (
              <h3 key={idx} className="text-base font-bold text-zinc-950 dark:text-zinc-50 mt-3 mb-1">
                {line.replace('## ', '')}
              </h3>
            );
          }
          if (line.startsWith('### ')) {
            return (
              <h4 key={idx} className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-2 mb-1">
                {line.replace('### ', '')}
              </h4>
            );
          }
          // Blockquotes
          if (line.startsWith('> ')) {
            return (
              <blockquote key={idx} className="border-l-2 border-zinc-400 dark:border-zinc-600 pl-3 py-1 my-1 text-zinc-600 dark:text-zinc-400 italic text-xs sm:text-sm bg-zinc-100/60 dark:bg-zinc-900/60 rounded-r">
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

            const cleanTaskLabel = rawTaskContent
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
                    ? 'bg-zinc-100/50 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500' 
                    : 'bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 text-zinc-900 dark:text-zinc-100'
                }`}
              >
                <button
                  type="button"
                  className={`mt-0.5 rounded transition-colors shrink-0 ${
                    isCompleted ? 'text-zinc-500 dark:text-zinc-400' : 'text-zinc-900 dark:text-zinc-100'
                  }`}
                >
                  {isCompleted ? (
                    <CheckSquare className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                  ) : (
                    <Square className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <span className={`text-xs sm:text-sm font-medium ${isCompleted ? 'line-through text-zinc-400 dark:text-zinc-500' : 'text-zinc-950 dark:text-zinc-50'}`}>
                    {cleanTaskLabel}
                  </span>

                  {/* Metadata badges row */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-1 font-mono text-[11px]">
                    {hasHighPriority && (
                      <span className="px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700 font-semibold flex items-center">
                        {t.priority_high}
                      </span>
                    )}
                    {hasMediumPriority && (
                      <span className="px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700 flex items-center">
                        {t.priority_medium}
                      </span>
                    )}
                    {hasLowPriority && (
                      <span className="px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 flex items-center">
                        {t.priority_low}
                      </span>
                    )}
                    {dueDate && (
                      <span className="px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 flex items-center">
                        📅 {dueDate}
                      </span>
                    )}
                    {tagMatches.map((tag, ti) => (
                      <span key={ti} className="text-zinc-500 dark:text-zinc-400 text-[10px] font-mono">
                        {tag}
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
                      className="inline-flex items-center gap-1 font-mono text-xs px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 hover:border-zinc-500 transition-colors underline decoration-dashed underline-offset-3"
                      title={`Открыть ${target} в Obsidian Vault`}
                    >
                      <FileText className="w-3 h-3 text-zinc-500 inline" />
                      <span>{target}</span>
                    </button>
                  );
                }
                // Handle bold markdown text **...**
                const boldParts = part.split(/(\*\*.*?\*\*)/g);
                return boldParts.map((bPart, bIdx) => {
                  if (bPart.startsWith('**') && bPart.endsWith('**')) {
                    return <strong key={bIdx} className="font-semibold text-zinc-950 dark:text-zinc-50">{bPart.slice(2, -2)}</strong>;
                  }
                  if (bPart.startsWith('`') && bPart.endsWith('`')) {
                    return <code key={bIdx} className="font-mono text-zinc-800 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-900 px-1 py-0.5 rounded text-xs border border-zinc-200 dark:border-zinc-800">{bPart.slice(1, -1)}</code>;
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

  const hasMessages = Boolean(activeSession?.messages && activeSession.messages.length > 0);

  return (
    <div className="flex flex-col h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 overflow-hidden font-sans antialiased selection:bg-zinc-900 selection:text-white dark:selection:bg-zinc-100 dark:selection:text-zinc-950 transition-colors duration-150">
      
      {/* Hidden file input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileSelect} 
        className="hidden" 
      />

      {/* ==================== 1. TOP NAVIGATION BAR ==================== */}
      <header className="h-14 border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md px-4 flex items-center justify-between shrink-0 z-30 transition-colors">
        
        {/* Left: Separate Left Shutter Toggle, Back to Landing & Brand */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Left Shutter Toggle Button (Шторка Vault) */}
          <button 
            type="button"
            onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)} 
            title="Свернуть / развернуть левую шторку (Vault Explorer)"
            className={`p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 transition-colors flex items-center justify-center shadow-2xs ${
              !isLeftSidebarOpen ? 'opacity-60' : ''
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2"/>
              <path d="M9 3v18" strokeWidth="2"/>
            </svg>
          </button>

          {/* Back to Landing Link */}
          <button 
            type="button"
            onClick={() => setRoute('/')}
            className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors px-2 py-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.landing_btn}</span>
          </button>

          <span className="text-zinc-300 dark:text-zinc-700 hidden sm:inline">/</span>

          {/* Brand Logo & Platform Title (Vector SVG + ReAct) */}
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
            <span className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100 whitespace-nowrap">Obsidian AI Hub</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hidden sm:inline-block">
              ReAct
            </span>
          </div>
        </div>

        {/* Center: Vault Status Indicator */}
        <div className="hidden md:flex items-center gap-2 text-xs font-mono text-zinc-500">
          <span className="w-2 h-2 rounded-full bg-zinc-900 dark:bg-zinc-100"></span>
          <span>Vault: <strong className="text-zinc-800 dark:text-zinc-200 font-semibold">MainVault (/srv/obsidian)</strong></span>
        </div>

        {/* Right: Nickname Pill, Theme Switcher & Right Shutter Toggle */}
        <div className="flex items-center gap-2">
          
          {/* User Profile / Nickname Editor Pill */}
          <button 
            type="button"
            onClick={editNickname} 
            title="Нажмите, чтобы изменить имя пользователя"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors text-xs font-mono text-zinc-700 dark:text-zinc-300 shadow-2xs"
          >
            <User className="w-3.5 h-3.5 text-zinc-500" />
            <span className="font-semibold text-zinc-950 dark:text-zinc-100">{nickname}</span>
            <span className="text-[10px] text-zinc-400">✎</span>
          </button>

          {/* Language Switcher Dropdown */}
          <div className="relative" ref={langMenuRef}>
            <button 
              type="button"
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} 
              title="Сменить язык / Change language"
              className="p-2 sm:px-2.5 sm:py-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 transition-colors flex items-center gap-1 text-xs font-mono shadow-2xs"
            >
              <span className="text-sm select-none">
                {language === 'ru' ? '🇷🇺' : language === 'uk' ? '🇺🇦' : '🇬🇧'}
              </span>
              <span className="font-semibold uppercase text-[11px] hidden sm:inline">{language}</span>
              <span className="text-[10px] text-zinc-400">▾</span>
            </button>

            {isLangMenuOpen && (
              <div className="absolute top-full mt-2 right-0 w-36 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-1.5 shadow-2xl font-mono text-xs z-50 text-left animate-fade-in">
                {[
                  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
                  { code: 'uk', label: 'Українська', flag: '🇺🇦' },
                  { code: 'en', label: 'English', flag: '🇬🇧' },
                ].map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => {
                      setLanguage(item.code as any);
                      setIsLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded flex items-center justify-between transition-colors ${
                      language === item.code 
                        ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-zinc-100 font-bold' 
                        : 'hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{item.flag}</span>
                      <span>{item.label}</span>
                    </span>
                    {language === item.code && <span>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Switcher */}
          <button 
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
            title="Сменить тему (Светлая / Тёмная)"
            className="p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 transition-colors text-xs font-mono shadow-2xs"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          {/* Separate Right Shutter Toggle Button (История диалогов) */}
          <button 
            type="button"
            onClick={toggleSidebar} 
            title="Свернуть / развернуть правую шторку (История диалогов)"
            className={`p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 transition-colors flex items-center justify-center shadow-2xs ${
              !isSidebarOpen ? 'opacity-60' : ''
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2"/>
              <path d="M15 3v18" strokeWidth="2"/>
            </svg>
          </button>

        </div>

      </header>

      {/* ==================== 2. MAIN WORKSPACE AREA ==================== */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* ==================== LEFT SIDEBAR: OBSIDIAN VAULT EXPLORER ==================== */}
        <aside 
          className={`w-64 sm:w-72 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 flex flex-col shrink-0 transition-all duration-200 ${
            isLeftSidebarOpen ? 'translate-x-0' : '-ml-64 sm:-ml-72 hidden'
          }`}
        >
          {/* Vault Explorer Header */}
          <div className="p-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-900 dark:text-zinc-100">
              <svg className="w-4 h-4 text-zinc-700 dark:text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
              </svg>
              <span>Obsidian Vault</span>
            </div>
            <div className="flex items-center gap-1">
              <button 
                type="button"
                onClick={() => {
                  const name = prompt("Название новой заметки (например, Daily/2026-11-12.md):");
                  if (name) showToast(`Заметка [[${name}]] создана в Vault!`, 'success');
                }} 
                title="Новая заметка" 
                className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
              <button 
                type="button"
                onClick={() => {
                  const folder = prompt("Название новой папки:");
                  if (folder) showToast(`Папка /${folder} создана!`, 'success');
                }} 
                title="Новая папка" 
                className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
              </button>
            </div>
          </div>

          {/* Quick Search Filter */}
          <div className="p-2 border-b border-zinc-200 dark:border-zinc-800">
            <div className="relative">
              <input 
                type="text" 
                id="vaultSearchInput"
                value={vaultSearchQuery}
                onChange={(e) => setVaultSearchQuery(e.target.value)}
                placeholder="Поиск заметок и файлов (Ctrl+K)..." 
                className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md py-1.5 pl-7 pr-2 text-xs font-mono text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-500"
              />
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2 top-2" />
            </div>
          </div>

          {/* Vault File Tree */}
          <div className="flex-1 overflow-y-auto p-2 text-xs font-mono space-y-1">
            {Object.entries(vaultFolders).map(([folderName, files]) => {
              const visibleFiles = files.filter(isPathVisible);
              if (vaultSearchQuery.trim() && visibleFiles.length === 0) return null;
              const isCollapsed = collapsedFolders[folderName];

              return (
                <div key={folderName} className="vault-folder">
                  <button 
                    type="button"
                    onClick={() => toggleFolder(folderName)} 
                    className="w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60 text-zinc-800 dark:text-zinc-200 group text-left transition-colors"
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="text-zinc-400 text-[10px]">{isCollapsed ? '▶' : '▼'}</span>
                      <svg className="w-3.5 h-3.5 text-zinc-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
                      </svg>
                      <span className="font-medium truncate">{folderName}</span>
                    </div>
                    <span className="text-[10px] text-zinc-400 shrink-0">{files.length}</span>
                  </button>

                  {!isCollapsed && (
                    <div className="pl-4 space-y-0.5 mt-0.5">
                      {visibleFiles.map(filePath => {
                        const filename = filePath.split('/').pop() || filePath;
                        const isToday = filePath.includes('2026-09-28') || filePath.includes('2026-11-10');

                        return (
                          <div 
                            key={filePath}
                            draggable={true}
                            onDragStart={(e) => handleDragStartNote(e, filePath)}
                            onClick={() => openNote(filePath)}
                            title={language === 'uk' ? 'Перетягніть у рядок чату або натисніть для перегляду' : language === 'en' ? 'Drag to chat or click to view' : 'Перетащите в строку чата или нажмите для просмотра'}
                            className="flex items-center justify-between px-2 py-1 rounded hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 cursor-grab active:cursor-grabbing text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors group select-none"
                          >
                            <div className="flex items-center gap-1.5 truncate">
                              <span className="text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] select-none">⋮⋮</span>
                              <FileText className="w-3 h-3 text-zinc-400 shrink-0 group-hover:text-zinc-900 dark:group-hover:text-zinc-100" />
                              <span className="truncate">{filename}</span>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              {isToday && (
                                <span className="text-[9px] text-zinc-400 border border-zinc-200 dark:border-zinc-800 rounded px-1 shrink-0">Today</span>
                              )}
                              <span className="text-[9px] font-mono text-zinc-400 opacity-0 group-hover:opacity-80 transition-opacity hidden sm:inline" title="Перетащите">
                                ↗
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Left Sidebar Footer: Vault Quick Stats */}
          <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 text-[11px] font-mono text-zinc-500 flex items-center justify-between">
            <span>{Object.keys(notes).length} файлов • 4 папки</span>
            <button 
              type="button"
              onClick={() => showToast("Синхронизация дерева хранилища выполнена", 'info')} 
              title="Синхронизировать файлы" 
              className="hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

        </aside>

        {/* ==================== CENTER AREA: GEMINI-STYLE MINIMALIST CHAT ==================== */}
        <main 
          onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; }}
          onDrop={handleDropOnInput}
          className="flex-1 flex flex-col h-full bg-white dark:bg-zinc-950 relative overflow-hidden transition-colors"
        >
          
          {/* Subtle Technical Grid (Strict monochrome, NO glow/auras) */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-30 dark:opacity-20 pointer-events-none"></div>

          {/* Dialogue History Stream (Rendered once active conversation has messages) */}
          {hasMessages ? (
            <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-6 max-w-4xl mx-auto w-full z-10">
              
              {activeSession?.messages.map((message) => {
                const isUser = message.role === 'user';

                return (
                  <div 
                    key={message.id} 
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} w-full animate-fade-in`}
                  >
                    {/* Sender Avatar & Time */}
                    <div className={`flex items-center gap-2 mb-1.5 ${isUser ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold border ${
                        isUser 
                          ? 'bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 border-zinc-950 dark:border-zinc-100' 
                          : 'bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'
                      }`}>
                        {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                      </div>
                      <span className="text-[11px] font-mono text-zinc-400">
                        {isUser ? nickname : 'Obsidian AI Hub'} • {message.timestamp}
                      </span>
                    </div>

                    {/* ReAct Tool Calling Accordion */}
                    {message.toolCalls && message.toolCalls.length > 0 && (
                      <ToolCallsAccordion 
                        toolCalls={message.toolCalls} 
                        openNote={openNote} 
                      />
                    )}

                    {/* Message Bubble: Clean Monochrome */}
                    <div 
                      className={`p-4 rounded-2xl border text-left shadow-2xs font-sans text-sm ${
                        isUser 
                          ? 'max-w-xl bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 border-zinc-950 dark:border-zinc-100 rounded-tr-none' 
                          : 'w-full bg-zinc-50 dark:bg-zinc-900/70 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-tl-none'
                      }`}
                    >
                      {/* Attachments */}
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3 pb-2.5 border-b border-zinc-200 dark:border-zinc-800">
                          {message.attachments.map((att, attIdx) => (
                            <div key={attIdx} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-mono text-zinc-700 dark:text-zinc-300">
                              <FileText className="w-3.5 h-3.5 text-zinc-500" />
                              <span>{att.name}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {renderMessageContent(message)}
                    </div>

                  </div>
                );
              })}

              {/* Agent Thinking Indicator */}
              {isAgentTyping && (
                <div className="flex flex-col items-start w-full animate-fade-in">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-6 h-6 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center">
                      <Bot className="w-3.5 h-3.5 animate-spin" />
                    </div>
                    <span className="text-xs font-mono text-zinc-500">
                      {currentAgentAction || t.agent_thinking}
                    </span>
                  </div>
                  <div className="w-full p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-tl-none flex items-center gap-2 text-xs font-mono text-zinc-500">
                    <span className="w-2 h-2 rounded-full bg-zinc-900 dark:bg-zinc-100 animate-ping" />
                    <span>{t.agent_calling_api}</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          ) : (
            /* Center Welcome Screen: Inspired by Gemini, Strictly Monochrome, No Glow */
            <div className="flex-1 flex flex-col items-center justify-center px-4 max-w-3xl mx-auto w-full z-10 text-center my-auto">
              
              {/* Dynamic Greeting Header with Nickname & Visible Shuffle Button */}
              <div className="mb-8 flex items-center justify-center gap-3">
                <h1 
                  onClick={cycleGreeting}
                  title="Кликните, чтобы сменить приветствие"
                  className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 leading-tight cursor-pointer select-none hover:opacity-90 transition-opacity"
                >
                  {greetingsPool[greetingIndex]}
                </h1>
                
                <button 
                  type="button"
                  onClick={cycleGreeting} 
                  title="Сменить фразу приветствия"
                  className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-100 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all flex items-center justify-center shadow-2xs shrink-0"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {/* Minimalist Gemini-Style Input Capsule (Monochrome, No Glow, Drag & Drop Enabled) */}
              <div className="w-full relative">
                {/* Dragging over indicator pill */}
                {isDragOverInput && (
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-mono font-semibold shadow-xl border border-zinc-700 animate-bounce flex items-center gap-2 z-30 pointer-events-none">
                    <span>📥</span>
                    <span>{language === 'uk' ? 'Відпустіть файл, щоб прикріпити до запиту' : language === 'en' ? 'Drop file to attach to prompt' : 'Отпустите файл, чтобы прикрепить к запросу'}</span>
                  </div>
                )}

                {/* Attached Notes Chips (from drag & drop or wikilink) */}
                {attachedNotes.length > 0 && (
                  <div className="mb-2 flex flex-wrap items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100/90 dark:bg-zinc-900/90 font-mono text-xs text-left shadow-2xs">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
                      {language === 'uk' ? 'Прикріплено:' : language === 'en' ? 'Attached:' : 'Прикреплено:'}
                    </span>
                    {attachedNotes.map((path) => (
                      <span 
                        key={path}
                        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs shadow-2xs"
                      >
                        <FileText className="w-3.5 h-3.5 text-zinc-500" />
                        <button 
                          type="button" 
                          onClick={() => openNote(path)} 
                          className="hover:underline font-medium"
                          title="Открыть заметку"
                        >
                          {path}
                        </button>
                        <button 
                          type="button" 
                          onClick={() => removeAttachedNote(path)} 
                          className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 ml-0.5 p-0.5 font-bold"
                          title="Удалить прикрепление"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <div 
                  onDragOver={handleDragOverInput}
                  onDragLeave={handleDragLeaveInput}
                  onDrop={handleDropOnInput}
                  className={`relative flex items-center rounded-2xl border shadow-sm transition-all p-1.5 sm:p-2 ${
                    isDragOverInput 
                      ? 'border-dashed border-2 border-zinc-900 dark:border-zinc-100 bg-zinc-100 dark:bg-zinc-800/90 ring-2 ring-zinc-400/50' 
                      : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/80 hover:border-zinc-400 dark:hover:border-zinc-600 focus-within:border-zinc-900 dark:focus-within:border-zinc-100'
                  }`}
                >
                  
                  {/* Plus Action Button (Attach / Wikilink) */}
                  <div className="relative" ref={attachMenuRef}>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsAttachMenuOpen(!isAttachMenuOpen);
                        setIsModelMenuOpen(false);
                      }} 
                      title="Прикрепить заметку, аудио или файл" 
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-200/70 dark:hover:bg-zinc-800/70 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>

                    {/* Attach Dropdown Menu (Positioned cleanly below the capsule) */}
                    {isAttachMenuOpen && (
                      <div className="absolute top-full mt-2 left-0 w-60 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-1.5 shadow-2xl font-mono text-xs z-50 text-left animate-fade-in">
                        <button 
                          type="button" 
                          onClick={insertWikilinkPrompt} 
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2.5 text-zinc-800 dark:text-zinc-200 transition-colors"
                        >
                          <FileText className="w-4 h-4 text-zinc-500" />
                          <span>Вставить [[Заметку]]</span>
                        </button>
                        <button 
                          type="button" 
                          onClick={() => {
                            setIsAttachMenuOpen(false);
                            setMultimodalModal('voice');
                          }} 
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2.5 text-zinc-800 dark:text-zinc-200 transition-colors"
                        >
                          <Mic className="w-4 h-4 text-zinc-500" />
                          <span>Голосовая заметка (STT)</span>
                        </button>
                        <button 
                          type="button" 
                          onClick={() => {
                            setIsAttachMenuOpen(false);
                            setMultimodalModal('camera');
                          }} 
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2.5 text-zinc-800 dark:text-zinc-200 transition-colors"
                        >
                          <Camera className="w-4 h-4 text-zinc-500" />
                          <span>Скан документа (OCR)</span>
                        </button>
                        <button 
                          type="button" 
                          onClick={() => {
                            setIsAttachMenuOpen(false);
                            fileInputRef.current?.click();
                          }} 
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2.5 text-zinc-800 dark:text-zinc-200 transition-colors"
                        >
                          <Paperclip className="w-4 h-4 text-zinc-500" />
                          <span>Прикрепить файл</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Main Input Field */}
                  <input 
                    ref={inputRef}
                    type="text" 
                    value={inputPrompt}
                    onChange={(e) => setInputPrompt(e.target.value)}
                    onClick={() => {
                      setIsAttachMenuOpen(false);
                      setIsModelMenuOpen(false);
                    }}
                    onKeyDown={handleInputKeyDown}
                    placeholder={
                      language === 'uk' 
                        ? 'Запитати Obsidian AI або ввести команду...' 
                        : language === 'en'
                        ? 'Ask Obsidian AI or enter a command...'
                        : 'Спросить Obsidian AI или ввести команду...'
                    }
                    className="flex-1 bg-transparent px-3 py-2 text-sm sm:text-base text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
                  />

                  {/* Model Selection Dropdown */}
                  <div className="relative shrink-0" ref={modelMenuRef}>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsModelMenuOpen(!isModelMenuOpen);
                        setIsAttachMenuOpen(false);
                      }} 
                      className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-xs font-mono text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors shadow-2xs"
                    >
                      <span>{selectedModel}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                    </button>

                    {isModelMenuOpen && (
                      <div className="absolute top-full mt-2 right-0 w-52 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-1.5 shadow-2xl font-mono text-xs z-50 text-left animate-fade-in">
                        {['Flash Средний (Groq)', 'Gemini 2.0 Flash', 'Local ReAct :27124', 'Ollama (llama3.2)'].map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => {
                              setSelectedModel(m);
                              setIsModelMenuOpen(false);
                              showToast(`Модель переключена: ${m}`, 'info');
                            }}
                            className="w-full text-left px-2.5 py-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 transition-colors"
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Voice Mic Button */}
                  <button 
                    type="button"
                    onClick={() => setMultimodalModal('voice')} 
                    title="Голосовой ввод (Groq Whisper STT)"
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-200/70 dark:hover:bg-zinc-800/70 transition-colors shrink-0"
                  >
                    <Mic className="w-4 h-4" />
                  </button>

                  {/* Send Button */}
                  <button 
                    type="button"
                    onClick={() => handleSend()} 
                    title="Отправить сообщение (Enter)"
                    className="w-9 h-9 rounded-xl bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 flex items-center justify-center hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-xs shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>

                </div>
              </div>

            </div>
          )}

          {/* Bottom Pinned Input Bar (Visible only when conversation is active, Drag & Drop Enabled) */}
          {hasMessages && (
            <div className="border-t border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md p-3 sm:p-4 shrink-0 z-20">
              <div className="max-w-4xl mx-auto space-y-2">
                
                {/* Dragging over indicator pill */}
                {isDragOverInput && (
                  <div className="px-3 py-1.5 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-mono font-semibold text-center border border-zinc-700 animate-pulse">
                    📥 {language === 'uk' ? 'Відпустіть файл для прикріплення до запиту' : language === 'en' ? 'Drop file to attach to prompt' : 'Отпустите файл для прикрепления к запросу'}
                  </div>
                )}

                {/* Attached Notes Chips in Bottom Bar */}
                {attachedNotes.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
                      {language === 'uk' ? 'Прикріплено:' : language === 'en' ? 'Attached:' : 'Прикреплено:'}
                    </span>
                    {attachedNotes.map((path) => (
                      <span 
                        key={path}
                        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs shadow-2xs"
                      >
                        <FileText className="w-3.5 h-3.5 text-zinc-500" />
                        <button type="button" onClick={() => openNote(path)} className="hover:underline font-medium">
                          {path}
                        </button>
                        <button type="button" onClick={() => removeAttachedNote(path)} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 ml-0.5 font-bold">
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <div 
                  onDragOver={handleDragOverInput}
                  onDragLeave={handleDragLeaveInput}
                  onDrop={handleDropOnInput}
                  className={`flex items-center gap-2 p-1 rounded-xl transition-all ${
                    isDragOverInput ? 'border-dashed border-2 border-zinc-900 dark:border-zinc-100 bg-zinc-100 dark:bg-zinc-800/80 ring-2 ring-zinc-400/50' : ''
                  }`}
                >
                  <button 
                    type="button" 
                    onClick={insertWikilinkPrompt} 
                    title="Прикрепить заметку" 
                    className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors shrink-0"
                  >
                    <Plus className="w-5 h-5" />
                  </button>

                  <input 
                    ref={bottomInputRef}
                    type="text" 
                    value={inputPrompt}
                    onChange={(e) => setInputPrompt(e.target.value)}
                    onKeyDown={handleInputKeyDown}
                    placeholder={
                      language === 'uk' 
                        ? 'Запитати асистента або ввести команду...' 
                        : language === 'en'
                        ? 'Ask assistant or enter a command...'
                        : 'Спросить ассистента или ввести команду...'
                    }
                    className="flex-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 font-sans"
                  />

                  <button 
                    type="button" 
                    onClick={() => setMultimodalModal('voice')} 
                    title="Голос" 
                    className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors shrink-0"
                  >
                    <Mic className="w-4 h-4" />
                  </button>

                  <button 
                    type="button" 
                    onClick={() => handleSend()} 
                    title="Отправить" 
                    className="px-4 py-2 rounded-xl bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shrink-0 shadow-xs"
                  >
                    {t.send_btn}
                  </button>

                </div>
              </div>
            </div>
          )}

        </main>

        {/* ==================== 3. RIGHT SIDEBAR: CHAT HISTORY & VAULT SHORTCUTS ==================== */}
        <aside 
          className={`w-64 sm:w-72 border-l border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 flex flex-col shrink-0 transition-all duration-200 ${
            isSidebarOpen ? 'translate-x-0' : '-mr-64 sm:-mr-72 hidden'
          }`}
        >
          {/* History Header with compact + button (NO big button on top) */}
          <div className="p-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-600 dark:text-zinc-400 font-semibold">
              {t.chat_history}
            </span>
            <button 
              type="button"
              onClick={handleCreateNewChat} 
              title="Начать новый диалог" 
              className="p-1 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors flex items-center gap-1 text-xs font-mono"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Dialogue History List */}
          <div className="flex-1 overflow-y-auto p-3 text-xs space-y-4">
            
            {/* Group: Сегодня */}
            {todayChats.length > 0 && (
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-zinc-400 mb-1.5 font-semibold">
                  {t.today}
                </div>
                <div className="space-y-1">
                  {todayChats.map(s => (
                    <div 
                      key={s.id}
                      onClick={() => selectChat(s.id)} 
                      className={`group p-2 rounded-lg cursor-pointer shadow-2xs flex items-center justify-between transition-colors ${
                        s.id === activeSession?.id
                          ? 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-zinc-100 font-medium'
                          : 'hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      <span className="truncate flex-1 pr-1">{s.title}</span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {s.id === activeSession?.id && (
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100"></span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); deleteChat(s.id); }}
                          className="opacity-0 group-hover:opacity-100 p-0.5 text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 transition-opacity"
                          title="Удалить диалог"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Group: Вчера */}
            {yesterdayChats.length > 0 && (
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-zinc-400 mb-1.5 font-semibold">
                  {t.yesterday}
                </div>
                <div className="space-y-1">
                  {yesterdayChats.map(s => (
                    <div 
                      key={s.id}
                      onClick={() => selectChat(s.id)} 
                      className={`group p-2 rounded-lg cursor-pointer transition-colors flex items-center justify-between ${
                        s.id === activeSession?.id
                          ? 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-zinc-100 font-medium'
                          : 'hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      <span className="truncate flex-1 pr-1">{s.title}</span>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); deleteChat(s.id); }}
                        className="opacity-0 group-hover:opacity-100 p-0.5 text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 transition-opacity"
                        title="Удалить диалог"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Group: Прошлые 7 дней */}
            {past7Chats.length > 0 && (
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-zinc-400 mb-1.5 font-semibold">
                  {t.past7days}
                </div>
                <div className="space-y-1">
                  {past7Chats.map(s => (
                    <div 
                      key={s.id}
                      onClick={() => selectChat(s.id)} 
                      className={`group p-2 rounded-lg cursor-pointer transition-colors flex items-center justify-between ${
                        s.id === activeSession?.id
                          ? 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-zinc-100 font-medium'
                          : 'hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      <span className="truncate flex-1 pr-1">{s.title}</span>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); deleteChat(s.id); }}
                        className="opacity-0 group-hover:opacity-100 p-0.5 text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 transition-opacity"
                        title="Удалить диалог"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Access to Vault Notes */}
            <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800">
              <div className="font-mono text-[10px] uppercase tracking-wider text-zinc-400 mb-1.5 font-semibold flex items-center justify-between">
                <span>{t.quick_vault_title}</span>
                <span className="text-zinc-400">{Object.keys(notes).length} файла</span>
              </div>
              <div className="space-y-1 font-mono text-[11px]">
                {Object.values(notes).slice(0, 5).map(n => (
                  <div 
                    key={n.path}
                    draggable={true}
                    onDragStart={(e) => handleDragStartNote(e, n.path)}
                    onClick={() => openNote(n.path)} 
                    title={language === 'uk' ? 'Перетягніть у рядок чату або натисніть для перегляду' : language === 'en' ? 'Drag to chat or click to view' : 'Перетащите в строку чата или нажмите для просмотра'}
                    className="p-1.5 rounded hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 flex items-center justify-between cursor-grab active:cursor-grabbing text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors group select-none"
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] select-none">⋮⋮</span>
                      <FileText className="w-3 h-3 text-zinc-400 shrink-0 group-hover:text-zinc-900 dark:group-hover:text-zinc-100" />
                      <span className="truncate">{n.path}</span>
                    </div>
                    <ChevronRight className="w-3 h-3 text-zinc-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Sidebar Footer: Settings Button */}
          <div className="p-3 border-t border-zinc-200 dark:border-zinc-800">
            {/* Settings Button */}
            <button 
              type="button"
              onClick={() => setRoute('/settings')} 
              className="w-full py-2 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-xs font-mono flex items-center justify-center gap-2 text-zinc-700 dark:text-zinc-300 shadow-2xs"
            >
              <SettingsIcon className="w-3.5 h-3.5 text-zinc-500" />
              <span>{t.settings_btn} (/settings)</span>
            </button>
          </div>

        </aside>

      </div>

    </div>
  );
};

export default ChatInterface;
