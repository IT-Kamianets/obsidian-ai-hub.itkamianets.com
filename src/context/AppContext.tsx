import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  AppRoute, 
  ChatSession, 
  ChatMessage, 
  ToolCall, 
  VaultNote, 
  SQLiteJob, 
  AppSettings, 
  MessageAttachment 
} from '../types';
import { 
  INITIAL_VAULT_NOTES, 
  INITIAL_CHAT_SESSIONS, 
  INITIAL_SQLITE_JOBS, 
  DEFAULT_SETTINGS 
} from '../data/mockVault';
import { AppTheme, AppLanguage, Translations, TRANSLATIONS } from '../i18n/translations';

interface ToastState {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'tool';
  subtext?: string;
}

interface AppContextType {
  route: AppRoute;
  setRoute: (route: AppRoute) => void;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  login: (email?: string, pass?: string) => void;
  bypassAuth: () => void;
  logout: () => void;

  // Theme & Language
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  t: Translations;
  
  // Chats
  sessions: ChatSession[];
  activeSessionId: string;
  activeSession: ChatSession | undefined;
  createNewChat: () => void;
  selectChat: (id: string) => void;
  deleteChat: (id: string) => void;
  sendMessage: (content: string, attachments?: MessageAttachment[]) => Promise<void>;
  isAgentTyping: boolean;
  currentAgentAction: string | null;

  // Obsidian Tasks & Vault
  notes: Record<string, VaultNote>;
  selectedNotePath: string | null;
  openNote: (path: string) => void;
  closeNote: () => void;
  toggleTaskStatus: (taskText: string, currentStatus: boolean, sourceNote?: string) => void;
  saveNote: (path: string, content: string) => void;

  // SQLite Queue
  sqliteJobs: SQLiteJob[];
  retryJob: (id: string) => void;
  clearCompletedJobs: () => void;

  // Settings
  settings: AppSettings;
  updateSettings: (partial: Partial<AppSettings>) => void;
  toggleOfflineMode: () => void;

  // Drawer & UI
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setIsSidebarOpen: (open: boolean) => void;
  toasts: ToastState[];
  showToast: (message: string, type?: ToastState['type'], subtext?: string) => void;
  removeToast: (id: string) => void;

  // Multimodal Dialogs
  multimodalModal: 'voice' | 'camera' | null;
  setMultimodalModal: (type: 'voice' | 'camera' | null) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Routing based on hash or state
  const [route, setRouteState] = useState<AppRoute>(() => {
    const hash = window.location.hash.replace('#', '') as AppRoute;
    if (hash === '/chat' || hash === '/settings' || hash === '/') return hash;
    return '/';
  });

  const setRoute = (newRoute: AppRoute) => {
    setRouteState(newRoute);
    window.location.hash = newRoute;
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as AppRoute;
      if (hash === '/chat' || hash === '/settings' || hash === '/') {
        setRouteState(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Auth
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Chats
  const [sessions, setSessions] = useState<ChatSession[]>(INITIAL_CHAT_SESSIONS);
  const [activeSessionId, setActiveSessionId] = useState<string>(INITIAL_CHAT_SESSIONS[0].id);
  const [isAgentTyping, setIsAgentTyping] = useState<boolean>(false);
  const [currentAgentAction, setCurrentAgentAction] = useState<string | null>(null);

  // Vault & Tasks
  const [notes, setNotes] = useState<Record<string, VaultNote>>(INITIAL_VAULT_NOTES);
  const [selectedNotePath, setSelectedNotePath] = useState<string | null>(null);

  // SQLite Queue
  const [sqliteJobs, setSqliteJobs] = useState<SQLiteJob[]>(INITIAL_SQLITE_JOBS);

  // Settings with persistent Theme & Language
  const [settings, setSettings] = useState<AppSettings>(() => {
    const savedTheme = localStorage.getItem('obsidian_hub_theme') as AppTheme;
    const savedLang = localStorage.getItem('obsidian_hub_lang') as AppLanguage;
    return {
      ...DEFAULT_SETTINGS,
      theme: (savedTheme === 'light' || savedTheme === 'oled' || savedTheme === 'dark') ? savedTheme : DEFAULT_SETTINGS.theme,
      language: (savedLang === 'ru' || savedLang === 'uk' || savedLang === 'en') ? savedLang : DEFAULT_SETTINGS.language,
    };
  });

  const theme = settings.theme;
  const language = settings.language;
  const t = TRANSLATIONS[language] || TRANSLATIONS.ru;

  const setTheme = (newTheme: AppTheme) => {
    localStorage.setItem('obsidian_hub_theme', newTheme);
    setSettings((prev) => ({ ...prev, theme: newTheme }));
    document.documentElement.setAttribute('data-theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme !== 'light');
    const label = newTheme === 'light' ? 'Светлая' : newTheme === 'oled' ? 'OLED True Black' : 'Obsidian Dark';
    showToast(`Тема изменена: ${label}`, 'info');
  };

  const setLanguage = (newLang: AppLanguage) => {
    localStorage.setItem('obsidian_hub_lang', newLang);
    setSettings((prev) => ({ ...prev, language: newLang }));
    const label = newLang === 'ru' ? 'Русский' : newLang === 'uk' ? 'Українська' : 'English';
    showToast(`Мова / Язык: ${label}`, 'info');
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
    document.documentElement.classList.toggle('dark', settings.theme !== 'light');
  }, [settings.theme]);

  // UI
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const [multimodalModal, setMultimodalModal] = useState<'voice' | 'camera' | null>(null);

  const showToast = (message: string, type: ToastState['type'] = 'info', subtext?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, subtext }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const startFreshChat = () => {
    // Check if there is already an empty "Новый диалог" session
    const existingEmpty = sessions.find((s) => s.messages.length === 0);
    if (existingEmpty) {
      setActiveSessionId(existingEmpty.id);
      return;
    }
    // Otherwise create a new clean session
    const newId = `chat_${Date.now()}`;
    const newSession: ChatSession = {
      id: newId,
      title: 'Новый диалог',
      dateGroup: 'today',
      createdAt: new Date().toISOString(),
      messages: []
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newId);
  };

  const login = (_email?: string, _pass?: string) => {
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
    startFreshChat();
    setRoute('/chat');
    showToast(
      language === 'uk' ? 'Успішний вхід в акаунт' : language === 'en' ? 'Signed in successfully' : 'Успешный вход в аккаунт',
      'success',
      language === 'uk' ? 'Синхронізація із захищеним сховищем' : language === 'en' ? 'Vault sync active' : 'Синхронизация с защищенным хранилищем'
    );
  };

  const bypassAuth = () => {
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
    startFreshChat();
    setRoute('/chat');
    showToast(
      language === 'uk' ? 'Гостьовий / Демо-режим активний' : language === 'en' ? 'Guest / Demo mode active' : 'Гостевой / Демо-режим активен',
      'info'
    );
  };

  const logout = () => {
    setIsAuthenticated(false);
    setRoute('/');
    showToast(
      language === 'uk' ? 'Ви вийшли із системи' : language === 'en' ? 'Logged out' : 'Вы вышли из системы',
      'info'
    );
  };

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  const createNewChat = () => {
    const current = sessions.find((s) => s.id === activeSessionId);
    if (current && current.messages.length === 0) {
      showToast(
        language === 'uk' ? 'Ви вже у чистому діалозі' : language === 'en' ? 'Already in an empty chat' : 'Вы уже в чистом диалоге',
        'info'
      );
      return;
    }
    const newId = `chat_${Date.now()}`;
    const newTitle = language === 'uk' ? 'Новий діалог' : language === 'en' ? 'New Chat' : 'Новый диалог';
    const newSession: ChatSession = {
      id: newId,
      title: newTitle,
      dateGroup: 'today',
      createdAt: new Date().toISOString(),
      messages: []
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newId);
    showToast(
      language === 'uk' ? 'Створено новий діалог' : language === 'en' ? 'Created new chat' : 'Создан чистый диалог',
      'info'
    );
  };

  const selectChat = (id: string) => {
    setActiveSessionId(id);
  };

  const deleteChat = (id: string) => {
    setSessions((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      if (filtered.length > 0 && activeSessionId === id) {
        setActiveSessionId(filtered[0].id);
      }
      return filtered;
    });
    showToast(
      language === 'uk' ? 'Діалог видалено' : language === 'en' ? 'Chat deleted' : 'Диалог удален',
      'warning'
    );
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const openNote = (path: string) => {
    // Normalize path if starts with [[ or ends with ]]
    const cleanPath = path.replace(/^\[\[/, '').replace(/\]\]$/, '').trim();
    // Check direct match or append .md
    let target = cleanPath;
    if (!notes[target] && notes[`${target}.md`]) {
      target = `${target}.md`;
    } else if (!notes[target]) {
      const matchKey = Object.keys(notes).find((k) => k.toLowerCase().includes(target.toLowerCase()));
      if (matchKey) target = matchKey;
    }

    if (notes[target]) {
      setSelectedNotePath(target);
      showToast(
        language === 'uk' ? `Відкрито нотатку: ${target}` : language === 'en' ? `Opened note: ${target}` : `Открыта заметка: ${target}`,
        'info',
        language === 'uk' ? 'Читання через Obsidian Local REST API' : language === 'en' ? 'Read via Obsidian Local REST API' : 'Чтение через Obsidian Local REST API'
      );
    } else {
      // Create a new mock note if not found
      const newNote: VaultNote = {
        path: target.endsWith('.md') ? target : `${target}.md`,
        title: target.split('/').pop()?.replace('.md', '') || target,
        frontmatter: { type: 'note', created: new Date().toISOString().slice(0, 10) },
        lastModified: language === 'uk' ? 'Щойно' : language === 'en' ? 'Just now' : 'Только что',
        content: `# ${target}\n\n${language === 'uk' ? 'Нотатка створена автоматично через `create_note`.' : language === 'en' ? 'Note created automatically via `create_note`.' : 'Заметка создана автоматически через вызов `create_note`.'}\n\n- [ ] ${language === 'uk' ? 'Нове завдання у цій нотатці' : language === 'en' ? 'New task in this note' : 'Новая задача в этой заметке'} 📅 ${new Date().toISOString().slice(0, 10)}`
      };
      setNotes((prev) => ({ ...prev, [newNote.path]: newNote }));
      setSelectedNotePath(newNote.path);
      showToast(
        language === 'uk' ? `Створено нову нотатку: ${newNote.path}` : language === 'en' ? `Created new note: ${newNote.path}` : `Создана новая заметка: ${newNote.path}`,
        'success'
      );
    }
  };

  const closeNote = () => {
    setSelectedNotePath(null);
  };

  const saveNote = (path: string, content: string) => {
    setNotes((prev) => {
      if (!prev[path]) return prev;
      return {
        ...prev,
        [path]: {
          ...prev[path],
          content,
          lastModified: language === 'uk' ? 'Щойно' : language === 'en' ? 'Just now' : 'Только что'
        }
      };
    });
    showToast(
      language === 'uk' ? `Збережено: ${path}` : language === 'en' ? `Saved: ${path}` : `Сохранено: ${path}`,
      'success',
      'PUT /vault/' + path + ' (200 OK)'
    );
  };

  // Toggle tasks in messages AND in vault notes
  const toggleTaskStatus = (taskText: string, currentStatus: boolean, _sourceNote?: string) => {
    const newStatus = !currentStatus;
    const oldChar = currentStatus ? 'x' : ' ';
    const newChar = newStatus ? 'x' : ' ';
    const oldPattern = `- [${oldChar}] ${taskText}`;
    const newPattern = `- [${newChar}] ${taskText}`;
    const escaped = taskText.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`- \\[${oldChar}\\]\\s*${escaped}`, 'g');

    // Update in all chat messages
    setSessions((prevSessions) =>
      prevSessions.map((session) => ({
        ...session,
        messages: session.messages.map((msg) => {
          if (msg.content.includes(oldPattern)) {
            return {
              ...msg,
              content: msg.content.replace(oldPattern, newPattern)
            };
          }
          if (regex.test(msg.content)) {
            return {
              ...msg,
              content: msg.content.replace(regex, `- [${newChar}] ${taskText.trim()}`)
            };
          }
          return msg;
        })
      }))
    );

    // Update in daily note
    setNotes((prevNotes) => {
      const updated = { ...prevNotes };
      const dailyPath = 'Daily/2026-09-28.md';
      if (updated[dailyPath]) {
        let noteContent = updated[dailyPath].content;
        if (noteContent.includes(oldPattern)) {
          noteContent = noteContent.replace(oldPattern, newPattern);
        } else if (regex.test(noteContent)) {
          noteContent = noteContent.replace(regex, `- [${newChar}] ${taskText.trim()}`);
        }
        updated[dailyPath] = {
          ...updated[dailyPath],
          content: noteContent
        };
      }
      return updated;
    });

    showToast(
      `update_task_status`,
      'tool',
      `${newStatus ? (language === 'uk' ? '✓ Виконано:' : language === 'en' ? '✓ Done:' : '✓ Выполнено:') : (language === 'uk' ? '○ Знято відмітку:' : language === 'en' ? '○ Unchecked:' : '○ Снята отметка:')} "${taskText.slice(0, 32)}..."`
    );
  };

  const updateSettings = (partial: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
    showToast(
      language === 'uk' ? 'Налаштування оновлено' : language === 'en' ? 'Settings updated' : 'Настройки обновлены',
      'success',
      language === 'uk' ? 'Зашифровано в Secure Store' : language === 'en' ? 'Encrypted in Secure Store' : 'Зашифровано в Secure Store'
    );
  };

  const toggleOfflineMode = () => {
    setSettings((prev) => {
      const nextMode = !prev.offlineMode;
      const title = nextMode 
        ? (language === 'uk' ? 'Увімкнено Offline-режим' : language === 'en' ? 'Offline mode enabled' : 'Включен Offline-режим')
        : (language === 'uk' ? 'Відновлено Online-режим' : language === 'en' ? 'Online mode restored' : 'Восстановлен Online-режим');
      const sub = nextMode
        ? (language === 'uk' ? 'Запити зберігаються у локальну SQLite-чергу' : language === 'en' ? 'Requests queued in local SQLite buffer' : 'Запросы сохраняются в локальную SQLite-очередь')
        : (language === 'uk' ? 'Синхронізація черги READY_FOR_VAULT із сервером' : language === 'en' ? 'Syncing READY_FOR_VAULT queue with server' : 'Синхронизация очереди READY_FOR_VAULT с сервером');

      showToast(title, nextMode ? 'warning' : 'success', sub);

      // If switching back to online, auto-process pending sqlite jobs!
      if (!nextMode) {
        setTimeout(() => {
          setSqliteJobs((jobs) =>
            jobs.map((j) => (j.status === 'pending' ? { ...j, status: 'completed', updated_at: Date.now() } : j))
          );
          showToast(
            language === 'uk' ? 'Офлайн-чергу синхронізовано з Vault' : language === 'en' ? 'Offline queue flushed to Vault' : 'Офлайн-очередь сброшена в Vault',
            'success',
            '200 OK'
          );
        }, 1200);
      }

      return { ...prev, offlineMode: nextMode };
    });
  };

  const retryJob = (id: string) => {
    setSqliteJobs((jobs) =>
      jobs.map((job) => {
        if (job.id === id) {
          return {
            ...job,
            status: 'processing',
            retry_count: job.retry_count + 1
          };
        }
        return job;
      })
    );

    setTimeout(() => {
      setSqliteJobs((jobs) =>
        jobs.map((job) => {
          if (job.id === id) {
            return {
              ...job,
              status: 'completed',
              updated_at: Date.now()
            };
          }
          return job;
        })
      );
      showToast(
        language === 'uk' ? 'Завдання SQLite успішно синхронізовано' : language === 'en' ? 'SQLite job synced successfully' : 'Задача SQLite успешно синхронизирована',
        'success'
      );
    }, 1000);
  };

  const clearCompletedJobs = () => {
    setSqliteJobs((jobs) => jobs.filter((j) => j.status !== 'completed'));
    showToast(
      language === 'uk' ? 'Очищено завершені завдання черги' : language === 'en' ? 'Cleared completed queue jobs' : 'Очищены завершенные задачи очереди',
      'info'
    );
  };

  // ReAct Agent Simulation
  const sendMessage = async (userPrompt: string, attachments?: MessageAttachment[]) => {
    if (!userPrompt.trim() && (!attachments || attachments.length === 0)) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsgId = `usr_${Date.now()}`;
    const userMessage: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: userPrompt,
      timestamp: timeStr,
      attachments
    };

    // Update session title if first user prompt in "Новый диалог"
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === activeSessionId) {
          const isDefaultTitle = s.title === 'Новый диалог';
          const newTitle = isDefaultTitle ? (userPrompt.slice(0, 30) || 'Диалог с файлами') : s.title;
          return {
            ...s,
            title: newTitle,
            messages: [...s.messages, userMessage]
          };
        }
        return s;
      })
    );

    setIsAgentTyping(true);

    // If Offline Mode is ON, create an offline SQLite Job!
    if (settings.offlineMode) {
      await new Promise((res) => setTimeout(res, 800));
      const offlineJobId = `job_offline_${Date.now()}`;
      const newJob: SQLiteJob = {
        id: offlineJobId,
        pipeline_stage: attachments && attachments.some(a => a.type === 'audio' || a.type === 'image') ? 'RAW_EXTRACT' : 'READY_FOR_VAULT',
        action_type: userPrompt.toLowerCase().includes('план') ? 'MANAGE_DAILY' : 'AI_COMMAND',
        target_path: 'Daily/2026-09-28.md',
        payload: JSON.stringify({ prompt: userPrompt, attachments }),
        retry_count: 0,
        status: 'pending',
        created_at: Date.now(),
        updated_at: Date.now()
      };
      setSqliteJobs((prev) => [newJob, ...prev]);

      const offlineReply: ChatMessage = {
        id: `ast_${Date.now()}`,
        role: 'assistant',
        content: language === 'uk' 
          ? `⚠️ **Режим автономності (Offline-First):** Домашній REST Hub тимчасово недоступний або увімкнено автономний режим.

Команду поставлено у локальну чергу SQLite \`op-sqlite\`:
- **ID завдання:** \`${offlineJobId}\`
- **Стадія пайплайну:** \`${newJob.pipeline_stage}\`
- **Дія:** \`${newJob.action_type}\`

Як тільки зв'язок із сервером відновиться, фоновий Sync Worker автоматично виконає ReAct-цикл та оновить Vault.`
          : language === 'en'
          ? `⚠️ **Offline Resilience Mode (Local-First):** Local REST Hub is temporarily unreachable or offline mode is activated.

Command was enqueued into local SQLite buffer \`op-sqlite\`:
- **Job ID:** \`${offlineJobId}\`
- **Pipeline Stage:** \`${newJob.pipeline_stage}\`
- **Action:** \`${newJob.action_type}\`

As soon as network connectivity is restored, the background Sync Worker will execute the ReAct cycle and update your Vault.`
          : `⚠️ **Режим автономности (Offline-First):** Домашний REST Hub временно недоступен или включен автономный режим.

Команда поставлена в локальную очередь SQLite \`op-sqlite\`:
- **ID задачи:** \`${offlineJobId}\`
- **Стадия пайплайна:** \`${newJob.pipeline_stage}\`
- **Действие:** \`${newJob.action_type}\`

Как только связь с сервером восстановится, фоновый Sync Worker автоматически выполнит ReAct-цикл и обновит Vault.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setSessions((prev) =>
        prev.map((s) => (s.id === activeSessionId ? { ...s, messages: [...s.messages, offlineReply] } : s))
      );
      setIsAgentTyping(false);
      showToast(
        language === 'uk' ? `Запит збережено в SQLite-чергу (${newJob.pipeline_stage})` : language === 'en' ? `Request queued in SQLite (${newJob.pipeline_stage})` : `Запрос сохранен в SQLite-очередь (${newJob.pipeline_stage})`,
        'warning'
      );
      return;
    }

    // ONLINE MODE: Full ReAct Agent Tool Execution simulation
    const lower = userPrompt.toLowerCase();
    const toolCalls: ToolCall[] = [];

    // Step 1: Search or Read Note
    const actionSearch = language === 'uk'
      ? 'Інструмент: search_vault(query: "контекст та завдання")...'
      : language === 'en'
      ? 'Tool: search_vault(query: "context and tasks")...'
      : 'Инструмент: search_vault(query: "контекст и задачи")...';
    setCurrentAgentAction(actionSearch);
    await new Promise((res) => setTimeout(res, 600));

    toolCalls.push({
      id: `tc_${Date.now()}_1`,
      name: 'search_vault',
      parameters: { query: userPrompt.slice(0, 25) || 'Daily focus' },
      result: language === 'uk'
        ? 'Знайдено 3 нотатки: [[Daily/2026-09-28.md]], [[Daily/2026-09-27.md]], [[Projects/Architecture.md]]'
        : language === 'en'
        ? 'Found 3 notes: [[Daily/2026-09-28.md]], [[Daily/2026-09-27.md]], [[Projects/Architecture.md]]'
        : 'Найдено 3 заметки: [[Daily/2026-09-28.md]], [[Daily/2026-09-27.md]], [[Projects/Architecture.md]]',
      status: 'completed',
      timestamp: new Date().toLocaleTimeString()
    });

    // Step 2: Read note context
    const actionRead = language === 'uk'
      ? 'Аналіз: read_note("Daily/2026-09-27.md")...'
      : language === 'en'
      ? 'Analysis: read_note("Daily/2026-09-27.md")...'
      : 'Анализ: read_note("Daily/2026-09-27.md")...';
    setCurrentAgentAction(actionRead);
    await new Promise((res) => setTimeout(res, 700));

    toolCalls.push({
      id: `tc_${Date.now()}_2`,
      name: 'read_note',
      parameters: { relative_path: 'Daily/2026-09-27.md' },
      result: language === 'uk'
        ? 'Виявлено 1 незавершений пункт завдань за вчора'
        : language === 'en'
        ? 'Found 1 incomplete task from yesterday'
        : 'Обнаружен 1 незавершенный пункт задач за вчера',
      status: 'completed',
      timestamp: new Date().toLocaleTimeString()
    });

    // Step 3: Synthesis & Tool Execution
    let responseText = '';

    if (
      lower.includes('план') || 
      lower.includes('задач') || 
      lower.includes('завдан') || 
      lower.includes('plan') || 
      lower.includes('task') || 
      lower.includes('день') || 
      lower.includes('день') || 
      lower.includes('today')
    ) {
      setCurrentAgentAction('manage_daily_plan("Daily/2026-09-28.md")...');
      await new Promise((res) => setTimeout(res, 800));

      toolCalls.push({
        id: `tc_${Date.now()}_3`,
        name: 'manage_daily_plan',
        parameters: {
          relative_path: 'Daily/2026-09-28.md',
          summary: language === 'uk'
            ? 'Фокус на системній специфікації та перевірці черги'
            : language === 'en'
            ? 'Focus on system specification and queue validation'
            : 'Фокус на системной спецификации и проверке очереди',
          tasks: [
            { task_text: language === 'uk' ? 'Фіналізувати системну специфікацію' : language === 'en' ? 'Finalize system specification' : 'Финализировать системную спецификацию', priority: 'high' },
            { task_text: language === 'uk' ? 'Опрацювати відеозапис лекції' : language === 'en' ? 'Process lecture recording' : 'Обработать видеозапись лекции в структурированный конспект', priority: 'medium' },
            { task_text: language === 'uk' ? 'Синхронізувати сховище з ПК' : language === 'en' ? 'Sync vault with PC' : 'Синхронизировать хранилище с рабочим ПК', priority: 'low' },
            { task_text: language === 'uk' ? 'Провести стрес-тест SQLite' : language === 'en' ? 'Stress-test SQLite queue' : 'Провести стресс-тест SQLite очереди в оффлайн-режиме', priority: 'medium' }
          ]
        },
        result: 'HTTP 200 OK: Daily note updated in Vault',
        status: 'completed',
        timestamp: new Date().toLocaleTimeString()
      });

      if (language === 'uk') {
        responseText = `Я дослідив сховище через **Obsidian Local REST API** та синтезував контекст із вчорашніх підсумків:

## 🎯 Сформований план на сьогодні
Фокус дня: *Фіналізація архітектурної специфікації v3.0 та валідація офлайн-черги.*

### Завдання на день (Obsidian Tasks)
- [ ] Фіналізувати системну специфікацію ⏫ 📅 2026-09-28 #architecture
- [ ] Опрацювати відеозапис лекції у конспект 🔼 📅 2026-09-28 #study
- [ ] Синхронізувати сховище з робочим ПК 🔽 📅 2026-09-28 #devops
- [ ] Провести стрес-тест SQLite черги в офлайн-режимі 🔼 📅 2026-09-28 #qa
- [x] Перевірити Caddy TLS-проксі та порт 27124 📅 2026-09-28 #infra

> 💡 **Інтерактивність:** Чекбокси вище інтерактивні. Натисніть на будь-який із них — асистент миттєво викличе інструмент \`update_task_status\` і оновить фізичний файл [[Daily/2026-09-28.md]].`;
      } else if (language === 'en') {
        responseText = `I searched the vault via **Obsidian Local REST API** and synthesized context from yesterday's daily note:

## 🎯 Generated Schedule for Today
Daily Focus: *Finalizing architectural specification v3.0 and validating offline queue.*

### Today's Tasks (Obsidian Tasks)
- [ ] Finalize system architecture specification ⏫ 📅 2026-09-28 #architecture
- [ ] Process lecture recording into structured summary 🔼 📅 2026-09-28 #study
- [ ] Synchronize vault with workstation via Syncthing 🔽 📅 2026-09-28 #devops
- [ ] Run stress-test for SQLite queue in offline mode 🔼 📅 2026-09-28 #qa
- [x] Verify Caddy TLS reverse proxy on port 27124 📅 2026-09-28 #infra

> 💡 **Interactivity:** The checkboxes above are fully interactive. Clicking any box immediately triggers \`update_task_status\` and updates the physical file [[Daily/2026-09-28.md]].`;
      } else {
        responseText = `Я исследовал хранилище через **Obsidian Local REST API** и синтезировал контекст из вчерашних итогов:

## 🎯 Сформированный план на сегодня
Фокус дня: *Финализация архитектурной спецификации v3.0 и валидация офлайн-очереди.*

### Задачи на день (Obsidian Tasks)
- [ ] Финализировать системную спецификацию ⏫ 📅 2026-09-28 #architecture
- [ ] Обработать видеозапись лекции в структурированный конспект 🔼 📅 2026-09-28 #study
- [ ] Синхронизировать хранилище с рабочим ПК 🔽 📅 2026-09-28 #devops
- [ ] Провести стресс-тест SQLite очереди в оффлайн-режиме 🔼 📅 2026-09-28 #qa
- [x] Проверить Caddy TLS-прокси и порт 27124 📅 2026-09-28 #infra

> 💡 **Интерактивность:** Чекбоксы выше интерактивны. Кликни на любой из них — ассистент мгновенно вызовет инструмент \`update_task_status\` и запишет изменения в физический файл [[Daily/2026-09-28.md]].`;
      }

    } else if (lower.includes('голос') || lower.includes('аудио') || lower.includes('аудіо') || lower.includes('voice') || lower.includes('stt') || attachments?.some(a => a.type === 'audio')) {
      setCurrentAgentAction(language === 'uk' ? 'Транскрипція: Groq Whisper API (whisper-large-v3)...' : language === 'en' ? 'Transcribing with Groq Whisper API (whisper-large-v3)...' : 'Транскрипция: Groq Whisper API (whisper-large-v3)...');
      await new Promise((res) => setTimeout(res, 800));

      toolCalls.push({
        id: `tc_${Date.now()}_voice`,
        name: 'groq_whisper_stt',
        parameters: { audio_duration: '22s', model: 'whisper-large-v3' },
        result: language === 'uk'
          ? 'Транскрипція: "Додати до архітектурної документації розділ про P2P синхронізацію через Syncthing та шифрування токенів у Secure Store."'
          : language === 'en'
          ? 'Transcription: "Add a section on P2P synchronization with Syncthing and hardware keystore encryption to documentation."'
          : 'Транскрипция: "Добавить в архитектурную документацию раздел про P2P синхронизацию через Syncthing и шифрование токенов в Secure Store."',
        status: 'completed',
        timestamp: new Date().toLocaleTimeString()
      });

      toolCalls.push({
        id: `tc_${Date.now()}_append`,
        name: 'append_to_note',
        parameters: { relative_path: 'Inbox/Quick_Memos.md' },
        result: 'HTTP 200 OK: Appended to Inbox/Quick_Memos.md',
        status: 'completed',
        timestamp: new Date().toLocaleTimeString()
      });

      if (language === 'uk') {
        responseText = `🎙️ **Аудіозапис успішно розпізнано через Groq Whisper:**
> *"Додати до архітектурної документації розділ про P2P синхронізацію через Syncthing та шифрування токенів у Secure Store."*

Агент виконав:
1. Очищення від пауз та форматування у CommonMark.
2. Запис у [[Inbox/Quick_Memos.md]].
3. Створення завдання у щоденнику:
- [ ] Додати розділ про Syncthing та Secure Store ⏫ 📅 2026-09-28 #docs`;
      } else if (language === 'en') {
        responseText = `🎙️ **Audio recording transcribed via Groq Whisper:**
> *"Add a section on P2P synchronization with Syncthing and hardware keystore encryption to documentation."*

Agent executed:
1. Speech pause filtering and CommonMark formatting.
2. Appended to [[Inbox/Quick_Memos.md]].
3. Created task in daily notes:
- [ ] Add section on Syncthing and Secure Store ⏫ 📅 2026-09-28 #docs`;
      } else {
        responseText = `🎙️ **Аудиозапись успешно распознана через Groq Whisper:**
> *"Добавить в архитектурную документацию раздел про P2P синхронизацию через Syncthing и шифрование токенов в Secure Store."*

Агент выполнил:
1. Очистку от речевых пауз и форматирование в CommonMark.
2. Запись в [[Inbox/Quick_Memos.md]].
3. Создание задачи в ежедневнике:
- [ ] Добавить раздел про Syncthing и Secure Store ⏫ 📅 2026-09-28 #docs`;
      }

    } else if (lower.includes('ocr') || lower.includes('фото') || lower.includes('документ') || lower.includes('scan') || attachments?.some(a => a.type === 'image')) {
      setCurrentAgentAction(language === 'uk' ? 'OCR розпізнавання: ML Kit Text Recognition...' : language === 'en' ? 'ML Kit Text Recognition / Vision...' : 'OCR распознавание: ML Kit Text Recognition...');
      await new Promise((res) => setTimeout(res, 800));

      toolCalls.push({
        id: `tc_${Date.now()}_ocr`,
        name: 'mlkit_ocr_extract',
        parameters: { engine: 'ML Kit On-Device', confidence: '0.98' },
        result: language === 'uk'
          ? 'Вилучено текст технічної накладної: "Серверне обладнання Mini-PC Intel N100 16GB RAM 512GB NVMe, сума 18,400 UAH"'
          : language === 'en'
          ? 'Extracted text from invoice: "Server hardware Mini-PC Intel N100 16GB RAM 512GB NVMe, total 18,400 UAH"'
          : 'Извлечен текст технической накладной: "Серверное оборудование Mini-PC Intel N100 16GB RAM 512GB NVMe, сумма 18,400 UAH"',
        status: 'completed',
        timestamp: new Date().toLocaleTimeString()
      });

      if (language === 'uk') {
        responseText = `📄 **OCR-сканування успішно завершено (ML Kit / Vision API):**

\`\`\`markdown
---
type: ocr-scan
device: Mini-PC-Intel-N100
vendor: Intel
category: hardware-invoice
---
# Обладнання домашнього сервера
- Пристрій: Mini-PC Intel N100, 16GB DDR5, 512GB NVMe
- Призначення: Headless Obsidian + Docker + Caddy + Syncthing
\`\`\`

Збережено у [[Inbox/Quick_Memos.md]] з відповідним YAML frontmatter.`;
      } else if (language === 'en') {
        responseText = `📄 **Document OCR scan completed (ML Kit / Vision API):**

\`\`\`markdown
---
type: ocr-scan
device: Mini-PC-Intel-N100
vendor: Intel
category: hardware-invoice
---
# Home Server Hardware
- Device: Mini-PC Intel N100, 16GB DDR5, 512GB NVMe
- Purpose: Headless Obsidian + Docker + Caddy + Syncthing
\`\`\`

Saved to [[Inbox/Quick_Memos.md]] with structured YAML frontmatter.`;
      } else {
        responseText = `📄 **OCR-сканирование успешно завершено (ML Kit / Vision API):**

\`\`\`markdown
---
type: ocr-scan
device: Mini-PC-Intel-N100
vendor: Intel
category: hardware-invoice
---
# Оборудование домашнего сервера
- Устройство: Mini-PC Intel N100, 16GB DDR5, 512GB NVMe
- Назначение: Headless Obsidian + Docker + Caddy + Syncthing
\`\`\`

Сохранено в [[Inbox/Quick_Memos.md]] с соответствующим YAML frontmatter.`;
      }

    } else {
      // General question
      setCurrentAgentAction(language === 'uk' ? 'Синтез відповіді AI-агента...' : language === 'en' ? 'Synthesizing response...' : 'Синтез ответа AI-агента...');
      await new Promise((res) => setTimeout(res, 600));

      if (language === 'uk') {
        responseText = `Я опрацював запит і перевірив зв'язки у сховищі Obsidian. 

Поточний статус середовища:
- **Obsidian Local REST API:** \`:27124\` доступний через TLS-проксі Caddy
- **Сховище Vault:** 4 активних файли, остання зміна в [[Daily/2026-09-28.md]]
- **BYOK-провайдери:** Groq Whisper (STT), Gemini Vision / OpenAI

Якщо потрібно скласти план на день, просто натисніть кнопку нижче або напишіть *"Сплануй завдання на день"*!`;
      } else if (language === 'en') {
        responseText = `I processed your request and verified notes in your Obsidian Vault. 

Current Environment Status:
- **Obsidian Local REST API:** \`:27124\` reachable via Caddy TLS proxy
- **Vault Storage:** 4 active files, last modified in [[Daily/2026-09-28.md]]
- **BYOK Providers:** Groq Whisper (STT), Gemini Vision / OpenAI

If you want to plan your day, simply click the prompt below or type *"Plan daily schedule"*!`;
      } else {
        responseText = `Я обработал твой запрос и проверил связи в хранилище Obsidian. 

Текущий статус окружения:
- **Obsidian Local REST API:** \`:27124\` доступен через TLS-прокси Caddy
- **Хранилище Vault:** 4 активных файла, последнее изменение в [[Daily/2026-09-28.md]]
- **BYOK-провайдеры:** Groq Whisper (STT), Gemini Vision / OpenAI

Если тебе нужно составить план на день, просто нажми кнопку ниже или напиши *"Спланируй задачи на день"*!`;
      }
    }

    setCurrentAgentAction(null);
    setIsAgentTyping(false);

    const assistantMsg: ChatMessage = {
      id: `ast_${Date.now()}`,
      role: 'assistant',
      content: responseText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      toolCalls
    };

    setSessions((prev) =>
      prev.map((s) => (s.id === activeSessionId ? { ...s, messages: [...s.messages, assistantMsg] } : s))
    );
  };

  return (
    <AppContext.Provider
      value={{
        route,
        setRoute,
        isAuthenticated,
        isAuthModalOpen,
        setIsAuthModalOpen,
        login,
        bypassAuth,
        logout,
        sessions,
        activeSessionId,
        activeSession,
        createNewChat,
        selectChat,
        deleteChat,
        sendMessage,
        isAgentTyping,
        currentAgentAction,
        notes,
        selectedNotePath,
        openNote,
        closeNote,
        toggleTaskStatus,
        saveNote,
        sqliteJobs,
        retryJob,
        clearCompletedJobs,
        settings,
        updateSettings,
        toggleOfflineMode,
        isSidebarOpen,
        toggleSidebar,
        setIsSidebarOpen,
        toasts,
        showToast,
        removeToast,
        multimodalModal,
        setMultimodalModal,
        theme,
        setTheme,
        language,
        setLanguage,
        t
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
