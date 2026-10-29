import { VaultNote, ChatSession, SQLiteJob, AppSettings } from '../types';

export const INITIAL_VAULT_NOTES: Record<string, VaultNote> = {
  'Daily/2026-09-28.md': {
    path: 'Daily/2026-09-28.md',
    title: 'Ежедневник: 28 сентября 2026',
    frontmatter: {
      id: 'daily_2026-09-28',
      date: '2026-09-28',
      type: 'daily-note',
      tags: ['daily/plan', 'status/active']
    },
    lastModified: '2026-09-28 14:30',
    content: `---
id: daily_2026-09-28
date: 2026-09-28
type: daily-note
tags:
  - daily/plan
  - status/active
---

## 🎯 Фокус и приоритеты дня
> Сформировано AI-ассистентом на основе незавершенных задач из [[Projects/Architecture.md]] и голосовой заметки.

### Задачи на сегодня
- [ ] Финализировать системную спецификацию ⏫ 📅 2026-09-28 #architecture
- [ ] Обработать видеозапись лекции в структурированный конспект 🔼 📅 2026-09-28 #study
- [ ] Проверить двухстороннюю синхронизацию Syncthing с рабочим ПК 🔽 📅 2026-09-28 #devops
- [x] Проверить Caddy TLS-прокси и порт 27124 📅 2026-09-28 #infra

### Связанный контекст
- Вчерашняя сводка: [[Daily/2026-09-27.md]]
- Архитектура сервиса: [[Projects/Architecture.md]]
`
  },
  'Daily/2026-09-27.md': {
    path: 'Daily/2026-09-27.md',
    title: 'Ежедневник: 27 сентября 2026',
    frontmatter: {
      id: 'daily_2026-09-27',
      date: '2026-09-27',
      type: 'daily-note',
      tags: ['daily/archive']
    },
    lastModified: '2026-09-27 21:00',
    content: `---
id: daily_2026-09-27
date: 2026-09-27
type: daily-note
tags:
  - daily/archive
---

## 🎯 Итоги дня
- [x] Развертывание Docker-контейнера linuxserver/obsidian с Xvfb
- [x] Конфигурация плагина Obsidian Local REST API на порту :27124
- [ ] Финализировать системную спецификацию (перенесено на завтра)
- [x] Тестирование Groq Whisper STT с задержкой < 1с
`
  },
  'Projects/Architecture.md': {
    path: 'Projects/Architecture.md',
    title: 'Архитектура Obsidian AI Hub & Knowledge Manager',
    frontmatter: {
      type: 'architecture-spec',
      status: 'approved',
      version: '3.0.0',
      tags: ['system', 'hub', 'rest-api']
    },
    lastModified: '2026-09-28 10:15',
    content: `---
type: architecture-spec
status: approved
version: 3.0.0
tags:
  - system
  - hub
  - rest-api
---

# Архитектура: Obsidian AI Hub v3.0

### Принципы системы:
1. **24/7 Single Source of Truth:** Хранилище Obsidian на домашнем сервере с плагином **Obsidian Local REST API** (:27124).
2. **Decoupled Workstation Sync:** Десктоп подключается через Syncthing (P2P синхронизация с игнорированием \`.stignore\`).
3. **Local-First Resilience:** Мобильные и веб клиенты используют SQLite очередь при потере связи.
4. **ReAct AI-агент:** Цикл рассуждения и вызова инструментов (\`search_vault\`, \`read_note\`, \`manage_daily_plan\`).
5. **Zero-Intermediate Telemetry (BYOK):** Прямые вызовы Groq Whisper, OpenAI и Gemini с клиентского устройства.
`
  },
  'Inbox/Quick_Memos.md': {
    path: 'Inbox/Quick_Memos.md',
    title: 'Голосовой инбокс и быстрые заметки',
    frontmatter: {
      type: 'inbox',
      source: 'whisper-stt',
      tags: ['inbox', 'voice']
    },
    lastModified: '2026-09-28 12:40',
    content: `---
type: inbox
source: whisper-stt
tags:
  - inbox
  - voice
---

# Быстрый инбокс (Groq STT / OCR)

### Голосовая заметка 12:40:
"Не забыть протестировать SQLite очередь в режиме авиарежима, чтобы убедиться в сохранении RAW_EXTRACT."
- Статус: обработано ассистентом
- Создана задача: [[Daily/2026-09-28.md]]
`
  }
};

export const INITIAL_CHAT_SESSIONS: ChatSession[] = [
  {
    id: 'chat_clean_init',
    title: 'Новый диалог',
    dateGroup: 'today',
    createdAt: '2026-09-28T10:00:00Z',
    messages: []
  },
  {
    id: 'chat_today_1',
    title: 'Планирование дня и синхронизация задач',
    dateGroup: 'today',
    createdAt: '2026-09-28T09:15:00Z',
    messages: [
      {
        id: 'msg_init_1',
        role: 'user',
        content: 'Спланируй задачи на день с учетом заметок за вчера и активных проектов',
        timestamp: '09:15'
      },
      {
        id: 'msg_init_2',
        role: 'assistant',
        content: `Я проанализировал твое хранилище через **Obsidian Local REST API** и подготовил актуальный план на сегодня:

## 🎯 Фокус и приоритеты на сегодня
На основе незавершенных пунктов из [[Daily/2026-09-27.md]] и системного проекта [[Projects/Architecture.md]]:

### Задачи на сегодня
- [ ] Финализировать системную спецификацию ⏫ 📅 2026-09-28 #architecture
- [ ] Обработать видеозапись лекции в структурированный конспект 🔼 📅 2026-09-28 #study
- [ ] Проверить двухстороннюю синхронизацию Syncthing с рабочим ПК 🔽 📅 2026-09-28 #devops
- [x] Проверить Caddy TLS-прокси и порт 27124 📅 2026-09-28 #infra

Все изменения автоматически синхронизированы в файл [[Daily/2026-09-28.md]]. Ты можешь отмечать задачи прямо здесь — они сразу обновятся в хранилище!`,
        timestamp: '09:15',
        toolCalls: [
          {
            id: 'call_1',
            name: 'read_note',
            parameters: { relative_path: 'Daily/2026-09-27.md' },
            result: 'Найдена незавершенная задача: "Финализировать системную спецификацию"',
            status: 'completed',
            timestamp: '09:15:02'
          },
          {
            id: 'call_2',
            name: 'search_vault',
            parameters: { query: 'приоритеты проекта спецификация' },
            result: 'Совпадения: Projects/Architecture.md (версия 3.0.0)',
            status: 'completed',
            timestamp: '09:15:03'
          },
          {
            id: 'call_3',
            name: 'manage_daily_plan',
            parameters: {
              relative_path: 'Daily/2026-09-28.md',
              tasks_count: 4,
              focus: 'Финализация спецификации и тестирование синхронизации'
            },
            result: 'HTTP 200 OK: Daily note успешно обновлена через REST API',
            status: 'completed',
            timestamp: '09:15:04'
          }
        ]
      }
    ]
  },
  {
    id: 'chat_yesterday_1',
    title: 'Настройка Caddy TLS и порта 27124',
    dateGroup: 'yesterday',
    createdAt: '2026-09-27T17:20:00Z',
    messages: [
      {
        id: 'msg_yest_1',
        role: 'user',
        content: 'Проверь параметры подключения к Obsidian REST Hub через Caddy',
        timestamp: '17:20'
      },
      {
        id: 'msg_yest_2',
        role: 'assistant',
        content: `Caddy обратный прокси успешно перенаправляет HTTPS трафик на внутренний порт \`:27124\` Obsidian Local REST API.
Токен \`OBSIDIAN_API_KEY\` активен, задержка отклика домашнего сервера составляет **14 мс**.`,
        timestamp: '17:21',
        toolCalls: [
          {
            id: 'call_y_1',
            name: 'check_hub_status',
            parameters: { endpoint: 'https://vault.internal.local' },
            result: 'HTTP 200 OK (Obsidian Local REST API v1.4.1)',
            status: 'completed',
            timestamp: '17:20:45'
          }
        ]
      }
    ]
  },
  {
    id: 'chat_past7_1',
    title: 'Анализ Groq Whisper STT и OCR для книг',
    dateGroup: 'past7days',
    createdAt: '2026-09-24T11:00:00Z',
    messages: [
      {
        id: 'msg_past_1',
        role: 'user',
        content: 'Какая скорость распознавания у Groq whisper-large-v3?',
        timestamp: '11:00'
      },
      {
        id: 'msg_past_2',
        role: 'assistant',
        content: `Согласно тестам, обработка 60-секундного голосового файла через Groq Whisper API занимает **менее 1 секунды** (~650-800 мс). Оцифрованный текст сразу направляется в \`Inbox/Quick_Memos.md\` или форматируется AI-агентом.`,
        timestamp: '11:01'
      }
    ]
  }
];

export const INITIAL_SQLITE_JOBS: SQLiteJob[] = [
  {
    id: 'job_raw_01',
    pipeline_stage: 'RAW_EXTRACT',
    action_type: 'VOICE_MEMO',
    local_file_path: '/cache/audio/memo_20260928_1240.m4a',
    target_path: 'Inbox/Quick_Memos.md',
    payload: JSON.stringify({ duration_sec: 24, codec: 'aac_16khz', transcript_hint: 'Идея архитектуры очереди' }),
    retry_count: 0,
    status: 'completed',
    created_at: Date.now() - 3600000,
    updated_at: Date.now() - 3500000
  },
  {
    id: 'job_ready_02',
    pipeline_stage: 'READY_FOR_VAULT',
    action_type: 'MANAGE_DAILY',
    target_path: 'Daily/2026-09-28.md',
    payload: JSON.stringify({ action: 'manage_daily_plan', tasksCount: 4, synced: true }),
    retry_count: 0,
    status: 'completed',
    created_at: Date.now() - 1800000,
    updated_at: Date.now() - 1795000
  },
  {
    id: 'job_ocr_03',
    pipeline_stage: 'RAW_EXTRACT',
    action_type: 'OCR_SCAN',
    local_file_path: '/cache/images/doc_receipt_0928.jpg',
    target_path: 'Inbox/OCR_Receipts.md',
    payload: JSON.stringify({ mode: 'mlkit_ocr', title: 'Фискальный чек оборудования сервера' }),
    retry_count: 0,
    status: 'pending',
    created_at: Date.now() - 600000,
    updated_at: Date.now() - 600000
  }
];

export const DEFAULT_SETTINGS: AppSettings = {
  serverUrl: 'https://vault.internal.local',
  serverPort: 27124,
  obsidianApiKey: 'obsidian_sec_99a84f3e9c81b2a47d01',
  caddyStatus: 'active',
  caddyDomain: 'vault.internal.local',
  groqApiKey: 'gsk_live_whisper_v3_9a7bc4e92',
  openaiApiKey: 'sk-proj-aihub_8872bcae019',
  geminiApiKey: 'AIzaSyDemoKeyObsidianHub2026',
  offlineMode: false,
  theme: 'dark',
  language: 'ru'
};
