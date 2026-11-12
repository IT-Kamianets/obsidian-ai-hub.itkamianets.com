import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useApp } from '../context/AppContext';

export const LandingPage: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    bypassAuth, 
    setRoute, 
    theme, 
    setTheme,
    language,
    setLanguage,
    t
  } = useApp();

  // Language Dropdown state
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  // Click outside for language dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Navigation & Snapping state
  const [activeSection, setActiveSection] = useState<string>('home');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [playgroundTab, setPlaygroundTab] = useState<'agent' | 'tasks' | 'queue' | 'api'>('agent');
  
  // Auth state
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');
  const [vaultEndpoint, setVaultEndpoint] = useState('https://vault.internal.local:27124');
  const [apiKey, setApiKey] = useState('secret_token_live_27124');

  // Playground simulation states
  const [agentStatus, setAgentStatus] = useState<string>('Idle');
  const [agentOutput, setAgentOutput] = useState<React.ReactNode[]>([]);
  const [customPrompt, setCustomPrompt] = useState("Plan daily tasks from yesterday's recap");
  const [taskStates, setTaskStates] = useState([
    { id: 'task1', text: 'Refactor Landing Navbar to strict Hugging Face monochrome style', completed: false, priority: 'High', due: '2026-11-10', tag: '#design' },
    { id: 'task2', text: 'Verify Caddy reverse proxy TLS on port :27124', completed: true, priority: 'Medium', due: '2026-11-10', tag: '#infra' },
    { id: 'task3', text: 'Test Tauri v2 desktop build size (≤ 15 MB) on Windows', completed: false, priority: 'Low', due: '2026-11-10', tag: '#tauri' },
  ]);
  const [queueJobs, setQueueJobs] = useState([
    { id: 'job_84920a', stage: 'READY_FOR_VAULT', action: 'UPDATE_TASK', target: 'Daily/2026-11-10.md', status: '✓ Completed', retries: 0 },
    { id: 'job_73199b', stage: 'RAW_EXTRACT', action: 'VOICE_MEMO', target: 'Inbox/Quick_Memos.md', status: '✓ Completed', retries: 0 }
  ]);
  const [lastSyncMsg, setLastSyncMsg] = useState('Ready to sync');
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // IntersectionObserver for Section Dots
  useEffect(() => {
    const sectionElements = document.querySelectorAll('.snap-section');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          if (id) setActiveSection(id);
        }
      });
    }, { rootMargin: '-30% 0px -40% 0px', threshold: 0.1 });

    sectionElements.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text.trim()).then(() => {
      setCopyFeedback(label);
      setTimeout(() => setCopyFeedback(null), 2500);
    });
  };

  const handleToggleTask = (index: number) => {
    setTaskStates(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], completed: !updated[index].completed };
      const statusText = updated[index].completed ? 'true' : 'false';
      setLastSyncMsg(`Synced: update_task_status("${updated[index].id}", is_completed: ${statusText})`);
      
      // Prepend to SQLite queue
      const randomJob = 'job_' + Math.random().toString(36).substring(2, 8);
      setQueueJobs(q => [
        { id: randomJob, stage: 'READY_FOR_VAULT', action: 'UPDATE_TASK', target: 'Daily/2026-11-10.md', status: '✓ Completed', retries: 0 },
        ...q
      ]);
      return updated;
    });
  };

  const runScenario = (type: 'daily' | 'voice' | 'search' | 'custom') => {
    setAgentStatus('Thinking & Querying...');
    const promptText = type === 'daily' 
      ? 'Plan daily tasks from yesterday' 
      : type === 'voice' 
        ? 'Transcribe audio memo' 
        : type === 'search' 
          ? 'Search architecture' 
          : customPrompt;

    setAgentOutput([
      <div key="init" className="text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-zinc-950 dark:bg-zinc-100 animate-ping"></span>
        <span>[1/3] Prompt Received: "{promptText}"</span>
      </div>
    ]);

    setTimeout(() => {
      if (type === 'daily' || type === 'custom') {
        setAgentOutput(prev => [
          ...prev,
          <div key="tools" className="p-3 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1.5 text-zinc-800 dark:text-zinc-300">
            <div className="text-zinc-950 dark:text-zinc-100 font-semibold text-[11px] flex items-center justify-between">
              <span>[Tools Executed]: read_note, manage_daily_plan</span>
              <span className="text-zinc-600 dark:text-zinc-400 font-mono">✓ HTTP 200 OK</span>
            </div>
            <div className="text-zinc-500 text-[10px]">GET /vault/Daily/2026-11-09.md (read 4 open tasks)</div>
            <div className="text-zinc-500 text-[10px]">POST /periodic/daily/ (manage_daily_plan with priority ranking)</div>
          </div>,
          <div key="res" className="p-3 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-1 text-zinc-900 dark:text-zinc-200 shadow-xs">
            <div className="font-bold text-zinc-950 dark:text-zinc-50">## Daily Plan for [[Daily/2026-11-10.md]]</div>
            <div>- [ ] Refactor Landing Navbar to strict Hugging Face monochrome style ▲ [due: 2026-11-10] #design</div>
            <div>- [x] Verify Caddy reverse proxy TLS on port :27124 ■ [due: 2026-11-10] #infra</div>
            <div>- [ ] Test Tauri v2 desktop build size (≤ 15 MB) on Windows ▼ [due: 2026-11-10] #tauri</div>
            <div className="text-zinc-500 text-[11px] mt-2">&gt; Context linked from [[Projects/Architecture.md]]</div>
          </div>
        ]);
      } else if (type === 'voice') {
        setAgentOutput(prev => [
          ...prev,
          <div key="whisper" className="p-3 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1 text-zinc-800 dark:text-zinc-300">
            <div className="text-zinc-950 dark:text-zinc-100 font-semibold text-[11px]">[Inference: Groq Whisper Large-v3] (642ms)</div>
            <div className="text-zinc-500 text-[10px]">Transcribed text: "Verify that Tauri v2 Windows Credential Manager encrypts the API token properly."</div>
          </div>,
          <div key="append" className="p-3 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-200 shadow-xs">
            <div className="text-zinc-950 dark:text-zinc-50 font-bold">Appended to [[Inbox/Quick_Memos.md]]:</div>
            <div className="mt-1 font-mono text-[11px]">- **[22:25] Voice Memo:** Verify that Tauri v2 Windows Credential Manager encrypts the API token properly. #voice #security</div>
          </div>
        ]);
      } else {
        setAgentOutput(prev => [
          ...prev,
          <div key="search" className="p-3 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1 text-zinc-800 dark:text-zinc-300">
            <div className="text-zinc-950 dark:text-zinc-100 font-semibold text-[11px]">[Tool: search_vault(query: "REST Hub :27124")]</div>
            <div className="text-zinc-500 text-[10px]">Matched 3 files: SPECIFICATION.md, PROJECT_CONTEXT.md, docker-compose.yml</div>
          </div>,
          <div key="react" className="p-3 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-200 shadow-xs">
            <div className="font-bold text-zinc-950 dark:text-zinc-50">ReAct Context Synthesis:</div>
            <p className="text-zinc-700 dark:text-zinc-300 text-xs mt-1">Obsidian Local REST API listens on port <code className="text-zinc-900 dark:text-zinc-100 font-mono">:27124</code> inside the <code className="text-zinc-900 dark:text-zinc-100 font-mono">linuxserver/obsidian</code> container. Caddy reverse proxies port 443 with TLS certificates to prevent CORS and mixed-content restrictions.</p>
          </div>
        ]);
      }
      setAgentStatus('Completed (200 OK)');
    }, 600);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthModalOpen(false);
    setRoute('/chat');
  };

  const dockerComposeYaml = `version: "3.8"
services:
  obsidian-server:
    image: lscr.io/linuxserver/obsidian:latest
    container_name: obsidian-server
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Europe/Kyiv
    volumes:
      - ./config:/config
      - /srv/obsidian/vault:/vaults/MainVault
    expose:
      - "27124"
    restart: unless-stopped

  vault-caddy:
    image: caddy:alpine
    ports:
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
    restart: unless-stopped`;

  const curlSnippet = `# 1. Health check & Ping
curl -k -H "Authorization: Bearer $OBSIDIAN_API_KEY" \\
  https://vault.internal.local/

# 2. Append quick note to Vault
curl -k -X POST -H "Authorization: Bearer $OBSIDIAN_API_KEY" \\
  -H "Content-Type: text/markdown" \\
  --data "- [ ] Voice note transcribed via Groq [due: 2026-11-10]" \\
  https://vault.internal.local/vault/Inbox/Quick_Memos.md

# 3. Simple Search across Notes
curl -k -X POST -H "Authorization: Bearer $OBSIDIAN_API_KEY" \\
  https://vault.internal.local/search/simple?query=Architecture`;

  // Explore Hub 9 Cards Data (Localized RU / UK / EN)
  const exploreCards = useMemo(() => {
    if (language === 'uk') {
      return [
        {
          id: 'react-planner',
          title: 'obsidian/react-daily-planner',
          subtitle: 'Виклик інструментів • ReAct цикл',
          version: 'v3.2',
          desc: "Автономний агент, що аналізує невиконані завдання за вчорашній день (- [ ] ... [due: date]) та формує щоденний розклад із розстановкою пріоритетів (Високий / Середній / Низький).",
          tags: ['#manage_daily_plan', '#read_note', 'Плагін Tasks'],
          category: 'tasks'
        },
        {
          id: 'groq-whisper',
          title: 'groq/whisper-large-v3-stt',
          subtitle: 'Голос у текст • Менше 1 секунди',
          version: 'Groq BYOK',
          desc: 'Надшвидкий пайплайн голосових заміток. Записує 16 кГц аудіо, виконує розпізнавання через Whisper STT, буферизує в SQLite при офлайні та дописує в Quick_Memos.md.',
          tags: ['#append_to_note', 'RAW_EXTRACT', '< 850мс затримка'],
          category: 'recognition'
        },
        {
          id: 'vision-ocr',
          title: 'vision/mlkit-document-ocr',
          subtitle: 'Зйомка камерою • Локальний OCR',
          version: 'Vision Core',
          desc: 'Вилучення структурованого тексту з фізичних книг, чеків та конспектів. Генерує готові Markdown-замітки з автоматичним YAML Frontmatter та властивостями.',
          tags: ['#create_note', 'YAML парсер', 'Capacitor Camera'],
          category: 'recognition'
        },
        {
          id: 'server-hub',
          title: 'server/obsidian-rest-api-hub',
          subtitle: 'Headless 24/7 • Порт :27124',
          version: 'Docker',
          desc: 'Цілодобовий серверний linuxserver/obsidian у Docker з віртуальним дисплеєм Xvfb. Надає Local REST API на порту 27124 за реверс-проксі Caddy з валідним TLS.',
          tags: ['Порт :27124', 'Caddy TLS', 'Tailscale VPN'],
          category: 'infra'
        },
        {
          id: 'interactive-tasks',
          title: 'spaces/interactive-tasks-matrix',
          subtitle: 'Двостороння синхронізація • Tasks синтаксис',
          version: 'Interactive',
          desc: 'Миттєва синхронізація чекбоксів інтерфейсу з реальними .md файлами. Клік перемикає статус з - [ ] на - [x] та зберігає через update_task_status.',
          tags: ['update_task_status', 'Бейджі пріоритетів', 'Закреслення'],
          category: 'tasks'
        },
        {
          id: 'sqlite-queue',
          title: 'engine/sqlite-offline-queue',
          subtitle: 'sync_job_queue • Локальна надійність',
          version: 'Resilience',
          desc: 'Двостадійний воркер надійності в SQLite. Буферизує нерозпізнане сире аудіо та скани (RAW_EXTRACT) і очікуючі правки заміток (READY_FOR_VAULT) при відключенні сервера.',
          tags: ['RAW_EXTRACT', 'READY_FOR_VAULT', 'Кількість повторів'],
          category: 'infra'
        },
        {
          id: 'search-vault',
          title: 'tools/search_vault',
          subtitle: 'Інструмент агента • POST /search/simple',
          version: 'Tool Spec',
          desc: 'Стандартизований інструмент ReAct для пошуку за ключовими словами та повним текстом сховища. Приймає query: string і повертає знайдені замітки зі сніпетами.',
          tags: ['JSON Schema', 'Повнотекстовий пошук', 'Вікно контексту'],
          category: 'text'
        },
        {
          id: 'periodic-suite',
          title: 'vaults/periodic-daily-suite',
          subtitle: 'Шаблони • /periodic/daily/',
          version: 'Dataview',
          desc: 'Готові шаблони для періодичних заміток з таблицями завдань Dataview, трекерами звичок та щоденними ретроспективами для автоматичного AI-аналізу.',
          tags: ['Щоденні замітки', 'DataviewJS', 'YAML теги'],
          category: 'text'
        },
        {
          id: 'syncthing-node',
          title: 'spaces/syncthing-workstation-node',
          subtitle: 'P2P Mesh • Ізоляція .stignore',
          version: 'Mesh P2P',
          desc: 'Конфігурація P2P-синхронізації. Підтримує серверне сховище і робочий ПК синхронними по TCP/22000, виключаючи workspace.json для запобігання блокуванню інтерфейсу.',
          tags: ['.stignore', 'Без хмари', 'Zero Cloud'],
          category: 'infra'
        }
      ];
    }

    if (language === 'ru') {
      return [
        {
          id: 'react-planner',
          title: 'obsidian/react-daily-planner',
          subtitle: 'Вызов инструментов • ReAct цикл',
          version: 'v3.2',
          desc: "Автономный агент, анализирующий невыполненные задачи за вчерашний день (- [ ] ... [due: date]) и формирующий ежедневный план с расстановкой приоритетов (Высокий / Средний / Низкий).",
          tags: ['#manage_daily_plan', '#read_note', 'Плагин Tasks'],
          category: 'tasks'
        },
        {
          id: 'groq-whisper',
          title: 'groq/whisper-large-v3-stt',
          subtitle: 'Голос в текст • Менее 1 секунды',
          version: 'Groq BYOK',
          desc: 'Сверхбыстрый пайплайн голосовых заметок. Записывает 16 кГц аудио, выполняет распознавание через Whisper STT, буферизует в SQLite при офлайне и дописывает в Quick_Memos.md.',
          tags: ['#append_to_note', 'RAW_EXTRACT', '< 850мс задержка'],
          category: 'recognition'
        },
        {
          id: 'vision-ocr',
          title: 'vision/mlkit-document-ocr',
          subtitle: 'Съемка камерой • Локальный OCR',
          version: 'Vision Core',
          desc: 'Извлечение структурированного текста из физических книг, чеков и конспектов. Генерирует готовые Markdown-заметки с автоматическим YAML Frontmatter и свойствами.',
          tags: ['#create_note', 'YAML парсер', 'Capacitor Camera'],
          category: 'recognition'
        },
        {
          id: 'server-hub',
          title: 'server/obsidian-rest-api-hub',
          subtitle: 'Headless 24/7 • Порт :27124',
          version: 'Docker',
          desc: 'Круглосуточный серверный linuxserver/obsidian в Docker с виртуальным дисплеем Xvfb. Предоставляет Local REST API на порту 27124 за реверс-прокси Caddy с валидным TLS.',
          tags: ['Порт :27124', 'Caddy TLS', 'Tailscale VPN'],
          category: 'infra'
        },
        {
          id: 'interactive-tasks',
          title: 'spaces/interactive-tasks-matrix',
          subtitle: 'Двусторонняя синхронизация • Синтаксис Tasks',
          version: 'Interactive',
          desc: 'Мгновенная синхронизация чекбоксов интерфейса с реальными .md файлами. Клик переключает статус с - [ ] на - [x] и сохраняет изменение через update_task_status.',
          tags: ['update_task_status', 'Бейджи приоритетов', 'Зачеркивание'],
          category: 'tasks'
        },
        {
          id: 'sqlite-queue',
          title: 'engine/sqlite-offline-queue',
          subtitle: 'sync_job_queue • Локальная надежность',
          version: 'Resilience',
          desc: 'Двухстадийный воркер надежности в SQLite. Буферизует нераспознанное сырое аудио и сканы (RAW_EXTRACT) и ожидающие правки заметок (READY_FOR_VAULT) при отключении сервера.',
          tags: ['RAW_EXTRACT', 'READY_FOR_VAULT', 'Счетчик повторов'],
          category: 'infra'
        },
        {
          id: 'search-vault',
          title: 'tools/search_vault',
          subtitle: 'Инструмент агента • POST /search/simple',
          version: 'Tool Spec',
          desc: 'Стандартизированный инструмент ReAct для поиска по ключевым словам и полному тексту хранилища. Принимает query: string и возвращает найденные заметки со сниппетами.',
          tags: ['JSON Schema', 'Полнотекстовый поиск', 'Окно контекста'],
          category: 'text'
        },
        {
          id: 'periodic-suite',
          title: 'vaults/periodic-daily-suite',
          subtitle: 'Шаблоны • /periodic/daily/',
          version: 'Dataview',
          desc: 'Готовые шаблоны для периодических заметок с таблицами задач Dataview, трекерами привычек и ежедневными ретроспективами для автоматического AI-анализа.',
          tags: ['Ежедневные заметки', 'DataviewJS', 'YAML разметка'],
          category: 'text'
        },
        {
          id: 'syncthing-node',
          title: 'spaces/syncthing-workstation-node',
          subtitle: 'P2P Mesh • Изоляция .stignore',
          version: 'Mesh P2P',
          desc: 'Конфигурация децентрализованной P2P-синхронизации. Поддерживает серверное хранилище и рабочий ПК синхронными по TCP/22000, исключая workspace.json во избежание конфликтов.',
          tags: ['.stignore', 'Без облака', 'Zero Cloud'],
          category: 'infra'
        }
      ];
    }

    // Default: English
    return [
      {
        id: 'react-planner',
        title: 'obsidian/react-daily-planner',
        subtitle: 'Tool Calling • ReAct Cycle',
        version: 'v3.2',
        desc: "Autonomous agent that reads yesterday's uncompleted Tasks, parses - [ ] ... [due: date], and generates today's schedule with priority ranking (High / Med / Low).",
        tags: ['#manage_daily_plan', '#read_note', 'Tasks Plugin'],
        category: 'tasks'
      },
      {
        id: 'groq-whisper',
        title: 'groq/whisper-large-v3-stt',
        subtitle: 'Speech-to-Text • Sub-second',
        version: 'Groq BYOK',
        desc: 'Ultra-fast voice memo ingestion pipeline. Records 16 kHz audio, runs Whisper STT, buffers in SQLite RAW_EXTRACT if offline, and appends into Quick_Memos.md.',
        tags: ['#append_to_note', 'RAW_EXTRACT', '< 850ms latency'],
        category: 'recognition'
      },
      {
        id: 'vision-ocr',
        title: 'vision/mlkit-document-ocr',
        subtitle: 'Camera Capture • On-Device OCR',
        version: 'Vision Core',
        desc: 'Extracts structured text from physical books, invoices, and lecture handouts. Synthesizes complete Markdown notes with automatic YAML Frontmatter properties.',
        tags: ['#create_note', 'YAML Parser', 'Capacitor Camera'],
        category: 'recognition'
      },
      {
        id: 'server-hub',
        title: 'server/obsidian-rest-api-hub',
        subtitle: 'Headless 24/7 • Port :27124',
        version: 'Docker',
        desc: 'Headless linuxserver/obsidian running with Xvfb virtual display. Exposes Local REST API at port 27124 behind a Caddy reverse proxy with valid TLS.',
        tags: ['Port :27124', 'Caddy TLS', 'Tailscale VPN'],
        category: 'infra'
      },
      {
        id: 'interactive-tasks',
        title: 'spaces/interactive-tasks-matrix',
        subtitle: 'Two-Way Status • Tasks Syntax',
        version: 'Interactive',
        desc: 'Real-time synchronization between UI checkboxes and physical Markdown files. Clicking toggles - [ ] to - [x] and persists via update_task_status.',
        tags: ['update_task_status', 'Priority Badges', 'Strikethrough'],
        category: 'tasks'
      },
      {
        id: 'sqlite-queue',
        title: 'engine/sqlite-offline-queue',
        subtitle: 'sync_job_queue • Local-First',
        version: 'Resilience',
        desc: 'Two-stage SQLite persistence worker. Buffers unextracted raw audio & images (RAW_EXTRACT) and pending Markdown mutations (READY_FOR_VAULT) during server downtime.',
        tags: ['RAW_EXTRACT', 'READY_FOR_VAULT', 'Retry Count'],
        category: 'infra'
      },
      {
        id: 'search-vault',
        title: 'tools/search_vault',
        subtitle: 'Agent Tool • POST /search/simple',
        version: 'Tool Spec',
        desc: 'Standardized ReAct tool for keyword and full-text context retrieval. Takes query: string, returns matched filenames and excerpt snippets for LLM synthesis.',
        tags: ['JSON Schema', 'Full-Text', 'Context Window'],
        category: 'text'
      },
      {
        id: 'periodic-suite',
        title: 'vaults/periodic-daily-suite',
        subtitle: 'Template • /periodic/daily/',
        version: 'Dataview',
        desc: 'Pre-configured templates for Periodic Notes with Dataview task tables, habit track loops, and daily retrospective prompts for automated AI summarization.',
        tags: ['Daily Notes', 'DataviewJS', 'YAML Tagging'],
        category: 'text'
      },
      {
        id: 'syncthing-node',
        title: 'spaces/syncthing-workstation-node',
        subtitle: 'P2P File Mesh • .stignore Cache',
        version: 'Mesh P2P',
        desc: 'Decoupled workstation sync configuration. Keeps server vault and desktop workstation in sync over TCP/22000, ignoring workspace.json to prevent UI locking.',
        tags: ['.stignore', 'Decoupled', 'Zero Cloud'],
        category: 'infra'
      }
    ];
  }, [language]);

  const filteredCards = activeFilter === 'all' 
    ? exploreCards 
    : exploreCards.filter(c => c.category === activeFilter);

  return (
    <div className="bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 min-h-screen font-sans antialiased selection:bg-zinc-900 selection:text-white dark:selection:bg-zinc-100 dark:selection:text-zinc-950 transition-colors duration-150 relative">

      {/* ==================== FLOATING SECTION SNAP NAVIGATION (DOTS INDICATOR) ==================== */}
      <aside className="fixed right-3 sm:right-5 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-2.5 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md py-3 px-2 rounded-full border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all">
        {[
          { id: 'home', label: language === 'ru' ? 'Главная' : language === 'uk' ? 'Головна' : 'Home' },
          { id: 'standards', label: language === 'ru' ? 'Преимущества' : language === 'uk' ? 'Переваги' : 'Advantages' },
          { id: 'explore', label: language === 'ru' ? 'Каталог' : language === 'uk' ? 'Каталог' : 'Explore Hub' },
          { id: 'playground', label: language === 'ru' ? 'Песочница' : language === 'uk' ? 'Пісочниця' : 'Playground' },
          { id: 'architecture', label: language === 'ru' ? 'Архитектура' : language === 'uk' ? 'Архітектура' : 'Architecture' },
          { id: 'footer', label: language === 'ru' ? 'Подвал' : language === 'uk' ? 'Підвал' : 'Footer' }
        ].map(dot => (
          <a 
            key={dot.id}
            href={`#${dot.id}`} 
            className="nav-dot group relative flex items-center justify-center p-1" 
            title={dot.label}
          >
            <span className={`dot-indicator rounded-full transition-all ${
              activeSection === dot.id 
                ? 'w-3 h-3 bg-zinc-950 dark:bg-zinc-100 ring-4 ring-zinc-300 dark:ring-zinc-700 scale-110' 
                : 'w-2 h-2 bg-zinc-400 dark:bg-zinc-600 group-hover:scale-125'
            }`}></span>
            <span className="absolute right-7 px-2 py-0.5 rounded text-[10px] font-mono whitespace-nowrap bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-sm">
              {dot.label}
            </span>
          </a>
        ))}
      </aside>

      {/* ==================== TOP NAVIGATION BAR (HUGGING FACE MONOCHROME) ==================== */}
      <header className="sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Brand Logo (High-Res Vector Geometric Logo) */}
          <div className="flex items-center gap-3 shrink-0">
            <a href="#home" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 shadow-sm border border-zinc-300 dark:border-zinc-800 group-hover:scale-105 transition-transform bg-zinc-950">
                <svg viewBox="0 0 512 512" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <rect x="8" y="8" width="496" height="496" rx="108" fill="#121316" stroke="#27272a" strokeWidth="4" />
                  <rect x="36" y="36" width="440" height="440" rx="92" fill="none" stroke="#f4f4f5" strokeWidth="8" strokeLinecap="round" />
                  <rect x="63" y="63" width="386" height="386" rx="78" fill="none" stroke="#f4f4f5" strokeWidth="8" strokeLinecap="round" />
                  <rect x="90" y="90" width="332" height="332" rx="64" fill="none" stroke="#f4f4f5" strokeWidth="8" strokeLinecap="round" />
                  <rect x="117" y="117" width="278" height="278" rx="50" fill="none" stroke="#f4f4f5" strokeWidth="8" strokeLinecap="round" />
                  <rect x="144" y="144" width="224" height="224" rx="36" fill="none" stroke="#f4f4f5" strokeWidth="8" strokeLinecap="round" />
                  <rect x="171" y="171" width="170" height="170" rx="24" fill="none" stroke="#f4f4f5" strokeWidth="8" strokeLinecap="round" />
                  <polygon points="256,36 476,256 256,476 36,256" fill="#121316" />
                  <polygon points="256,36 476,256 256,476 36,256" fill="none" stroke="#f4f4f5" strokeWidth="8" strokeLinecap="round" />
                  <polygon points="256,63 449,256 256,449 63,256" fill="none" stroke="#f4f4f5" strokeWidth="8" strokeLinecap="round" />
                  <polygon points="256,90 422,256 256,422 90,256" fill="none" stroke="#f4f4f5" strokeWidth="8" strokeLinecap="round" />
                  <polygon points="256,117 395,256 256,395 117,256" fill="none" stroke="#f4f4f5" strokeWidth="8" strokeLinecap="round" />
                  <polygon points="256,144 368,256 256,368 144,256" fill="none" stroke="#f4f4f5" strokeWidth="8" strokeLinecap="round" />
                  <polygon points="256,171 341,256 256,341 171,256" fill="none" stroke="#f4f4f5" strokeWidth="8" strokeLinecap="round" />
                  <polygon points="256,198 314,256 256,314 198,256" fill="none" stroke="#f4f4f5" strokeWidth="8" strokeLinecap="round" />
                  <polygon points="256,206 306,256 256,306 206,256" fill="#121316" />
                </svg>
              </div>
              <div className="flex items-center">
                <span className="font-bold tracking-tight text-lg text-zinc-900 dark:text-zinc-50">Obsidian Hub</span>
              </div>
            </a>
          </div>

          {/* Strict Vector Navigation Links with direct snap targets */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-400">
            <a href="#standards" className="px-2.5 py-1.5 rounded-md hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors flex items-center gap-1.5">
              <svg className="w-4 h-4 text-zinc-500 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              {t.nav_advantages}
            </a>
            <a href="#explore" className="px-2.5 py-1.5 rounded-md hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors flex items-center gap-1.5">
              <svg className="w-4 h-4 text-zinc-500 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
              {t.nav_explore}
            </a>
            <a href="#playground" className="px-2.5 py-1.5 rounded-md hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors flex items-center gap-1.5">
              <svg className="w-4 h-4 text-zinc-500 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              {t.nav_playground}
            </a>
            <a href="#architecture" className="px-2.5 py-1.5 rounded-md hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors flex items-center gap-1.5">
              <svg className="w-4 h-4 text-zinc-500 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"/></svg>
              {t.nav_architecture}
            </a>
          </nav>

          {/* Right Actions: Language Selector + Theme Toggle + Auth */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Language Switcher Dropdown (as requested in header) */}
            <div className="relative" ref={langMenuRef}>
              <button 
                type="button"
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} 
                title="Сменить язык / Change language"
                className="p-2 sm:px-2.5 sm:py-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 transition-colors flex items-center gap-1.5 text-xs font-mono shadow-2xs"
              >
                <span className="text-sm select-none">
                  {language === 'ru' ? '🇷🇺' : language === 'uk' ? '🇺🇦' : '🇬🇧'}
                </span>
                <span className="font-semibold uppercase">{language}</span>
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

            {/* Full White / Dark Theme Switcher Button */}
            <button 
              type="button"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
              title={theme === 'light' ? 'Переключить на темную тему' : 'Переключить на светлую тему'}
              className="p-2 sm:px-2.5 sm:py-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 transition-colors flex items-center gap-1.5 text-xs font-mono shadow-2xs"
            >
              {theme === 'light' ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
              )}
              <span className="hidden sm:inline font-mono">{theme === 'light' ? 'Light' : 'Dark'}</span>
            </button>

            {/* Log In (text) */}
            <button 
              type="button"
              onClick={() => {
                setAuthTab('login');
                setIsAuthModalOpen(true);
              }}
              className="text-xs sm:text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-zinc-50 px-2.5 py-1.5 transition-colors"
            >
              {t.login_btn}
            </button>

            {/* Sign Up (High Contrast Solid Pill) */}
            <button 
              type="button"
              onClick={() => {
                setAuthTab('signup');
                setIsAuthModalOpen(true);
              }}
              className="text-xs sm:text-sm font-semibold px-3.5 py-1.5 rounded-md bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-sm"
            >
              {t.auth_register_tab}
            </button>
          </div>

        </div>
      </header>

      {/* ==================== 1. HERO SECTION (SNAP SECTION #home) ==================== */}
      <section id="home" className="snap-section min-h-[calc(100vh-4rem)] flex flex-col justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pt-16 sm:pt-20 pb-8 bg-white dark:bg-zinc-950 relative overflow-hidden transition-colors">
        
        {/* Subtle technical grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 dark:opacity-30 pointer-events-none"></div>

        <div className="hidden sm:block"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center my-auto">
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 max-w-4xl leading-tight">
            {t.hero_title_1} {t.hero_title_2}
          </h1>

          <p className="mt-6 text-base sm:text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl font-normal leading-relaxed">
            {t.hero_subtitle}
          </p>

          <div className="mt-8 flex items-center justify-center gap-3">
            <button 
              type="button"
              onClick={() => setRoute('/chat')}
              className="px-6 py-3 rounded-lg bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 font-semibold text-sm hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all flex items-center gap-2 shadow-sm hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{t.hero_cta_playground}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </button>
            <a 
              href="#architecture"
              className="px-5 py-3 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 font-semibold text-sm transition-all"
            >
              {t.hero_cta_arch_spec}
            </a>
          </div>

        </div>

        {/* Animated Scroll Down Arrow to Section 2 (Advantages & Standards) */}
        <div className="relative z-10 pt-6 flex flex-col items-center">
          <a 
            href="#standards" 
            className="group flex flex-col items-center gap-2 text-zinc-400 hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-zinc-100 transition-colors cursor-pointer"
            aria-label="Scroll to advantages"
          >
            <span className="text-[11px] font-mono tracking-widest uppercase opacity-75 group-hover:opacity-100 transition-opacity">{t.nav_advantages}</span>
            <div className="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/80 backdrop-blur-sm flex items-center justify-center animate-bounce shadow-xs group-hover:border-zinc-400 dark:group-hover:border-zinc-600 transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
              </svg>
            </div>
          </a>
        </div>

      </section>

      {/* ==================== 2. ADVANTAGES & STANDARDS SECTION (SNAP SECTION #standards) ==================== */}
      <section id="standards" className="snap-section min-h-[calc(100vh-4rem)] flex flex-col justify-center border-b border-zinc-200 dark:border-zinc-800 py-16 bg-white dark:bg-zinc-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-500">
              {language === 'ru' ? 'Спецификации архитектуры и стандарты' : language === 'uk' ? 'Специфікації архітектури та стандарти' : 'Design Specifications & Core Pillars'}
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 mt-1">
              {language === 'ru' ? 'Строгие стандарты архитектуры' : language === 'uk' ? 'Суворі стандарти архітектури' : 'Strict Architectural Standards'}
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
              {language === 'ru' 
                ? 'Каждый компонент спроектирован для надежности, нулевой зависимости от облаков и нативной синергии с Obsidian.' 
                : language === 'uk' 
                  ? 'Кожен компонент спроектовано для надійності, нульової залежності від хмар та нативної синергії з Obsidian.' 
                  : 'Every component is engineered for reliability, zero cloud dependency, and native Obsidian plugin synergy.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 bg-zinc-50/50 dark:bg-zinc-900/30 flex flex-col justify-between shadow-xs">
              <div>
                <div className="w-8 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 flex items-center justify-center font-mono text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                  1
                </div>
                <h3 className="text-base font-bold text-zinc-950 dark:text-zinc-100">Zero Telemetry &amp; BYOK</h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                  {language === 'ru' 
                    ? 'API-ключи (Groq, OpenAI, Gemini) хранятся на устройстве в защищенном хранилище Keystore. Все запросы идут напрямую в эндпоинты моделей без внешнего логирования.' 
                    : language === 'uk' 
                      ? 'API-ключі (Groq, OpenAI, Gemini) зберігаються на пристрої у захищеному сховищі Keystore. Усі запити йдуть напряму в ендпоінти моделей без зовнішнього логування.' 
                      : 'API keys (Groq, OpenAI, Gemini) are stored on-device in hardware Android Keystore or Windows Credential Manager. All requests route directly to the model endpoints.'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800 text-[11px] font-mono text-zinc-500">
                ✓ Hardware-backed Keystore
              </div>
            </div>

            <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 bg-zinc-50/50 dark:bg-zinc-900/30 flex flex-col justify-between shadow-xs">
              <div>
                <div className="w-8 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 flex items-center justify-center font-mono text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                  2
                </div>
                <h3 className="text-base font-bold text-zinc-950 dark:text-zinc-100">
                  {language === 'ru' ? 'Двухстадийная офлайн-очередь' : language === 'uk' ? 'Двостадійна офлайн-черга' : 'Two-Stage Offline Queue'}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                  {language === 'ru' 
                    ? 'Ни одна заметка или аудиозапись не теряется при недоступности сервера. Сырые захваты буферизуются в RAW_EXTRACT, сгенерированные файлы — в READY_FOR_VAULT.' 
                    : language === 'uk' 
                      ? 'Жодна замітка чи аудіозапис не втрачається при недоступності сервера. Сирі захоплення буферизуються у RAW_EXTRACT, згенеровані файли — у READY_FOR_VAULT.' 
                      : 'No note or audio is lost during server maintenance. Unprocessed captures buffer in RAW_EXTRACT; generated files buffer in READY_FOR_VAULT.'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800 text-[11px] font-mono text-zinc-500">
                ✓ SQLite Fault-Tolerance (op-sqlite)
              </div>
            </div>

            <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 bg-zinc-50/50 dark:bg-zinc-900/30 flex flex-col justify-between shadow-xs">
              <div>
                <div className="w-8 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 flex items-center justify-center font-mono text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                  3
                </div>
                <h3 className="text-base font-bold text-zinc-950 dark:text-zinc-100">
                  {language === 'ru' ? 'Синергия с Obsidian Tasks' : language === 'uk' ? 'Синергія з Obsidian Tasks' : 'Obsidian Tasks Synergy'}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                  {language === 'ru' 
                    ? 'Полное соответствие стандартному синтаксису Tasks (- [ ] ... [due: date]). Мгновенные переключения чекбоксов отражаются в физических .md файлах.' 
                    : language === 'uk' 
                      ? 'Повна відповідність стандартному синтаксису Tasks (- [ ] ... [due: date]). Миттєві перемикання чекбоксів відображаються у фізичних .md файлах.' 
                      : 'Strict compliance with standard Tasks syntax (- [ ] ... [due: date]). Instant checkbox toggles reflect automatically in physical files.'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800 text-[11px] font-mono text-zinc-500">
                ✓ Bidirectional Note Mutation
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ==================== 3. EXPLORE SECTION (SNAP SECTION #explore) ==================== */}
      <section id="explore" className="snap-section min-h-[calc(100vh-4rem)] flex flex-col justify-start border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 transition-colors">
        
        {/* Filter Strip */}
        <div className="border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 overflow-x-auto py-3 no-scrollbar">
            <div className="flex items-center gap-1.5 shrink-0">
              {[
                { 
                  id: 'all', 
                  label: language === 'uk' ? 'Всі (9)' : language === 'en' ? 'All (9)' : 'Все (9)', 
                  icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' 
                },
                { 
                  id: 'text', 
                  label: language === 'uk' ? 'Текст і Замітки (2)' : language === 'en' ? 'Text & Notes (2)' : 'Текст и Заметки (2)', 
                  icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' 
                },
                { 
                  id: 'recognition', 
                  label: language === 'uk' ? 'Розпізнавання (2)' : language === 'en' ? 'Recognition (2)' : 'Распознавание (2)', 
                  icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z' 
                },
                { 
                  id: 'tasks', 
                  label: language === 'uk' ? 'Завдання та Планування (2)' : language === 'en' ? 'Tasks & Planning (2)' : 'Задачи и Планирование (2)', 
                  icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' 
                },
                { 
                  id: 'infra', 
                  label: language === 'uk' ? 'Сервер і Синхронізація (3)' : language === 'en' ? 'Server & Sync (3)' : 'Сервер и Синхронизация (3)', 
                  icon: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01' 
                }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFilter(tab.id)}
                  className={`tab-btn px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    activeFilter === tab.id
                      ? 'bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon}/></svg>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Cards Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col justify-center">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
                {language === 'ru' 
                  ? 'Каталог репозиториев и сценариев хаба' 
                  : language === 'uk' 
                    ? 'Каталог репозиторіїв та сценаріїв хабу' 
                    : 'Explore Hub Repositories & Workflows'}
              </h2>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                {language === 'ru' 
                  ? 'Инструменты, агенты автоматизации и готовые пайплайны для Obsidian Local REST API' 
                  : language === 'uk' 
                    ? 'Інструменти, агенти автоматизації та готові пайплайни для Obsidian Local REST API' 
                    : 'Structured tools, automation engines, and pipelines ready for Obsidian Local REST API'}
              </p>
            </div>
            <div className="text-xs font-mono text-zinc-500">
              {language === 'ru' ? (
                <>Показано: <span className="text-zinc-900 dark:text-zinc-200 font-bold">{filteredCards.length}</span> компонентов</>
              ) : language === 'uk' ? (
                <>Показано: <span className="text-zinc-900 dark:text-zinc-200 font-bold">{filteredCards.length}</span> компонентів</>
              ) : (
                <>Showing <span className="text-zinc-900 dark:text-zinc-200 font-bold">{filteredCards.length}</span> items</>
              )}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCards.map(card => (
              <div 
                key={card.id}
                className="resource-card group border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 bg-white dark:bg-zinc-900/30 rounded-xl p-5 flex flex-col justify-between transition-all duration-150 hover:shadow-sm hover:bg-zinc-50/50 dark:hover:bg-zinc-900/60"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-900 dark:text-zinc-200 shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/></svg>
                      </div>
                      <div>
                        <a href="#playground" className="font-mono text-sm font-semibold text-zinc-950 dark:text-zinc-100 group-hover:underline">
                          {card.title}
                        </a>
                        <span className="block text-[11px] text-zinc-500 font-mono">{card.subtitle}</span>
                      </div>
                    </div>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-700 dark:text-zinc-400">
                      {card.version}
                    </span>
                  </div>

                  <p className="mt-3.5 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {card.tags.map((tag, i) => (
                    <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-400">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 4. PLAYGROUND SECTION (SNAP SECTION #playground) ==================== */}
      <section id="playground" className="snap-section min-h-[calc(100vh-4rem)] flex flex-col justify-center border-t border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 py-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 mb-2">
                <span>{language === 'ru' ? 'ИНТЕРАКТИВНОЕ ОКРУЖЕНИЕ' : language === 'uk' ? 'ІНТЕРАКТИВНЕ ОТОЧЕННЯ' : 'LIVE INTERACTIVE ENVIRONMENT'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
                {language === 'ru' ? 'Песочница Obsidian ReAct Hub' : language === 'uk' ? 'Пісочниця Obsidian ReAct Hub' : 'Obsidian ReAct Hub Playground'}
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                {language === 'ru' 
                  ? 'Симуляция вызова инструментов агента, изменения статусов Obsidian Tasks и работы офлайн-очереди.' 
                  : language === 'uk' 
                    ? 'Симуляція виклику інструментів агента, зміни статусів Obsidian Tasks та роботи офлайн-черги.' 
                    : 'Simulate live tool executions, Obsidian Tasks status mutations, and offline queue behavior.'}
              </p>
            </div>
            
            <div className="flex rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-1 font-mono text-xs shadow-xs">
              {[
                { id: 'agent', label: language === 'ru' ? 'ReAct Агент' : language === 'uk' ? 'ReAct Агент' : 'ReAct Agent' },
                { id: 'tasks', label: language === 'ru' ? 'Интерактивные задачи' : language === 'uk' ? 'Інтерактивні завдання' : 'Interactive Tasks' },
                { id: 'queue', label: language === 'ru' ? 'Очередь SQLite' : language === 'uk' ? 'Черга SQLite' : 'SQLite Queue' },
                { id: 'api', label: 'cURL API :27124' }
              ].map(t => (
                <button 
                  key={t.id}
                  type="button"
                  onClick={() => setPlaygroundTab(t.id as any)} 
                  className={`px-3 py-1.5 rounded-md transition-all font-mono ${
                    playgroundTab === t.id 
                      ? 'bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 font-semibold shadow-xs' 
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/60 overflow-hidden shadow-xl dark:shadow-2xl transition-colors">
            
            {/* Window Top Bar */}
            <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100/80 dark:bg-zinc-950/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-800 border border-zinc-400 dark:border-zinc-700"></span>
                <span className="w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-800 border border-zinc-400 dark:border-zinc-700"></span>
                <span className="w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-800 border border-zinc-400 dark:border-zinc-700"></span>
                <span className="ml-2 text-xs font-mono text-zinc-600 dark:text-zinc-400">
                  {playgroundTab === 'agent' && (language === 'ru' ? 'сессия_агента_активна • Цикл выполнения ReAct' : language === 'uk' ? 'сесія_агента_активна • Цикл виконання ReAct' : 'agent_session_active • ReAct Execution Loop')}
                  {playgroundTab === 'tasks' && 'note_inspector • Daily/2026-11-10.md'}
                  {playgroundTab === 'queue' && 'sqlite_daemon • sync_job_queue (op-sqlite)'}
                  {playgroundTab === 'api' && 'rest_client • HTTPS Local REST API :27124'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500">
                <span className="w-2 h-2 rounded-full bg-zinc-900 dark:bg-zinc-100"></span>
                <span>{language === 'ru' ? 'REST API Hub: Подключен (14мс)' : language === 'uk' ? 'REST API Hub: Підключено (14мс)' : 'REST API Hub: Connected (14ms)'}</span>
              </div>
            </div>

            {/* TAB 1: ReAct Agent */}
            {playgroundTab === 'agent' && (
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1 space-y-4">
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      {language === 'ru' ? 'Готовые сценарии агента' : language === 'uk' ? 'Готові сценарії агента' : 'Pre-set Agent Scenarios'}
                    </label>
                    <div className="space-y-2">
                      <button 
                        type="button"
                        onClick={() => runScenario('daily')} 
                        className="w-full text-left p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
                      >
                        <div className="text-xs font-semibold text-zinc-950 dark:text-zinc-100 flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                          <span>{language === 'ru' ? 'Спланировать задачи на день' : language === 'uk' ? 'Спланувати завдання на день' : "Plan Today's Tasks"}</span>
                        </div>
                        <div className="text-[11px] text-zinc-500 font-mono mt-0.5">manage_daily_plan &amp; read_note</div>
                      </button>

                      <button 
                        type="button"
                        onClick={() => runScenario('voice')} 
                        className="w-full text-left p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
                      >
                        <div className="text-xs font-semibold text-zinc-950 dark:text-zinc-100 flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
                          <span>{language === 'ru' ? 'Голосовая заметка (Groq STT)' : language === 'uk' ? 'Голосова замітка (Groq STT)' : 'Groq Whisper Voice Memo'}</span>
                        </div>
                        <div className="text-[11px] text-zinc-500 font-mono mt-0.5">append_to_note → Quick_Memos.md</div>
                      </button>

                      <button 
                        type="button"
                        onClick={() => runScenario('search')} 
                        className="w-full text-left p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
                      >
                        <div className="text-xs font-semibold text-zinc-950 dark:text-zinc-100 flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                          <span>{language === 'ru' ? 'Поиск по архитектуре' : language === 'uk' ? 'Пошук по архітектурі' : 'Search Architecture Spec'}</span>
                        </div>
                        <div className="text-[11px] text-zinc-500 font-mono mt-0.5">search_vault("REST Hub :27124")</div>
                      </button>
                    </div>

                    <div className="pt-2">
                      <label className="block text-xs font-mono text-zinc-500 dark:text-zinc-400 mb-1.5">
                        {language === 'ru' ? 'Пользовательский запрос' : language === 'uk' ? 'Користувацький запит' : 'Custom Prompt Query'}
                      </label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={customPrompt} 
                          onChange={(e) => setCustomPrompt(e.target.value)}
                          placeholder={language === 'ru' ? 'Введите команду или вопрос...' : language === 'uk' ? 'Введіть команду або запитання...' : 'Enter command or question...'} 
                          className="flex-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-500 font-mono"
                        />
                        <button 
                          type="button"
                          onClick={() => runScenario('custom')} 
                          className="px-3 py-2 rounded-lg bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                        >
                          {language === 'ru' ? 'Запуск' : language === 'uk' ? 'Запуск' : 'Run'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-2 flex flex-col h-[380px] rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-4 overflow-hidden font-mono text-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 text-[11px]">
                      <span>{language === 'ru' ? 'Поток выполнения ReAct (Рассуждения и Инструменты)' : language === 'uk' ? 'Потік виконання ReAct (Міркування та Інструменти)' : 'ReAct Execution Stream (Reasoning & Tool Calls)'}</span>
                      <span className={agentStatus.includes('Thinking') ? 'text-zinc-900 dark:text-zinc-100 font-bold animate-pulse' : 'text-zinc-700 dark:text-zinc-300'}>
                        {agentStatus}
                      </span>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto py-3 space-y-3 font-mono">
                      {agentOutput.length === 0 ? (
                        <>
                          <div className="text-zinc-400 dark:text-zinc-500">
                            {language === 'ru' 
                              ? '// Готово. Выберите один из готовых сценариев слева, чтобы увидеть цикл ReAct в действии.'
                              : language === 'uk'
                                ? '// Готово. Оберіть один із готових сценаріїв ліворуч, щоб побачити цикл ReAct у дії.'
                                : '// Ready. Click one of the preset scenarios on the left to see the ReAct loop in action.'}
                          </div>
                          <div className="text-zinc-400 dark:text-zinc-500">
                            {language === 'ru'
                              ? '// Цикл ReAct отобразит: [Мышление агента] → [Аккордеон вызова инструментов] → [Синтезированный ответ в заметку].'
                              : language === 'uk'
                                ? '// Цикл ReAct відобразить: [Мислення агента] → [Акордеон виклику інструментів] → [Синтезована відповідь у замітку].'
                                : '// ReAct loop will show: [Agent Thinking] → [Tool Calls Accordion] → [Synthesized Note Response].'}
                          </div>
                        </>
                      ) : (
                        agentOutput
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Interactive Tasks */}
            {playgroundTab === 'tasks' && (
              <div className="p-6">
                <div className="max-w-2xl mx-auto border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 p-5 shadow-sm">
                  <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
                    <div>
                      <span className="text-xs font-mono text-zinc-500">File: Daily/2026-11-10.md</span>
                      <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-0.5 flex items-center gap-2">
                        <svg className="w-4 h-4 text-zinc-700 dark:text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
                        <span>{language === 'ru' ? 'Ежедневные задачи и синтаксис Obsidian Tasks' : language === 'uk' ? 'Щоденні завдання та синтаксис Obsidian Tasks' : 'Daily Tasks & Obsidian Tasks Syntax'}</span>
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono text-zinc-600 dark:text-zinc-400 px-2 py-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded">
                      {language === 'ru' ? 'Синхронизация состояния' : language === 'uk' ? 'Синхронізація стану' : 'Live State Sync'}
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    {taskStates.map((task, idx) => (
                      <label 
                        key={task.id} 
                        className="flex items-start gap-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/40 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
                      >
                        <input 
                          type="checkbox" 
                          checked={task.completed} 
                          onChange={() => handleToggleTask(idx)} 
                          className="mt-1 rounded bg-white dark:bg-zinc-950 border-zinc-300 dark:border-zinc-700 text-zinc-900 focus:ring-0"
                        />
                        <div className="flex-1 text-xs">
                          <span className={`font-medium ${task.completed ? 'line-through text-zinc-400' : 'text-zinc-800 dark:text-zinc-200'}`}>
                            {task.text}
                          </span>
                          <div className="mt-1 flex items-center gap-2 font-mono text-[11px]">
                            <span className="text-zinc-900 dark:text-zinc-100 font-bold">
                              {task.priority === 'High' 
                                ? (language === 'ru' ? '▲ Высокий' : language === 'uk' ? '▲ Високий' : '▲ High') 
                                : task.priority === 'Medium' 
                                  ? (language === 'ru' ? '■ Средний' : language === 'uk' ? '■ Середній' : '■ Medium') 
                                  : (language === 'ru' ? '▼ Низкий' : language === 'uk' ? '▼ Низький' : '▼ Low')}
                            </span>
                            <span className="text-zinc-500">[due: {task.due}]</span>
                            <span className="text-zinc-500">{task.tag}</span>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>

                  <div className="mt-5 pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                    <span>{lastSyncMsg}</span>
                    <span className="text-zinc-600 dark:text-zinc-400">
                      {language === 'ru' ? 'Стандарт: Плагин Obsidian Tasks' : language === 'uk' ? 'Стандарт: Плагін Obsidian Tasks' : 'Standard: Obsidian Tasks Plugin'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: SQLite Offline Queue */}
            {playgroundTab === 'queue' && (
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        {language === 'ru' ? 'Монитор очереди sync_job_queue' : language === 'uk' ? 'Монітор черги sync_job_queue' : 'sync_job_queue Monitor'}
                      </h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {language === 'ru' 
                          ? 'Двухстадийный буфер надежности: RAW_EXTRACT (медиа) и READY_FOR_VAULT (Markdown)' 
                          : language === 'uk' 
                            ? 'Двостадійний буфер надійності: RAW_EXTRACT (медіа) та READY_FOR_VAULT (Markdown)' 
                            : 'Two-stage reliability buffer: RAW_EXTRACT (media) & READY_FOR_VAULT (Markdown)'}
                      </p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => alert(language === 'ru' ? 'Воркер SQLite: 0 задач в очереди. Хранилище полностью синхронизировано (HTTP 200 OK).' : language === 'uk' ? 'Воркер SQLite: 0 завдань у черзі. Сховище повністю синхронізовано (HTTP 200 OK).' : 'SQLite Sync Daemon: 0 pending items. Vault is up to date (HTTP 200 OK).')} 
                      className="px-3 py-1.5 rounded-lg bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-xs"
                    >
                      {language === 'ru' ? 'Принудительный сброс очереди' : language === 'uk' ? 'Примусове скидання черги' : 'Force Sync Flush'}
                    </button>
                  </div>

                  <div className="overflow-x-auto border border-zinc-200 dark:border-zinc-800 rounded-lg">
                    <table className="w-full text-left font-mono text-xs">
                      <thead className="bg-zinc-100 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-400">
                        <tr>
                          <th className="p-3">{language === 'ru' ? 'ID ЗАДАЧИ' : language === 'uk' ? 'ID ЗАВДАННЯ' : 'JOB ID'}</th>
                          <th className="p-3">{language === 'ru' ? 'СТАДИЯ' : language === 'uk' ? 'СТАДІЯ' : 'STAGE'}</th>
                          <th className="p-3">{language === 'ru' ? 'ДЕЙСТВИЕ' : language === 'uk' ? 'ДІЯ' : 'ACTION'}</th>
                          <th className="p-3">{language === 'ru' ? 'ЦЕЛЬ' : language === 'uk' ? 'ЦІЛЬ' : 'TARGET'}</th>
                          <th className="p-3">{language === 'ru' ? 'СТАТУС' : language === 'uk' ? 'СТАТУС' : 'STATUS'}</th>
                          <th className="p-3">{language === 'ru' ? 'ПОВТОРЫ' : language === 'uk' ? 'ПОВТОРИ' : 'RETRIES'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-800 dark:text-zinc-300">
                        {queueJobs.map(job => (
                          <tr key={job.id}>
                            <td className="p-3 text-zinc-500">{job.id}</td>
                            <td className="p-3"><span className="px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-[10px] text-zinc-800 dark:text-zinc-200">{job.stage}</span></td>
                            <td className="p-3">{job.action}</td>
                            <td className="p-3 text-zinc-600 dark:text-zinc-400">{job.target}</td>
                            <td className="p-3 text-zinc-900 dark:text-zinc-100 font-semibold">{job.status}</td>
                            <td className="p-3 text-zinc-500">{job.retries}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: cURL Sandbox */}
            {playgroundTab === 'api' && (
              <div className="p-6">
                <div className="space-y-4 font-mono text-xs">
                  <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                    <span>{language === 'ru' ? 'Контракт интеграции с Obsidian Local REST API (:27124)' : language === 'uk' ? 'Контракт інтеграції з Obsidian Local REST API (:27124)' : 'Obsidian Local REST API (:27124) Integration Contract'}</span>
                    <button 
                      type="button"
                      onClick={() => handleCopy(curlSnippet, 'curl')} 
                      className="px-2.5 py-1 rounded-md bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-colors"
                    >
                      {copyFeedback === 'curl' ? (language === 'ru' ? '✓ Скопировано' : language === 'uk' ? '✓ Скопійовано' : '✓ Copied') : (language === 'ru' ? 'Копировать cURL' : language === 'uk' ? 'Копіювати cURL' : 'Copy cURL')}
                    </button>
                  </div>
                  <pre className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 overflow-x-auto leading-relaxed">
                    {curlSnippet}
                  </pre>
                </div>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* ==================== 5. SYSTEM ARCHITECTURE & DOCKER SECTION (SNAP SECTION #architecture) ==================== */}
      <section id="architecture" className="snap-section min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full transition-colors">
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/60 dark:bg-zinc-900/30 p-8 sm:p-10 transition-colors">
          
          <div className="max-w-3xl">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-500">
              {language === 'ru' ? 'Промышленная инфраструктура' : language === 'uk' ? 'Промислова інфраструктура' : 'Production Infrastructure'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 mt-1">
              {language === 'ru' ? '24/7 Серверная Docker-архитектура' : language === 'uk' ? '24/7 Серверна Docker-архітектура' : '24/7 Server-First Docker Architecture'}
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
              {language === 'ru' 
                ? 'Ваше хранилище физически находится на сервере в headless-контейнере Obsidian. Клиентские приложения подключаются через защищенные TLS REST-запросы, а десктопные ПК синхронизируются в фоне через Syncthing.' 
                : language === 'uk' 
                  ? 'Ваше сховище фізично знаходиться на сервері у headless-контейнері Obsidian. Клієнтські застосунки підключаються через захищені TLS REST-запити, а десктопні ПК синхронізуються у фоні через Syncthing.' 
                  : 'Your vault lives strictly on your server in a headless Obsidian container. Client apps connect through TLS-protected REST calls, while desktop workstations synchronize in the background using Syncthing.'}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            
            {/* Architectural Topology Diagram (Structured Visual Schematic) */}
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 flex flex-col justify-between shadow-xs">
              
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-zinc-950 dark:bg-zinc-100"></span>
                  <span className="font-mono text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                    {language === 'ru' ? 'Схема топологии' : language === 'uk' ? 'Схема топології' : 'Topology Schematic'}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-zinc-500 bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-800">
                  {language === 'ru' ? 'Локальная сеть' : language === 'uk' ? 'Локальна мережа' : 'Local-First Mesh'}
                </span>
              </div>

              <div className="space-y-3 font-mono">
                
                {/* Layer 1: Client Devices */}
                <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40 p-3.5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-zinc-700 dark:text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                      <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                        {language === 'ru' ? 'УРОВЕНЬ КЛИЕНТА' : language === 'uk' ? 'РІВЕНЬ КЛІЄНТА' : 'CLIENT LAYER'}
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-500">Android • Windows • Web</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-[11px] text-zinc-700 dark:text-zinc-300">
                    <div className="px-2 py-1 rounded bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-center">React 19 + TS</div>
                    <div className="px-2 py-1 rounded bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-center">
                      {language === 'ru' ? 'Буфер SQLite' : language === 'uk' ? 'Буфер SQLite' : 'SQLite Buffer'}
                    </div>
                    <div className="px-2 py-1 rounded bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-center">
                      {language === 'ru' ? 'Ключи BYOK' : language === 'uk' ? 'Ключі BYOK' : 'BYOK Keystore'}
                    </div>
                  </div>
                </div>

                {/* Connector 1 */}
                <div className="flex flex-col items-center justify-center -my-1">
                  <div className="w-px h-3 bg-zinc-300 dark:bg-zinc-700"></div>
                  <div className="px-2.5 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-[10px] text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5 shadow-2xs">
                    <svg className="w-3 h-3 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                    <span>HTTPS / TLS (Bearer Token • Port :27124)</span>
                    <span className="text-zinc-400">↓</span>
                  </div>
                  <div className="w-px h-3 bg-zinc-300 dark:bg-zinc-700"></div>
                </div>

                {/* Layer 2: 24/7 Home Server (Hub) */}
                <div className="rounded-lg border-2 border-zinc-300 dark:border-zinc-700 bg-zinc-100/50 dark:bg-zinc-900/60 p-3.5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-zinc-950 dark:text-zinc-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"/></svg>
                      <span className="text-xs font-bold text-zinc-950 dark:text-zinc-50">
                        {language === 'ru' ? 'ДОМАШНИЙ СЕРВЕР 24/7' : language === 'uk' ? 'ДОМАШНІЙ СЕРВЕР 24/7' : '24/7 HOME SERVER'}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                      {language === 'ru' ? 'Единый источник правды' : language === 'uk' ? 'Єдине джерело правди' : 'Single Source of Truth'}
                    </span>
                  </div>
                  
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between p-2 rounded bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100"></span>
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">Docker: linuxserver/obsidian</span>
                      </div>
                      <span className="text-[10px] text-zinc-500">Xvfb Headless • REST :27124</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100"></span>
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">Docker: Caddy Reverse Proxy</span>
                      </div>
                      <span className="text-[10px] text-zinc-500">Auto TLS 443</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100"></span>
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">Docker: Syncthing Node</span>
                      </div>
                      <span className="text-[10px] text-zinc-500">P2P Mesh TCP :22000</span>
                    </div>
                  </div>
                </div>

                {/* Connector 2 */}
                <div className="flex flex-col items-center justify-center -my-1">
                  <div className="w-px h-3 bg-zinc-300 dark:bg-zinc-700"></div>
                  <div className="px-2.5 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-[10px] text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5 shadow-2xs">
                    <svg className="w-3 h-3 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                    <span>{language === 'ru' ? 'P2P TCP синхронизация (.stignore активен)' : language === 'uk' ? 'P2P TCP синхронізація (.stignore активний)' : 'P2P TCP Sync (.stignore • workspace.json excluded)'}</span>
                    <span className="text-zinc-400">↕</span>
                  </div>
                  <div className="w-px h-3 bg-zinc-300 dark:bg-zinc-700"></div>
                </div>

                {/* Layer 3: Workstation Desktop */}
                <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40 p-3.5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-zinc-700 dark:text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                      <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                        {language === 'ru' ? 'РАБОЧАЯ СТАНЦИЯ (ПК)' : language === 'uk' ? 'РОБОЧА СТАНЦІЯ (ПК)' : 'WORKSTATION DESKTOP'}
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-500">
                      {language === 'ru' ? 'Периодический онлайн • Без конфликтов' : language === 'uk' ? 'Періодичний онлайн • Без конфліктів' : 'Periodic Online • Conflict-Free'}
                    </span>
                  </div>
                  <div className="p-2 rounded bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-[11px] text-zinc-800 dark:text-zinc-200">
                    <span>{language === 'ru' ? 'Десктопное приложение Obsidian' : language === 'uk' ? 'Десктопний застосунок Obsidian' : 'Native Obsidian Desktop App'}</span>
                    <span className="text-zinc-500 font-mono text-[10px]">⇄ Local SSD /vaults</span>
                  </div>
                </div>

              </div>

              <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                <span>{language === 'ru' ? 'Протокол: P2P / REST без сторонних облаков' : language === 'uk' ? 'Протокол: P2P / REST без сторонніх хмар' : 'Protocol: Zero-Cloud P2P / REST'}</span>
                <span className="text-zinc-900 dark:text-zinc-100 font-semibold">
                  {language === 'ru' ? '✓ Изолирован и готов к офлайну' : language === 'uk' ? '✓ Ізольований та готовий до офлайну' : '✓ Isolated & Offline-Ready'}
                </span>
              </div>

            </div>

            {/* Docker Compose Snippet */}
            <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 font-mono text-xs flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400">
                  <span>docker-compose.yml (Reference Stack)</span>
                  <button 
                    type="button"
                    onClick={() => handleCopy(dockerComposeYaml, 'docker')} 
                    className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-[11px] transition-colors"
                  >
                    {copyFeedback === 'docker' ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
                <pre className="mt-3 text-zinc-800 dark:text-zinc-300 overflow-x-auto text-[11px] leading-relaxed">
                  {dockerComposeYaml}
                </pre>
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-500">
                Source: <code className="text-zinc-700 dark:text-zinc-400">SPECIFICATION.md v3.5.0</code>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ==================== 6. FOOTER SECTION (SNAP SECTION #footer) ==================== */}
      <footer id="footer" className="snap-section border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 py-12 text-xs text-zinc-600 dark:text-zinc-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            
            <div className="col-span-2">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-6 h-6 rounded overflow-hidden shrink-0 bg-zinc-950">
                  <svg viewBox="0 0 512 512" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <rect x="8" y="8" width="496" height="496" rx="108" fill="#121316" />
                    <rect x="63" y="63" width="386" height="386" rx="78" fill="none" stroke="#f4f4f5" strokeWidth="12" />
                    <polygon points="256,63 449,256 256,449 63,256" fill="#121316" stroke="#f4f4f5" strokeWidth="12" />
                    <polygon points="256,144 368,256 256,368 144,256" fill="none" stroke="#f4f4f5" strokeWidth="12" />
                  </svg>
                </div>
                <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm tracking-tight">Obsidian AI Hub</span>
              </div>
              <p className="text-zinc-500 max-w-sm text-xs leading-relaxed">
                {language === 'ru' 
                  ? 'Автономный ReAct AI-хаб и менеджер базы знаний для Obsidian. Селф-хостинг на домашнем сервере с 24/7 Local REST API, Whisper STT и синхронизацией Tasks.'
                  : language === 'uk'
                    ? 'Автономний ReAct AI-хаб та менеджер бази знань для Obsidian. Селф-хостинг на домашньому сервері з 24/7 Local REST API, Whisper STT та синхронізацією Tasks.'
                    : 'The autonomous ReAct AI hub and knowledge manager for Obsidian. Self-hosted on home servers with 24/7 Local REST API, Whisper STT, and Tasks sync.'}
              </p>
              <div className="mt-4 flex items-center gap-2 font-mono text-[11px] text-zinc-600 dark:text-zinc-400">
                <span className="w-2 h-2 rounded-full bg-zinc-900 dark:bg-zinc-100"></span>
                <span>REST API Hub :27124 Online</span>
              </div>
            </div>

            <div>
              <h4 className="font-mono text-zinc-900 dark:text-zinc-200 uppercase tracking-wider text-[11px] mb-3 font-semibold">
                {language === 'ru' ? 'Экосистема' : language === 'uk' ? 'Екосистема' : 'Ecosystem'}
              </h4>
              <ul className="space-y-2">
                <li><a href="#explore" className="hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors">{language === 'ru' ? 'ReAct Агенты' : language === 'uk' ? 'ReAct Агенти' : 'ReAct Agents'}</a></li>
                <li><a href="#explore" className="hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors">{language === 'ru' ? 'Пространства Vault' : language === 'uk' ? 'Простори Vault' : 'Vault Spaces'}</a></li>
                <li><a href="#playground" className="hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors">{language === 'ru' ? 'Матрица задач Tasks' : language === 'uk' ? 'Матриця задач Tasks' : 'Tasks Matrix'}</a></li>
                <li><a href="#playground" className="hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors">{language === 'ru' ? 'Голосовой ввод Whisper' : language === 'uk' ? 'Голосове введення Whisper' : 'Whisper STT'}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-mono text-zinc-900 dark:text-zinc-200 uppercase tracking-wider text-[11px] mb-3 font-semibold">
                {language === 'ru' ? 'Платформы' : language === 'uk' ? 'Платформи' : 'Platforms'}
              </h4>
              <ul className="space-y-2">
                <li><span className="text-zinc-800 dark:text-zinc-300 font-medium">Android</span> <span className="text-zinc-500 font-mono">(Capacitor 7+)</span></li>
                <li><span className="text-zinc-800 dark:text-zinc-300 font-medium">Windows</span> <span className="text-zinc-500 font-mono">(Tauri v2 ≤ 15MB)</span></li>
                <li><span className="text-zinc-800 dark:text-zinc-300 font-medium">Web / PWA</span> <span className="text-zinc-500 font-mono">(React 19)</span></li>
                <li><span className="text-zinc-800 dark:text-zinc-300 font-medium">Docker</span> <span className="text-zinc-500 font-mono">(linuxserver)</span></li>
              </ul>
            </div>

            <div>
              <h4 className="font-mono text-zinc-900 dark:text-zinc-200 uppercase tracking-wider text-[11px] mb-3 font-semibold">
                {language === 'ru' ? 'Архитектура' : language === 'uk' ? 'Архітектура' : 'Architecture'}
              </h4>
              <ul className="space-y-2">
                <li><a href="#architecture" className="hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors">Local REST API (:27124)</a></li>
                <li><a href="#architecture" className="hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors">{language === 'ru' ? 'Очередь SQLite' : language === 'uk' ? 'Черга SQLite' : 'SQLite Queue'}</a></li>
                <li><a href="#architecture" className="hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors">Caddy TLS</a></li>
                <li><a href="#architecture" className="hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors">{language === 'ru' ? 'BYOK Приватность' : language === 'uk' ? 'BYOK Приватність' : 'BYOK Privacy'}</a></li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-zinc-500">
            <div>
              &copy; 2026 Obsidian AI Hub. Specification v3.5.0 • Strict Monochrome Design.
            </div>
            <div className="flex items-center gap-4">
              <a href="#home" className="hover:text-zinc-900 dark:hover:text-zinc-300">
                {language === 'ru' ? 'В начало ↑' : language === 'uk' ? 'Вгору ↑' : 'Back to Top ↑'}
              </a>
              <span>•</span>
              <button type="button" onClick={() => setRoute('/settings')} className="hover:text-zinc-900 dark:hover:text-zinc-300">
                {language === 'ru' ? 'Настройки' : language === 'uk' ? 'Налаштування' : 'Settings'}
              </button>
              <span>•</span>
              <button type="button" onClick={bypassAuth} className="hover:text-zinc-900 dark:hover:text-zinc-300">
                {language === 'ru' ? 'Открыть чат' : language === 'uk' ? 'Відкрити чат' : 'Open Chat Interface'}
              </button>
            </div>
          </div>

        </div>
      </footer>

      {/* ==================== AUTH MODAL ==================== */}
      {isAuthModalOpen && (
        <div 
          onClick={() => setIsAuthModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm transition-opacity"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-2xl relative transition-all"
          >
            <button 
              type="button"
              onClick={() => setIsAuthModalOpen(false)} 
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 text-lg"
            >
              ✕
            </button>
            
            <div className="text-center mb-6">
              <div className="w-10 h-10 rounded-lg overflow-hidden mx-auto mb-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-950">
                <svg viewBox="0 0 512 512" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <rect x="8" y="8" width="496" height="496" rx="108" fill="#121316" />
                  <polygon points="256,63 449,256 256,449 63,256" fill="none" stroke="#f4f4f5" strokeWidth="14" />
                  <polygon points="256,144 368,256 256,368 144,256" fill="none" stroke="#f4f4f5" strokeWidth="14" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-zinc-950 dark:text-zinc-50">
                {authTab === 'login' 
                  ? (language === 'ru' ? 'Вход в Obsidian Hub' : language === 'uk' ? 'Вхід до Obsidian Hub' : 'Log In to Obsidian Hub') 
                  : (language === 'ru' ? 'Создать аккаунт' : language === 'uk' ? 'Створити акаунт' : 'Create Obsidian Hub Account')}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                {language === 'ru' 
                  ? 'Подключите ваше устройство к серверному хранилищу 24/7' 
                  : language === 'uk' 
                    ? 'Підключіть ваш пристрій до серверного сховища 24/7' 
                    : 'Connect your local device to the 24/7 server vault'}
              </p>
            </div>

            <div className="flex rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 p-1 mb-4 text-xs font-mono">
              <button 
                type="button"
                onClick={() => setAuthTab('login')} 
                className={`flex-1 py-1.5 rounded-md font-semibold transition-all ${
                  authTab === 'login' 
                    ? 'bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-100 shadow-xs' 
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
                }`}
              >
                {t.login_btn}
              </button>
              <button 
                type="button"
                onClick={() => setAuthTab('signup')} 
                className={`flex-1 py-1.5 rounded-md font-semibold transition-all ${
                  authTab === 'signup' 
                    ? 'bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-100 shadow-xs' 
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
                }`}
              >
                {t.auth_register_tab}
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-mono text-zinc-600 dark:text-zinc-400 mb-1">{t.server_url_label}</label>
                <input 
                  type="text" 
                  value={vaultEndpoint} 
                  onChange={(e) => setVaultEndpoint(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-900 dark:text-zinc-100 font-mono focus:outline-none focus:border-zinc-500"
                />
              </div>
              <div>
                <label className="block font-mono text-zinc-600 dark:text-zinc-400 mb-1">{t.token_label}</label>
                <input 
                  type="password" 
                  value={apiKey} 
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-900 dark:text-zinc-100 font-mono focus:outline-none focus:border-zinc-500"
                />
              </div>

              <button 
                type="submit" 
                className="w-full py-2.5 rounded-lg bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors mt-4"
              >
                {authTab === 'login' 
                  ? (language === 'ru' ? 'Авторизоваться в Vault' : language === 'uk' ? 'Авторизуватися у Vault' : 'Authenticate with Vault') 
                  : (language === 'ru' ? 'Зарегистрироваться' : language === 'uk' ? 'Зареєструватися' : 'Sign Up')}
              </button>

              <button 
                type="button" 
                onClick={bypassAuth} 
                className="w-full py-2 text-center text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 text-xs"
              >
                {t.auth_demo_button}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
export default LandingPage;
