import { AppTheme, AppLanguage } from '../i18n/translations';

export type AppRoute = '/' | '/chat' | '/settings';

export interface ToolCall {
  id: string;
  name: 'search_vault' | 'read_note' | 'manage_daily_plan' | 'update_task_status' | 'create_note' | 'append_to_note' | 'groq_whisper_stt' | 'mlkit_ocr_extract' | string;
  parameters: Record<string, any>;
  result?: any;
  status: 'running' | 'completed' | 'failed';
  timestamp: string;
}

export interface MessageAttachment {
  name: string;
  type: 'image' | 'audio' | 'document' | 'file';
  size?: string;
  previewUrl?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  toolCalls?: ToolCall[];
  attachments?: MessageAttachment[];
}

export interface ChatSession {
  id: string;
  title: string;
  dateGroup: 'today' | 'yesterday' | 'past7days' | 'older';
  createdAt: string;
  messages: ChatMessage[];
}

export interface VaultNote {
  path: string;
  title: string;
  content: string;
  frontmatter: Record<string, any>;
  lastModified: string;
}

export interface TaskItem {
  id: string;
  text: string;
  isCompleted: boolean;
  priority: 'high' | 'medium' | 'low' | 'none';
  dueDate?: string;
  sourceNote?: string;
  tags?: string[];
}

export interface SQLiteJob {
  id: string;
  pipeline_stage: 'RAW_EXTRACT' | 'READY_FOR_VAULT';
  action_type: 'VOICE_MEMO' | 'OCR_SCAN' | 'AI_COMMAND' | 'MANAGE_DAILY';
  local_file_path?: string;
  target_path: string;
  payload: string;
  retry_count: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error_message?: string;
  created_at: number;
  updated_at: number;
}

export interface AppSettings {
  serverUrl: string;
  serverPort: number;
  obsidianApiKey: string;
  caddyStatus: 'active' | 'offline' | 'validating';
  caddyDomain: string;
  groqApiKey: string;
  openaiApiKey: string;
  geminiApiKey: string;
  offlineMode: boolean;
  theme: AppTheme;
  language: AppLanguage;
}
