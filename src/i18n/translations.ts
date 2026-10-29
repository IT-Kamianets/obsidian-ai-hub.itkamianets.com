export type AppLanguage = 'ru' | 'uk' | 'en';
export type AppTheme = 'light' | 'dark' | 'oled';

export interface Translations {
  // Navigation & Common
  back_to_chat: string;
  landing_btn: string;
  settings_title: string;
  settings_btn: string;
  online_status: string;
  offline_status: string;
  
  // Settings Page
  appearance_section_title: string;
  appearance_section_desc: string;
  theme_label: string;
  theme_light_name: string;
  theme_light_desc: string;
  theme_dark_name: string;
  theme_dark_desc: string;
  theme_oled_name: string;
  theme_oled_desc: string;
  lang_label: string;
  lang_ru: string;
  lang_uk: string;
  lang_en: string;
  
  rest_hub_title: string;
  rest_hub_desc: string;
  ping_btn: string;
  ping_ok: string;
  server_url_label: string;
  server_port_label: string;
  token_label: string;
  caddy_active: string;
  caddy_desc: string;

  byok_title: string;
  byok_desc: string;
  
  offline_queue_title: string;
  offline_queue_desc: string;
  clear_completed_btn: string;
  sync_btn: string;
  secure_store_title: string;
  secure_store_desc: string;

  // Settings Table
  table_col_id: string;
  table_col_stage: string;
  table_col_action: string;
  table_col_target: string;
  table_col_status: string;
  table_col_operations: string;

  // Chat Page
  new_chat: string;
  chat_history: string;
  today: string;
  yesterday: string;
  past7days: string;
  quick_vault_title: string;
  empty_title: string;
  empty_desc: string;
  prompt_plan_title: string;
  prompt_plan_desc: string;
  prompt_voice_title: string;
  prompt_voice_desc: string;
  prompt_ocr_title: string;
  prompt_ocr_desc: string;
  prompt_arch_title: string;
  prompt_arch_desc: string;
  input_placeholder: string;
  voice_btn: string;
  recording_now: string;
  stop_transcribe_btn: string;
  ocr_btn: string;
  file_btn: string;
  send_btn: string;

  // Chat Interface - ReAct Accordion
  tools_used: string;
  tools_executed: string;
  tools_files_in_req: string;
  tools_preview_note: string;
  tools_params: string;
  tools_result: string;

  // Chat Interface - Messages & Sidebar
  sender_user: string;
  sender_assistant: string;
  agent_thinking: string;
  agent_calling_api: string;
  priority_high: string;
  priority_medium: string;
  priority_low: string;
  sidebar_toggle_hide: string;
  sidebar_toggle_show: string;
  tooltip_voice: string;
  tooltip_ocr: string;
  tooltip_file: string;
  starter_prompt_plan: string;
  starter_prompt_arch: string;
  rest_hub_status_online: string;

  // Landing Page Hero & Main
  hero_title_1: string;
  hero_title_2: string;
  hero_subtitle: string;
  hero_cta_start: string;
  hero_cta_demo: string;
  hero_badge_bypass: string;
  login_btn: string;
  features_title: string;
  features_desc: string;
  auth_login_tab: string;
  auth_register_tab: string;
  auth_demo_button: string;

  // Terminal Preview
  terminal_caddy_status: string;
  terminal_tls: string;
  terminal_card1_title: string;
  terminal_card1_desc: string;
  terminal_card1_status: string;
  terminal_card2_title: string;
  terminal_card2_desc: string;
  terminal_card2_status: string;
  terminal_card3_title: string;
  terminal_card3_desc: string;
  terminal_card3_status: string;
  terminal_card3_sub: string;

  // Features 4 pillars
  feature_1_title: string;
  feature_1_desc: string;
  feature_1_badge: string;
  feature_2_title: string;
  feature_2_desc: string;
  feature_2_badge: string;
  feature_3_title: string;
  feature_3_desc: string;
  feature_3_badge: string;
  feature_4_title: string;
  feature_4_desc: string;
  feature_4_badge: string;

  // Landing Footer
  landing_footer_tech: string;
  landing_footer_config: string;
  landing_footer_goto_chat: string;

  // Auth Modal
  auth_modal_badge: string;
  auth_modal_title_login: string;
  auth_modal_title_register: string;
  auth_modal_subtitle: string;
  auth_email_label: string;
  auth_password_label: string;
  auth_forgot_pass: string;
  auth_remember_key: string;
  auth_close_title: string;

  // Note Modal
  note_save_btn: string;
  note_edit_btn: string;
  note_synced: string;

  // Multimodal Modal - Voice
  voice_modal_title: string;
  voice_modal_desc: string;
  voice_ready: string;
  voice_recorded: string;
  voice_listening: string;
  voice_tap_to_start: string;
  voice_processing: string;
  voice_result_label: string;
  voice_btn_stop: string;
  voice_btn_rerecord: string;
  voice_btn_send: string;
  voice_btn_start: string;

  // Multimodal Modal - OCR
  ocr_modal_title: string;
  ocr_modal_desc: string;
  ocr_type_book: string;
  ocr_type_receipt: string;
  ocr_type_notes: string;
  ocr_camera_aimed: string;
  ocr_camera_specs: string;
  ocr_result_label: string;
  ocr_scanning: string;
  ocr_btn_capture: string;
  ocr_btn_retry: string;
  ocr_btn_send: string;
}

export const TRANSLATIONS: Record<AppLanguage, Translations> = {
  ru: {
    back_to_chat: '← Назад в чат',
    landing_btn: '← Лендинг',
    settings_title: 'Настройки системы',
    settings_btn: 'Настройки системы (/settings)',
    online_status: 'Режим: Online (REST Hub)',
    offline_status: 'Режим: Offline (SQLite Queue)',

    appearance_section_title: 'Внешний вид и локализация',
    appearance_section_desc: 'Выбор цветовой палитры интерфейса и языка приложения',
    theme_label: 'Тема оформления',
    theme_light_name: 'Светлая (Light)',
    theme_light_desc: 'Мягкий контраст для дневной работы',
    theme_dark_name: 'Obsidian Dark',
    theme_dark_desc: 'Фирменная графитовая палитра',
    theme_oled_name: 'OLED / True Black',
    theme_oled_desc: 'Глубокий чёрный #000000 для OLED',
    lang_label: 'Язык интерфейса',
    lang_ru: 'Русский',
    lang_uk: 'Українська',
    lang_en: 'English',

    rest_hub_title: 'Obsidian Local REST API Hub',
    rest_hub_desc: 'Параметры соединения с headless-контейнером Obsidian на домашнем сервере',
    ping_btn: 'Проверить пинг',
    ping_ok: 'REST Hub: Online',
    server_url_label: 'Server URL / Tailscale Domain',
    server_port_label: 'Внутренний порт Local REST API',
    token_label: 'Токен авторизации (OBSIDIAN_API_KEY)',
    caddy_active: 'Active (Valid TLS)',
    caddy_desc: 'Проксирует :443 → :27124 (Strict Fetch CORS)',

    byok_title: 'BYOK Провайдеры (Bring Your Own Key)',
    byok_desc: 'Прямой доступ к LLM, Groq Whisper STT и Vision моделям без подписок',

    offline_queue_title: 'Офлайн-очередь: Монитор задач SQLite (op-sqlite)',
    offline_queue_desc: 'Двухстадийный буфер надежности: RAW_EXTRACT (аудио/фото) и READY_FOR_VAULT (операции)',
    clear_completed_btn: 'Очистить завершенные',
    sync_btn: 'Синхронизировать',
    secure_store_title: 'Защищенное хранение ключей',
    secure_store_desc: 'Настройки шифруются в Secure Store устройства (iOS Keychain / Android Keystore / Web Crypto API). Прямое соединение без промежуточных серверов.',

    table_col_id: 'ID',
    table_col_stage: 'СТАДИЯ',
    table_col_action: 'ДЕЙСТВИЕ',
    table_col_target: 'ЦЕЛЬ',
    table_col_status: 'СТАТУС',
    table_col_operations: 'ДЕЙСТВИЕ',

    new_chat: 'Новый диалог',
    chat_history: 'История диалогов',
    today: 'Сегодня',
    yesterday: 'Вчера',
    past7days: 'Прошлые 7 дней',
    quick_vault_title: 'Быстрый доступ к Vault',
    empty_title: 'Чем могу помочь сегодня?',
    empty_desc: 'Ассистент подключен к домашнему серверу Obsidian REST Hub (:27124). Напишите запрос, воспользуйтесь голосовым вводом или выберите готовый сценарий:',
    prompt_plan_title: 'Спланировать задачи на день',
    prompt_plan_desc: 'Синтезирует контекст из [[Daily/2026-09-27.md]] и составит список с приоритетами ⏫ и датами Tasks.',
    prompt_voice_title: 'Записать голосовую заметку (STT)',
    prompt_voice_desc: 'Мгновенная транскрипция через Groq Whisper (< 1 с) и сохранение в [[Inbox/Quick_Memos.md]].',
    prompt_ocr_title: 'Распознать документ (OCR)',
    prompt_ocr_desc: 'ML Kit оцифровка текста из книг, чеков и накладных с автоматическим YAML Frontmatter.',
    prompt_arch_title: 'Исследовать структуру Vault',
    prompt_arch_desc: 'Семантический поиск по проектам через Local REST API и проверка Syncthing-синхронизации.',
    input_placeholder: "Спроси ассистента или напиши 'Спланируй задачи на день'...",
    voice_btn: 'Голос',
    recording_now: 'Запись звука',
    stop_transcribe_btn: 'Остановить и транскрибировать',
    ocr_btn: 'OCR',
    file_btn: 'Файл',
    send_btn: 'Отправить',

    tools_used: 'Использовано инструментов:',
    tools_executed: 'Выполнено',
    tools_files_in_req: 'Файлы в запросе:',
    tools_preview_note: 'Открыть предпросмотр заметки',
    tools_params: 'Параметры:',
    tools_result: 'Результат:',

    sender_user: 'Пользователь',
    sender_assistant: 'Obsidian ReAct Hub',
    agent_thinking: 'ReAct Цикл рассуждения: планирование вызовов...',
    agent_calling_api: 'Обращение к Obsidian Local REST API (:27124)...',
    priority_high: '⏫ Высокий',
    priority_medium: '🔼 Средний',
    priority_low: '🔽 Низкий',
    sidebar_toggle_hide: 'Скрыть шторку',
    sidebar_toggle_show: 'Открыть шторку',
    tooltip_voice: 'Голосовой ввод (Groq Whisper STT)',
    tooltip_ocr: 'OCR сканирование документов (ML Kit)',
    tooltip_file: 'Прикрепить файл к сообщению',
    starter_prompt_plan: 'Спланируй задачи на день на основе вчерашних итогов',
    starter_prompt_arch: 'Какая архитектура у Obsidian REST Hub?',
    rest_hub_status_online: 'REST Hub: Online',

    hero_title_1: 'Obsidian AI Hub &',
    hero_title_2: 'Knowledge Manager',
    hero_subtitle: 'Автономная оцифровка заметок, голосовых файлов (Groq Whisper) и OCR документов. Интеллектуальное управление персональным хранилищем через Obsidian Local REST API без сторонних облаков.',
    hero_cta_start: 'Начать работу',
    hero_cta_demo: 'Открыть ассистент (Демо)',
    hero_badge_bypass: 'Демо-обход (Гость)',
    login_btn: 'Войти',
    features_title: 'Ключевые преимущества архитектуры',
    features_desc: 'Спроектировано в строгом соответствии с концепцией локальной независимости и максимальной скорости отклика.',
    auth_login_tab: 'Вход',
    auth_register_tab: 'Регистрация',
    auth_demo_button: 'Войти в демо-режиме →',

    terminal_caddy_status: 'docker-compose.yml • vault-caddy:443',
    terminal_tls: 'TLS: Tailscale HTTPS Active',
    terminal_card1_title: 'Obsidian Local REST API',
    terminal_card1_desc: 'Слушает порт :27124',
    terminal_card1_status: '✓ Xvfb Headless Server',
    terminal_card2_title: 'ReAct AI Cycle',
    terminal_card2_desc: 'Gemini 2.0 / Groq STT',
    terminal_card2_status: '✓ manage_daily_plan',
    terminal_card3_title: 'SQLite Fault-Tolerance',
    terminal_card3_desc: 'op-sqlite Offline Queue',
    terminal_card3_status: '✓ RAW_EXTRACT / READY',
    terminal_card3_sub: 'Zero-loss sync worker',

    feature_1_title: '24/7 Single Source of Truth',
    feature_1_desc: 'Локальный REST API на домашнем сервере без промежуточных облаков. Прямое защищенное взаимодействие через доверенный TLS-прокси Caddy.',
    feature_1_badge: 'Zero Cloud Lock-in',
    feature_2_title: 'Мультимодальный захват',
    feature_2_desc: 'Мгновенное распознавание речи через Groq Whisper STT (< 1 с), OCR печатного текста, книг и чеков через ML Kit прямо на устройстве.',
    feature_2_badge: 'Groq STT & ML Kit OCR',
    feature_3_title: 'ReAct AI-агент',
    feature_3_desc: 'Интеллектуальный цикл планирования задач, поиска контекста по Vault, ведения Obsidian Tasks с приоритетами (⏫, 🔼) и датами дедлайнов.',
    feature_3_badge: 'Tool Calling Loop',
    feature_4_title: 'Локальная надежность (BYOK)',
    feature_4_desc: 'Прямые пользовательские API-ключи в Secure Store смартфона и отказоустойчивая двухстадийная очередь SQLite (RAW_EXTRACT / READY_FOR_VAULT).',
    feature_4_badge: 'SQLite Fault-Tolerant',

    landing_footer_tech: 'Obsidian AI Hub v3.0 • Self-Hosted Hybrid Architecture',
    landing_footer_config: 'Конфигурация REST Hub',
    landing_footer_goto_chat: 'Перейти в /chat',

    auth_modal_badge: 'Безопасный доступ к Vault',
    auth_modal_title_login: 'Вход в ассистент',
    auth_modal_title_register: 'Создать аккаунт',
    auth_modal_subtitle: 'Подключение к домашнему узлу REST Hub (:27124)',
    auth_email_label: 'Email / Локальный идентификатор',
    auth_password_label: 'Мастер-пароль шифрования',
    auth_forgot_pass: 'Забыли?',
    auth_remember_key: 'Запомнить ключ в Secure Store',
    auth_close_title: 'Закрыть окно',

    note_save_btn: 'Сохранить',
    note_edit_btn: 'Редактировать',
    note_synced: 'Obsidian Local REST API • Синхронизировано',

    voice_modal_title: 'Голосовой инбокс и диктовка',
    voice_modal_desc: 'Запись 16 kHz Mono AAC с мгновенной транскрипцией за < 1 с',
    voice_ready: 'Готов к записи',
    voice_recorded: 'Записано',
    voice_listening: 'Слушаю речь... Нажмите "Остановить" для STT',
    voice_tap_to_start: 'Нажмите кнопку микрофона для старта',
    voice_processing: 'Обработка в Groq Whisper API (whisper-large-v3)...',
    voice_result_label: 'Результат STT:',
    voice_btn_stop: 'Остановить запись',
    voice_btn_rerecord: 'Перезаписать',
    voice_btn_send: 'Отправить в чат ассистенту',
    voice_btn_start: 'Начать запись голоса',

    ocr_modal_title: 'Мультимодальный OCR документов',
    ocr_modal_desc: 'Сканирование печатных книг, накладных и заметок с конвертацией в Markdown',
    ocr_type_book: '📖 Страница книги',
    ocr_type_receipt: '🧾 Чек / Накладная',
    ocr_type_notes: '📝 Рукописный лист',
    ocr_camera_aimed: 'Камера направлена на документ',
    ocr_camera_specs: 'Авто-фокус • Разрешение 1920x1080',
    ocr_result_label: 'Распознанный текст:',
    ocr_scanning: 'Распознавание...',
    ocr_btn_capture: 'Сделать снимок и распознать (OCR)',
    ocr_btn_retry: 'Повторить',
    ocr_btn_send: 'Отправить в чат'
  },

  uk: {
    back_to_chat: '← Назад до чату',
    landing_btn: '← Лендінг',
    settings_title: 'Налаштування системи',
    settings_btn: 'Налаштування системи (/settings)',
    online_status: 'Режим: Online (REST Hub)',
    offline_status: 'Режим: Offline (SQLite Queue)',

    appearance_section_title: 'Зовнішній вигляд та локалізація',
    appearance_section_desc: 'Вибір колірної палітри інтерфейсу та мови застосунку',
    theme_label: 'Тема оформлення',
    theme_light_name: 'Світла (Light)',
    theme_light_desc: "М'який контраст для денної роботи",
    theme_dark_name: 'Obsidian Dark',
    theme_dark_desc: 'Фірмова графітова палітра',
    theme_oled_name: 'OLED / True Black',
    theme_oled_desc: 'Глибокий чорний #000000 для OLED',
    lang_label: 'Мова інтерфейсу',
    lang_ru: 'Русский',
    lang_uk: 'Українська',
    lang_en: 'English',

    rest_hub_title: 'Obsidian Local REST API Hub',
    rest_hub_desc: "Параметри з'єднання з headless-контейнером Obsidian на домашньому сервері",
    ping_btn: 'Перевірити пінг',
    ping_ok: 'REST Hub: Online',
    server_url_label: 'Server URL / Tailscale Domain',
    server_port_label: 'Внутрішній порт Local REST API',
    token_label: 'Токен авторизації (OBSIDIAN_API_KEY)',
    caddy_active: 'Active (Valid TLS)',
    caddy_desc: 'Проксіює :443 → :27124 (Strict Fetch CORS)',

    byok_title: 'BYOK Провайдери (Bring Your Own Key)',
    byok_desc: 'Прямий доступ до LLM, Groq Whisper STT та Vision моделей без підписок',

    offline_queue_title: 'Офлайн-черга: Монітор задач SQLite (op-sqlite)',
    offline_queue_desc: 'Двостадійний буфер надійності: RAW_EXTRACT (аудіо/фото) та READY_FOR_VAULT (операції)',
    clear_completed_btn: 'Очистити завершені',
    sync_btn: 'Синхронізувати',
    secure_store_title: 'Захищене збереження ключів',
    secure_store_desc: 'Налаштування шифруються в Secure Store пристрою (iOS Keychain / Android Keystore / Web Crypto API). Пряме з’єднання без сторонніх серверів.',

    table_col_id: 'ID',
    table_col_stage: 'СТАДІЯ',
    table_col_action: 'ДІЯ',
    table_col_target: 'ЦІЛЬ',
    table_col_status: 'СТАТУС',
    table_col_operations: 'ДІЯ',

    new_chat: 'Новий діалог',
    chat_history: 'Історія діалогів',
    today: 'Сьогодні',
    yesterday: 'Вчора',
    past7days: 'Минулі 7 днів',
    quick_vault_title: 'Швидкий доступ до Vault',
    empty_title: 'Чим можу допомогти сьогодні?',
    empty_desc: 'Асистент підключений до домашнього сервера Obsidian REST Hub (:27124). Напишіть запит, скористайтеся голосовим вводом або оберіть готовий сценарій:',
    prompt_plan_title: 'Спланувати завдання на день',
    prompt_plan_desc: 'Синтезує контекст із [[Daily/2026-09-27.md]] та створить перелік з пріоритетами ⏫ і датами Tasks.',
    prompt_voice_title: 'Записати голосову нотатку (STT)',
    prompt_voice_desc: 'Миттєва транскрипція через Groq Whisper (< 1 с) та збереження до [[Inbox/Quick_Memos.md]].',
    prompt_ocr_title: 'Розпізнати документ (OCR)',
    prompt_ocr_desc: 'ML Kit оцифрування тексту з книг, чеків та накладних із автоматичним YAML Frontmatter.',
    prompt_arch_title: 'Дослідити структуру Vault',
    prompt_arch_desc: 'Семантичний пошук по проєктах через Local REST API та перевірка Syncthing-синхронізації.',
    input_placeholder: "Запитай асистента або напиши 'Сплануй завдання на день'...",
    voice_btn: 'Голос',
    recording_now: 'Запис звуку',
    stop_transcribe_btn: 'Зупинити та транскрибувати',
    ocr_btn: 'OCR',
    file_btn: 'Файл',
    send_btn: 'Надіслати',

    tools_used: 'Використано інструментів:',
    tools_executed: 'Виконано',
    tools_files_in_req: 'Файли у запиті:',
    tools_preview_note: 'Відкрити попередній перегляд нотатки',
    tools_params: 'Параметри:',
    tools_result: 'Результат:',

    sender_user: 'Користувач',
    sender_assistant: 'Obsidian ReAct Hub',
    agent_thinking: 'ReAct Цикл міркування: планування викликів...',
    agent_calling_api: 'Звернення до Obsidian Local REST API (:27124)...',
    priority_high: '⏫ Високий',
    priority_medium: '🔼 Середній',
    priority_low: '🔽 Низький',
    sidebar_toggle_hide: 'Приховати бічну панель',
    sidebar_toggle_show: 'Показати бічну панель',
    tooltip_voice: 'Голосове введення (Groq Whisper STT)',
    tooltip_ocr: 'OCR сканування документів (ML Kit)',
    tooltip_file: 'Прикріпити файл до повідомлення',
    starter_prompt_plan: 'Сплануй завдання на день на основі вчорашніх підсумків',
    starter_prompt_arch: 'Яка архітектура в Obsidian REST Hub?',
    rest_hub_status_online: 'REST Hub: Online',

    hero_title_1: 'Obsidian AI Hub &',
    hero_title_2: 'Knowledge Manager',
    hero_subtitle: 'Автономне оцифрування нотаток, голосових записів (Groq Whisper) та OCR документів. Інтелектуальне керування персональним сховищем через Obsidian Local REST API без сторонніх хмар.',
    hero_cta_start: 'Почати роботу',
    hero_cta_demo: 'Відкрити асистент (Демо)',
    hero_badge_bypass: 'Демо-обхід (Гість)',
    login_btn: 'Увійти',
    features_title: 'Ключові переваги архітектури',
    features_desc: 'Спроєктовано у суворій відповідності з концепцією локальної незалежності та максимальної швидкості відгуку.',
    auth_login_tab: 'Вхід',
    auth_register_tab: 'Реєстрація',
    auth_demo_button: 'Увійти в демо-режимі →',

    terminal_caddy_status: 'docker-compose.yml • vault-caddy:443',
    terminal_tls: 'TLS: Tailscale HTTPS Active',
    terminal_card1_title: 'Obsidian Local REST API',
    terminal_card1_desc: 'Слухає порт :27124',
    terminal_card1_status: '✓ Xvfb Headless Server',
    terminal_card2_title: 'ReAct AI Cycle',
    terminal_card2_desc: 'Gemini 2.0 / Groq STT',
    terminal_card2_status: '✓ manage_daily_plan',
    terminal_card3_title: 'SQLite Fault-Tolerance',
    terminal_card3_desc: 'op-sqlite Offline Queue',
    terminal_card3_status: '✓ RAW_EXTRACT / READY',
    terminal_card3_sub: 'Zero-loss sync worker',

    feature_1_title: '24/7 Single Source of Truth',
    feature_1_desc: 'Локальний REST API на домашньому сервері без посередницьких хмар. Пряма захищена взаємодія через довірений TLS-проксі Caddy.',
    feature_1_badge: 'Zero Cloud Lock-in',
    feature_2_title: 'Мультимодальне захоплення',
    feature_2_desc: 'Миттєве розпізнавання мови через Groq Whisper STT (< 1 с), OCR друкованого тексту, книг та чеків через ML Kit безпосередньо на пристрої.',
    feature_2_badge: 'Groq STT & ML Kit OCR',
    feature_3_title: 'ReAct AI-агент',
    feature_3_desc: 'Інтелектуальний цикл планування завдань, пошуку контексту у Vault, ведення Obsidian Tasks із пріоритетами (⏫, 🔼) та дедлайнами.',
    feature_3_badge: 'Tool Calling Loop',
    feature_4_title: 'Локальна надійність (BYOK)',
    feature_4_desc: 'Прямі персональні API-ключі у Secure Store смартфона та відмовостійка двостадійна черга SQLite (RAW_EXTRACT / READY_FOR_VAULT).',
    feature_4_badge: 'SQLite Fault-Tolerant',

    landing_footer_tech: 'Obsidian AI Hub v3.0 • Self-Hosted Hybrid Architecture',
    landing_footer_config: 'Конфігурація REST Hub',
    landing_footer_goto_chat: 'Перейти до /chat',

    auth_modal_badge: 'Безпечний доступ до Vault',
    auth_modal_title_login: 'Вхід в асистент',
    auth_modal_title_register: 'Створити акаунт',
    auth_modal_subtitle: 'Підключення до домашнього вузла REST Hub (:27124)',
    auth_email_label: 'Email / Локальний ідентифікатор',
    auth_password_label: 'Майстер-пароль шифрування',
    auth_forgot_pass: 'Забули?',
    auth_remember_key: "Запам'ятати ключ у Secure Store",
    auth_close_title: 'Закрити вікно',

    note_save_btn: 'Зберегти',
    note_edit_btn: 'Редагувати',
    note_synced: 'Obsidian Local REST API • Синхронізовано',

    voice_modal_title: 'Голосовий інбокс та диктовка',
    voice_modal_desc: 'Запис 16 kHz Mono AAC із миттєвою транскрипцією за < 1 с',
    voice_ready: 'Готовий до запису',
    voice_recorded: 'Записано',
    voice_listening: 'Слухаю мовлення... Натисніть "Зупинити" для STT',
    voice_tap_to_start: 'Натисніть кнопку мікрофона для старту',
    voice_processing: 'Обробка у Groq Whisper API (whisper-large-v3)...',
    voice_result_label: 'Результат STT:',
    voice_btn_stop: 'Зупинити запис',
    voice_btn_rerecord: 'Перезаписати',
    voice_btn_send: 'Надіслати до чату асистенту',
    voice_btn_start: 'Почати запис голосу',

    ocr_modal_title: 'Мультимодальний OCR документів',
    ocr_modal_desc: 'Сканування друкованих книг, накладних та нотаток із конвертацією в Markdown',
    ocr_type_book: '📖 Сторінка книги',
    ocr_type_receipt: '🧾 Чек / Накладна',
    ocr_type_notes: '📝 Рукописний аркуш',
    ocr_camera_aimed: 'Камера спрямована на документ',
    ocr_camera_specs: 'Авто-фокус • Роздільна здатність 1920x1080',
    ocr_result_label: 'Розпізнаний текст:',
    ocr_scanning: 'Розпізнавання...',
    ocr_btn_capture: 'Зробити знімок та розпізнати (OCR)',
    ocr_btn_retry: 'Повторити',
    ocr_btn_send: 'Надіслати до чату'
  },

  en: {
    back_to_chat: '← Back to Chat',
    landing_btn: '← Landing',
    settings_title: 'System Settings',
    settings_btn: 'System Settings (/settings)',
    online_status: 'Mode: Online (REST Hub)',
    offline_status: 'Mode: Offline (SQLite Queue)',

    appearance_section_title: 'Appearance & Localization',
    appearance_section_desc: 'Customize user interface theme and application language',
    theme_label: 'Theme Selection',
    theme_light_name: 'Light',
    theme_light_desc: 'Clean soft contrast for daytime work',
    theme_dark_name: 'Obsidian Dark',
    theme_dark_desc: 'Signature graphite color palette',
    theme_oled_name: 'OLED / True Black',
    theme_oled_desc: 'Pure pitch black #000000 for OLED',
    lang_label: 'Interface Language',
    lang_ru: 'Русский',
    lang_uk: 'Українська',
    lang_en: 'English',

    rest_hub_title: 'Obsidian Local REST API Hub',
    rest_hub_desc: 'Connection parameters for headless Obsidian container on local server',
    ping_btn: 'Check Ping',
    ping_ok: 'REST Hub: Online',
    server_url_label: 'Server URL / Tailscale Domain',
    server_port_label: 'Local REST API Internal Port',
    token_label: 'Authorization Token (OBSIDIAN_API_KEY)',
    caddy_active: 'Active (Valid TLS)',
    caddy_desc: 'Proxies :443 → :27124 (Strict Fetch CORS)',

    byok_title: 'BYOK Providers (Bring Your Own Key)',
    byok_desc: 'Direct access to LLM, Groq Whisper STT, and Vision models without subscriptions',

    offline_queue_title: 'Offline Queue: SQLite Job Monitor (op-sqlite)',
    offline_queue_desc: 'Two-stage fault-tolerant buffer: RAW_EXTRACT (audio/photo) & READY_FOR_VAULT (operations)',
    clear_completed_btn: 'Clear Completed',
    sync_btn: 'Sync Now',
    secure_store_title: 'Hardware Keystore Security',
    secure_store_desc: 'Settings encrypted in device Secure Store (iOS Keychain / Android Keystore / Web Crypto API). Zero intermediate cloud proxying.',

    table_col_id: 'ID',
    table_col_stage: 'STAGE',
    table_col_action: 'ACTION',
    table_col_target: 'TARGET',
    table_col_status: 'STATUS',
    table_col_operations: 'ACTION',

    new_chat: 'New Chat',
    chat_history: 'Chat History',
    today: 'Today',
    yesterday: 'Yesterday',
    past7days: 'Past 7 Days',
    quick_vault_title: 'Quick Vault Access',
    empty_title: 'How can I assist you today?',
    empty_desc: 'Assistant connected to local Obsidian REST Hub (:27124). Type a message, record voice, or choose a workflow template:',
    prompt_plan_title: 'Plan Daily Schedule',
    prompt_plan_desc: 'Synthesizes context from [[Daily/2026-09-27.md]] and generates prioritized Tasks ⏫ with deadlines.',
    prompt_voice_title: 'Record Voice Memo (STT)',
    prompt_voice_desc: 'Instant transcription with Groq Whisper (< 1s) and appends directly to [[Inbox/Quick_Memos.md]].',
    prompt_ocr_title: 'Scan Document (OCR)',
    prompt_ocr_desc: 'ML Kit on-device extraction from books, receipts, and invoices with structured YAML frontmatter.',
    prompt_arch_title: 'Explore Vault Structure',
    prompt_arch_desc: 'Semantic search across project files via Local REST API and verify Syncthing sync status.',
    input_placeholder: "Ask assistant or type 'Plan daily schedule'...",
    voice_btn: 'Voice',
    recording_now: 'Audio Recording',
    stop_transcribe_btn: 'Stop and Transcribe',
    ocr_btn: 'OCR',
    file_btn: 'File',
    send_btn: 'Send',

    tools_used: 'Tools used:',
    tools_executed: 'Completed',
    tools_files_in_req: 'Files in request:',
    tools_preview_note: 'Open note preview',
    tools_params: 'Parameters:',
    tools_result: 'Result:',

    sender_user: 'User',
    sender_assistant: 'Obsidian ReAct Hub',
    agent_thinking: 'ReAct Reasoning Cycle: planning tool calls...',
    agent_calling_api: 'Querying Obsidian Local REST API (:27124)...',
    priority_high: '⏫ High',
    priority_medium: '🔼 Medium',
    priority_low: '🔽 Low',
    sidebar_toggle_hide: 'Hide sidebar',
    sidebar_toggle_show: 'Show sidebar',
    tooltip_voice: 'Voice Input (Groq Whisper STT)',
    tooltip_ocr: 'Document OCR (ML Kit)',
    tooltip_file: 'Attach file to message',
    starter_prompt_plan: 'Plan today\'s tasks based on yesterday\'s summary',
    starter_prompt_arch: 'What is the architecture of Obsidian REST Hub?',
    rest_hub_status_online: 'REST Hub: Online',

    hero_title_1: 'Obsidian AI Hub &',
    hero_title_2: 'Knowledge Manager',
    hero_subtitle: 'Autonomous digitization of notes, audio memos (Groq Whisper), and document OCR. Direct vault management via Obsidian Local REST API without intermediate clouds.',
    hero_cta_start: 'Get Started',
    hero_cta_demo: 'Open Assistant (Demo)',
    hero_badge_bypass: 'Guest Demo',
    login_btn: 'Sign In',
    features_title: 'Core Architectural Tenets',
    features_desc: 'Engineered for zero-intermediate telemetry, on-device resilience, and ultra-fast sub-second latency.',
    auth_login_tab: 'Sign In',
    auth_register_tab: 'Register',
    auth_demo_button: 'Enter Demo Mode →',

    terminal_caddy_status: 'docker-compose.yml • vault-caddy:443',
    terminal_tls: 'TLS: Tailscale HTTPS Active',
    terminal_card1_title: 'Obsidian Local REST API',
    terminal_card1_desc: 'Listening on port :27124',
    terminal_card1_status: '✓ Xvfb Headless Server',
    terminal_card2_title: 'ReAct AI Cycle',
    terminal_card2_desc: 'Gemini 2.0 / Groq STT',
    terminal_card2_status: '✓ manage_daily_plan',
    terminal_card3_title: 'SQLite Fault-Tolerance',
    terminal_card3_desc: 'op-sqlite Offline Queue',
    terminal_card3_status: '✓ RAW_EXTRACT / READY',
    terminal_card3_sub: 'Zero-loss sync worker',

    feature_1_title: '24/7 Single Source of Truth',
    feature_1_desc: 'Self-hosted REST API on local server without intermediate clouds. Direct encrypted communication via trusted Caddy TLS reverse proxy.',
    feature_1_badge: 'Zero Cloud Lock-in',
    feature_2_title: 'Multimodal Capture',
    feature_2_desc: 'Sub-second speech recognition via Groq Whisper STT (< 1s), on-device OCR for books, receipts, and invoices via ML Kit.',
    feature_2_badge: 'Groq STT & ML Kit OCR',
    feature_3_title: 'ReAct AI Agent',
    feature_3_desc: 'Autonomous daily planning loop, vault semantic search, and Obsidian Tasks management with priority badges (⏫, 🔼) and deadlines.',
    feature_3_badge: 'Tool Calling Loop',
    feature_4_title: 'Local Resilience (BYOK)',
    feature_4_desc: 'Direct user API keys protected in smartphone Secure Store and two-stage fault-tolerant SQLite queue (RAW_EXTRACT / READY_FOR_VAULT).',
    feature_4_badge: 'SQLite Fault-Tolerant',

    landing_footer_tech: 'Obsidian AI Hub v3.0 • Self-Hosted Hybrid Architecture',
    landing_footer_config: 'REST Hub Configuration',
    landing_footer_goto_chat: 'Go to /chat',

    auth_modal_badge: 'Secure Vault Access',
    auth_modal_title_login: 'Sign In to Assistant',
    auth_modal_title_register: 'Create Account',
    auth_modal_subtitle: 'Connecting to Local REST Hub Node (:27124)',
    auth_email_label: 'Email / Local Identifier',
    auth_password_label: 'Master Encryption Password',
    auth_forgot_pass: 'Forgot?',
    auth_remember_key: 'Remember key in Secure Store',
    auth_close_title: 'Close window',

    note_save_btn: 'Save',
    note_edit_btn: 'Edit',
    note_synced: 'Obsidian Local REST API • Synchronized',

    voice_modal_title: 'Voice Inbox & Dictation',
    voice_modal_desc: '16 kHz Mono AAC recording with sub-second transcription (< 1s)',
    voice_ready: 'Ready to record',
    voice_recorded: 'Recorded',
    voice_listening: 'Listening... Press "Stop" for STT',
    voice_tap_to_start: 'Tap microphone to start',
    voice_processing: 'Processing with Groq Whisper API (whisper-large-v3)...',
    voice_result_label: 'STT Result:',
    voice_btn_stop: 'Stop Recording',
    voice_btn_rerecord: 'Re-record',
    voice_btn_send: 'Send to Assistant Chat',
    voice_btn_start: 'Start Voice Recording',

    ocr_modal_title: 'Multimodal Document OCR',
    ocr_modal_desc: 'Scan printed books, invoices, and handwritten notes into Markdown',
    ocr_type_book: '📖 Book Page',
    ocr_type_receipt: '🧾 Receipt / Invoice',
    ocr_type_notes: '📝 Handwritten Sheet',
    ocr_camera_aimed: 'Camera pointed at document',
    ocr_camera_specs: 'Auto-focus • 1920x1080 Resolution',
    ocr_result_label: 'Extracted Text:',
    ocr_scanning: 'Scanning & Extracting...',
    ocr_btn_capture: 'Capture & Extract (OCR)',
    ocr_btn_retry: 'Retry',
    ocr_btn_send: 'Send to Chat'
  }
};
