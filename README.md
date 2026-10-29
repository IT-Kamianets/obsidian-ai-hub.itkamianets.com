# Obsidian AI Hub & Knowledge Manager

<p align="center">
  <img src="https://img.shields.io/badge/React-19.0-61dafb?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.7+-3178c6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-6.0-646cff?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/Obsidian-Local_REST_API-7c3aed?style=for-the-badge&logo=obsidian&logoColor=white" alt="Obsidian Hub" />
  <img src="https://img.shields.io/badge/BYOK-Zero_Telemetry-10b981?style=for-the-badge&logo=shield&logoColor=white" alt="BYOK" />
</p>

<p align="center">
  <a href="#-english"><b>English</b></a> • <a href="#-русский"><b>Русский</b></a>
</p>

---

# 🇬🇧 English

## 📌 Overview

**Obsidian AI Hub & Knowledge Manager** is a personal multimodal AI assistant and knowledge base manager built as a modern SPA (React 19, TypeScript, Tailwind CSS v4, Vite 6). It is engineered for autonomous information digitization (voice notes via Groq Whisper STT, document OCR via ML Kit) and direct two-way personal vault management through the **Obsidian Local REST API (`:27124`)** plugin.

The architecture is built around the **BYOK (Bring Your Own Key)** paradigm with zero intermediate cloud proxies or hidden telemetry: all LLM inference and speech recognition requests are executed directly from the user's client device.

---

## 🏛️ Core Architectural Tenets

```
┌─────────────────────────────────────────────────────────────────┐
│                       Client Application                        │
│   (React 19 + TypeScript + Tailwind v4 + Local-First SQLite)    │
└────────┬──────────────────────┬───────────────────────┬─────────┘
         │                      │                       │
         ▼                      ▼                       ▼
  [ BYOK LLM Calls ]    [ Groq Whisper STT ]    [ Caddy TLS Proxy ]
  Gemini 2.0 / GPT-4o   Sub-second audio memo       Port :443
                                                        │
                                                        ▼
                                                [ Obsidian Local ]
                                                [   REST API     ]
                                                  Port :27124
                                                        │
                                                        ▼
                                                [ Obsidian Vault ]
                                                (Docker Headless)
```

1. **24/7 Single Source of Truth (Server-First Storage):**  
   The primary vault is hosted on a dedicated home server inside an isolated Docker container (`linuxserver/obsidian` with virtual display Xvfb). Interaction occurs securely via **Obsidian Local REST API (`:27124`)**, reverse-proxied by Caddy with trusted TLS.
2. **BYOK Security (Bring Your Own Key):**  
   Zero third-party cloud relays or analytics. User credentials (`GROQ_API_KEY`, `GEMINI_API_KEY`, `OPENAI_API_KEY`, `OBSIDIAN_API_KEY`) are stored and encrypted locally in the device's hardware Secure Store / Keystore.
3. **Decoupled Workstation Sync:**  
   The primary workstation is never a single point of failure. Synchronization between PC and the 24/7 server is handled peer-to-peer via Syncthing (`.stignore` ignores UI cache such as `workspace.json`).
4. **Local-First & Fault Tolerance (SQLite Queue):**  
   Network outages do not cause data loss. Requests and multimodal captures are buffered in a local two-stage SQLite queue:
   - `RAW_EXTRACT`: uncompressed audio and images when internet access is down;
   - `READY_FOR_VAULT`: structured Markdown files and updates when the Obsidian server is temporarily unreachable.  
   Once connection is restored, a background worker automatically flushes the queue to the vault.
5. **ReAct Loop & Tool Calling:**  
   The assistant performs iterative reasoning and action cycles: vault search (`search_vault`), context reading (`read_note`), daily schedule synthesis (`manage_daily_plan`), task status updates (`update_task_status`), and file modifications (`create_note`, `append_to_note`).

---

## ✨ Key Features

- 💬 **Intelligent Chat Interface (`/chat`):**
  - **Obsidian Tasks** support: interactive checkboxes (`- [ ]` ↔ `- [x]`), priorities (`⏫ High`, `🔼 Medium`, `🔽 Low`), due dates (`📅 YYYY-MM-DD`), and `#tags`. Clicking any checkbox triggers `update_task_status` and updates the physical vault file.
  - Interactive purple **WikiLink chips** (`[[Daily/2026-09-28.md]]`, `[[Projects/Architecture.md]]`) with an integrated note preview modal (`NoteModal`).
  - Collapsible **ReAct tool accordion** (`ToolCallsAccordion`) with detailed parameters, affected notes, and execution results.
  - Quick action suggestion buttons neatly aligned in a guaranteed single line above the input box without horizontal scrollbars.
- 🎙️ **Voice Inbox (Groq Whisper Cloud STT):**
  - Audio recording with real-time pulsating soundwave visualizer and live timer.
  - Sub-second speech recognition (< 1s) powered by `whisper-large-v3` with direct insertion into the chat or appending to `Inbox/Quick_Memos.md`.
- 📷 **Multimodal Document OCR (ML Kit / Vision):**
  - Extraction from book pages, invoices, receipts, and handwritten notes with structured YAML Frontmatter generation.
- 🎨 **Appearance & Themes:**
  - 🌙 **Obsidian Dark** (signature graphite palette `#0c0e14`, `#171c2b`)
  - 🔘 **OLED / True Black** (pitch-black `#000000` for OLED displays)
  - ☀️ **Light** (clean soft contrast for daytime work)
- 🌐 **Comprehensive Localization (i18n):**
  - Full support for 🇬🇧 English (`en`), 🇷🇺 Русский (`ru`), and 🇺🇦 Українська (`uk`).
  - Landing page, chat, settings, tool logs, priority badges, and simulated responses are 100% translated.
- ⚙️ **System Control Panel (`/settings`):**
  - Real-time connection ping monitor to Obsidian Local REST API (`:27124`).
  - BYOK provider key manager with password visibility toggles.
  - SQLite offline queue monitor (`sync_job_queue`) with manual retry and Offline Mode simulation.

---

## 🛠️ Tech Stack

| Domain | Technology | Description |
| :--- | :--- | :--- |
| **UI Framework** | React 19 (`react`, `react-dom`) | Declarative, component-driven UI |
| **Language** | TypeScript 5.7+ | Strict static typing (`strict: true`) |
| **Bundler** | Vite 6 | Instant Hot Module Replacement (HMR) |
| **Styling** | Tailwind CSS v4 (`@tailwindcss/vite`) | CSS variables for real-time dynamic themes |
| **Icons** | Lucide React (`lucide-react`) | Crisp, lightweight SVG icon package |
| **State** | React Context + Custom Hooks (`AppContext`) | Centralized reactive application store |
| **Persistence** | `localStorage` API | Persisting user theme and language settings |
| **Typography** | Inter, JetBrains Mono | Monospace font for file paths, YAML, and tags |

---

## 📁 Project Structure

```text
├── index.html                      # HTML entry template, Inter & JetBrains Mono fonts
├── package.json                    # Dependencies manifest & npm scripts
├── tsconfig.json                   # TypeScript compiler configuration (ES2020)
├── vite.config.ts                  # Vite config with React & Tailwind CSS v4 plugins
├── README.md                       # Project documentation & user guide
├── PROJECT_CONTEXT.md              # Long-term AI assistant project memory snapshot
│
└── src/
    ├── main.tsx                    # React bootstrap (ReactDOM.createRoot, AppProvider)
    ├── App.tsx                     # Top-level router ('/', '/chat', '/settings')
    ├── index.css                   # Tailwind v4 directives, themes, wikilinks, custom scrollbars
    │
    ├── types/
    │   └── index.ts                # TypeScript interfaces: ChatSession, ToolCall, VaultNote, SQLiteJob
    │
    ├── i18n/
    │   └── translations.ts         # Centralized localization dictionaries (EN, RU, UK)
    │
    ├── data/
    │   └── mockVault.ts            # Mock Obsidian vault notes, tasks, and initial chats
    │
    ├── context/
    │   └── AppContext.tsx          # Core logic: routing, ReAct simulation, SQLite queue, themes, i18n
    │
    └── components/
        ├── LandingPage.tsx         # Presentation landing (/), hero section, interactive terminal preview
        ├── ChatInterface.tsx       # Assistant workspace (/chat), ReAct accordion, Tasks, sidebar drawer
        ├── SettingsPage.tsx        # System settings (/settings), theme, language, BYOK keys, SQLite queue
        ├── NoteModal.tsx           # Quick note preview modal with YAML frontmatter inspector & editor
        ├── MultimodalModal.tsx     # Voice recording dialog (Groq STT) & document OCR scanner
        └── Toasts.tsx              # Toast notification system
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18.0 or higher;
- **npm** (or `pnpm` / `yarn`).

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 3. Production Build
```bash
npm run build
```
Optimized assets are emitted to the `dist/` directory.

### 4. Preview Production Build
```bash
npm run preview
```

---

## 🔒 Security & Data Privacy

- **Zero intermediate servers:** no telemetry or third-party proxy relays.
- **Tokens and keys:** masked in the user interface and protected in client-side secure storage.
- **Offline operation:** the application functions fully within an isolated local network, automatically queueing changes via SQLite when disconnected.

---

<br />

# 🇷🇺 Русский

## 📌 О проекте

**Obsidian AI Hub & Knowledge Manager** — это персональный мультимодальный AI-ассистент и веб-интерфейс управления базой знаний. Приложение предназначено для автономной оцифровки информации (голосовые заметки через Groq Whisper STT, OCR документов через ML Kit) и прямого двустороннего управления персональным хранилищем (Vault) Obsidian через плагин **Obsidian Local REST API (`:27124`)**.

Архитектура построена по принципу **BYOK (Bring Your Own Key)** без использования сторонних облачных посредников: все запросы к нейросетям и сервисам оцифровки выполняются непосредственно с клиентского устройства.

---

## 🏛️ Ключевые архитектурные принципы

```
┌─────────────────────────────────────────────────────────────────┐
│                       Client Application                        │
│   (React 19 + TypeScript + Tailwind v4 + Local-First SQLite)    │
└────────┬──────────────────────┬───────────────────────┬─────────┘
         │                      │                       │
         ▼                      ▼                       ▼
  [ BYOK LLM Calls ]    [ Groq Whisper STT ]    [ Caddy TLS Proxy ]
  Gemini 2.0 / GPT-4o   Sub-second audio memo       Port :443
                                                        │
                                                        ▼
                                                [ Obsidian Local ]
                                                [   REST API     ]
                                                  Port :27124
                                                        │
                                                        ▼
                                                [ Obsidian Vault ]
                                                (Docker Headless)
```

1. **24/7 Single Source of Truth (Server-First):**  
   Основное хранилище развернуто на домашнем сервере внутри изолированного Docker-контейнера (`linuxserver/obsidian` с виртуальным дисплеем Xvfb). Взаимодействие происходит по защищенному протоколу через **Obsidian Local REST API (`:27124`)**, проксируемый Caddy reverse-proxy с доверенным TLS.
2. **Безопасность BYOK (Bring Your Own Key):**  
   Никакой скрытой телеметрии или промежуточных облаков. API-ключи пользователя (`GROQ_API_KEY`, `GEMINI_API_KEY`, `OPENAI_API_KEY`, `OBSIDIAN_API_KEY`) сохраняются локально в защищенном хранилище (Secure Store / Keystore).
3. **Decoupled Workstation Sync:**  
   Основной рабочий компьютер не является точкой отказа. Синхронизация между рабочей станцией и домашним сервером происходит по одноранговому протоколу Syncthing (`.stignore` исключает служебный `workspace.json`).
4. **Local-First & Отказоустойчивость (SQLite Queue):**  
   При потере связи с сервером запросы и мультимодальные файлы не теряются, а сохраняются в локальную двухстадийную очередь:
   - `RAW_EXTRACT`: сырые аудиофайлы и изображения при отсутствии глобального интернета;
   - `READY_FOR_VAULT`: готовые Markdown-заметки и команды при недоступности домашнего сервера Obsidian.  
   При восстановлении соединения фоновый воркер автоматически синхронизирует очередь с сервером.
5. **ReAct Loop & Tool Calling:**  
   AI-ассистент выполняет циклы рассуждения и вызова инструментов: поиск по хранилищу (`search_vault`), чтение заметок (`read_note`), формирование плана дня (`manage_daily_plan`), обновление статуса задач (`update_task_status`) и модификация файлов (`create_note`, `append_to_note`).

---

## ✨ Основной функционал

- 💬 **Интеллектуальный чат-интерфейс (`/chat`):**
  - Поддержка синтаксиса **Obsidian Tasks**: интерактивные чекбоксы (`- [ ]` ↔ `- [x]`), приоритеты (`⏫ Высокий`, `🔼 Средний`, `🔽 Низкий`), даты дедлайнов (`📅 YYYY-MM-DD`) и теги (`#tag`).
  - Интерактивные фиолетовые чипы **Wiki-ссылок** (`[[Daily/2026-09-28.md]]`, `[[Projects/Architecture.md]]`) с модальным окном предпросмотра заметки (`NoteModal`).
  - Сворачиваемый компактный аккордеон **ReAct-логов** (`ToolCallsAccordion`) с детализацией вызовов инструментов, аргументов и затронутых файлов.
  - Кнопки быстрых подсказок над инпутом, гарантированно умещающиеся в одну строку без горизонтальных полос прокрутки.
- 🎙️ **Голосовой инбокс (Groq Whisper Cloud STT):**
  - Запись звука с пульсирующим визуализатором звуковой волны и живым счетчиком времени.
  - Мгновенная расшифровка речи (< 1 сек) через `whisper-large-v3` с автоматической вставкой в поле ввода или сохранением в `Inbox/Quick_Memos.md`.
- 📷 **Мультимодальный OCR документов (ML Kit / Vision):**
  - Оцифровка страниц книг, чеков, накладных и рукописных заметок с автоматическим формированием YAML Frontmatter.
- 🎨 **Темы оформления (Appearance):**
  - 🌙 **Obsidian Dark** (фирменная темная графитовая палитра `#0c0e14`, `#171c2b`)
  - 🔘 **OLED / True Black** (глубокий `#000000` для экранов с органическими светодиодами)
  - ☀️ **Light** (мягкий контраст для комфортной работы при дневном свете)
- 🌐 **Полная мультиязычность (i18n):**
  - 🇷🇺 Русский (`ru`), 🇺🇦 Українська (`uk`), 🇬🇧 English (`en`).
  - Все экраны, модалки, подсказки, карточки преимуществ и системные ответы ассистента переведены на 100%.
- ⚙️ **Панель управления системой (`/settings`):**
  - Монитор пинга и статуса подключения к Local REST API (`:27124`).
  - Управление BYOK-ключами с маскированием паролей.
  - Монитор задач офлайн-очереди SQLite (`sync_job_queue`) с ручным повтором и симулятором Offline Mode.

---

## 🛠️ Стек технологий

| Направление | Технология | Назначение |
| :--- | :--- | :--- |
| **UI Framework** | React 19 (`react`, `react-dom`) | Компонентный декларативный интерфейс |
| **Язык** | TypeScript 5.7+ | Строгая статическая типизация |
| **Сборщик** | Vite 6 | Мгновенный Hot Module Replacement (HMR) |
| **Стилизация** | Tailwind CSS v4 (`@tailwindcss/vite`) | CSS-переменные для тем оформления |
| **Иконки** | Lucide React (`lucide-react`) | Высококачественный SVG-пак иконок |
| **Состояние** | React Context + Hooks (`AppContext`) | Централизованный реактивный стор |
| **Хранилище** | `localStorage` API | Сохранение темы и выбранного языка |
| **Шрифты** | Inter, JetBrains Mono | Моноширинный шрифт для кода, YAML и тегов |

---

## 📁 Структура проекта

```text
├── index.html                      # HTML-шаблон с мета-тегами и шрифтами Inter & JetBrains Mono
├── package.json                    # Зависимости и npm-скрипты
├── tsconfig.json                   # Настройки компилятора TypeScript (ES2020)
├── vite.config.ts                  # Конфигурация Vite с плагинами React и Tailwind v4
├── README.md                       # Главная документация проекта (EN / RU)
├── PROJECT_CONTEXT.md              # Внешняя контекстная память проекта
│
└── src/
    ├── main.tsx                    # Точка входа React (ReactDOM.createRoot, AppProvider)
    ├── App.tsx                     # Корневой маршрутизатор роутов ('/', '/chat', '/settings')
    ├── index.css                   # Tailwind v4 директивы, стили тем, wikilinks, кастомные скроллбары
    │
    ├── types/
    │   └── index.ts                # TypeScript-интерфейсы: ChatSession, ToolCall, VaultNote, SQLiteJob
    │
    ├── i18n/
    │   └── translations.ts         # Централизованные словари локализации (RU, UK, EN)
    │
    ├── data/
    │   └── mockVault.ts            # Начальные данные хранилища Obsidian, задачи и диалоги
    │
    ├── context/
    │   └── AppContext.tsx          # Ядро логики: роутинг, ReAct-симуляция, SQLite-очередь, тема, язык
    │
    └── components/
        ├── LandingPage.tsx         # Презентационный лендинг (/), Hero, терминал, модалка входа
        ├── ChatInterface.tsx       # Рабочий экран ассистента (/chat), ReAct-аккордеон, задачи, сайдбар
        ├── SettingsPage.tsx        # Страница настроек (/settings), выбор темы, языка, ключей и Hub
        ├── NoteModal.tsx           # Модальное окно предпросмотра и редактирования заметки Vault
        ├── MultimodalModal.tsx     # Диалоги захвата: диктофон Groq Whisper и OCR-сканер документов
        └── Toasts.tsx              # Система всплывающих уведомлений
```

---

## 🚀 Быстрый старт

### Требования
- **Node.js** версии 18.0 или выше;
- **npm** (или `pnpm` / `yarn`).

### Установка зависимостей
```bash
npm install
```

### Запуск в режиме разработки
```bash
npm run dev
```
После запуска откройте в браузере: `http://localhost:5173`

### Сборка для production
```bash
npm run build
```
Собранные оптимизированные статические файлы будут сохранены в директорию `dist/`.

### Предпросмотр сборки
```bash
npm run preview
```

---

## 🔒 Безопасность и хранение данных

- **Никаких промежуточных прокси-серверов:** данные не передаются третьим лицам.
- **Мастер-пароли и API-токены:** маскируются в интерфейсе и могут быть безопасно сохранены в Keystore вашего устройства.
- **Изоляция:** приложение может работать в полностью локальной сети без выхода в интернет (в автономном режиме с накоплением изменений в очереди SQLite).

---

## 📄 Лицензия

Проект распространяется под лицензией **MIT**. Подробности в файле лицензии.
