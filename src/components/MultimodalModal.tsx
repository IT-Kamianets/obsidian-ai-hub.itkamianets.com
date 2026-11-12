import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Mic, 
  Square, 
  Camera, 
  Upload, 
  CheckCircle2, 
  Sparkles, 
  Volume2, 
  FileText, 
  RotateCcw,
  Send,
  Zap
} from 'lucide-react';

export const MultimodalModal: React.FC = () => {
  const { multimodalModal, setMultimodalModal, sendMessage, showToast, t } = useApp();

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);

  // Camera OCR state
  const [selectedDocType, setSelectedDocType] = useState<'receipt' | 'book' | 'notes'>('book');
  const [ocrText, setOcrText] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  // Timer for recording
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordSeconds((s) => s + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  if (!multimodalModal) return null;

  const handleStartVoice = () => {
    setIsRecording(true);
    setRecordSeconds(0);
    setVoiceTranscript('');
  };

  const handleStopVoice = () => {
    setIsRecording(false);
    setIsTranscribing(true);

    setTimeout(() => {
      setIsTranscribing(false);
      const sampleTranscripts = [
        'Спланируй задачи на день: нужно завершить тестирование локального REST API на порту 27124 и синхронизировать хранилище с Syncthing.',
        'Добавить идею в Inbox: рассмотреть возможность автоматической классификации входящих OCR заметок по YAML тегам.',
        'Напомнить завтра в 10:00 проверить Caddy TLS сертификат и статус фонового воркера SQLite.'
      ];
      const randomText = sampleTranscripts[Math.floor(Math.random() * sampleTranscripts.length)];
      setVoiceTranscript(randomText);
      showToast('Groq Whisper STT: Аудио расшифровано за 0.7с', 'success', 'whisper-large-v3 model');
    }, 900);
  };

  const handleSendVoiceToChat = () => {
    if (!voiceTranscript) return;
    sendMessage(voiceTranscript, [
      { name: `memo_${recordSeconds || 12}s.m4a`, type: 'audio', size: '184 KB' }
    ]);
    setMultimodalModal(null);
  };

  const handleRunOcr = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      if (selectedDocType === 'book') {
        setOcrText(`Книга: "Архитектура распределенных систем знаний"
Глава 4. Локальные хранилища и семантические графы.
"Каждая заметка должна иметь неизменяемый идентификатор и строгий YAML frontmatter для индексации плагином Dataview..."`);
      } else if (selectedDocType === 'receipt') {
        setOcrText(`ФИСКАЛЬНЫЙ ЧЕК #88419
Устройство: Mini PC N100 16GB RAM
Сумма: 18,400 UAH
Гарантия: 24 месяца
Категория: hardware/server-24-7`);
      } else {
        setOcrText(`Рукописная заметка:
- Реализовать ReAct loop с AGENT_TOOLS
- Поддержка синтаксиса Obsidian Tasks: - [ ] ⏫ 📅
- Исключить workspace.json через .stignore`);
      }
      showToast('ML Kit OCR: Текст извлечен с точностью 99.2%', 'success');
    }, 850);
  };

  const handleSendOcrToChat = () => {
    if (!ocrText) return;
    sendMessage(`Оцифрованный документ (${selectedDocType}):\n\n${ocrText}`, [
      { name: `scan_${selectedDocType}.jpg`, type: 'image', size: '1.2 MB' }
    ]);
    setMultimodalModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-6 overflow-hidden text-left transition-colors">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => setMultimodalModal(null)}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-100 flex items-center justify-center border border-zinc-200 dark:border-zinc-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* VOICE MODAL */}
        {multimodalModal === 'voice' && (
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-zinc-500 mb-2">
              <Zap className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
              <span>Groq Whisper Cloud STT (whisper-large-v3)</span>
            </div>
            <h3 className="text-xl font-bold text-zinc-950 dark:text-zinc-50 mb-1">
              {t.voice_modal_title}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6">
              {t.voice_modal_desc}
            </p>

            {/* Audio Wave Visualizer Area */}
            <div className="py-8 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center mb-6">
              {isRecording ? (
                <div className="flex items-center space-x-1.5 h-16 mb-4">
                  {[40, 70, 95, 60, 85, 45, 90, 75, 50, 80, 100, 65, 40].map((h, i) => (
                    <div
                      key={i}
                      className="w-1.5 bg-zinc-900 dark:bg-zinc-100 rounded-full soundwave-bar"
                      style={{
                        height: `${h}%`,
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center mb-4 text-zinc-700 dark:text-zinc-300">
                  <Mic className="w-8 h-8" />
                </div>
              )}

              <div className="font-mono text-lg font-bold text-zinc-950 dark:text-zinc-50 mb-1">
                {isRecording
                  ? `00:${recordSeconds < 10 ? '0' : ''}${recordSeconds}`
                  : recordSeconds > 0
                  ? `${t.voice_recorded} 00:${recordSeconds < 10 ? '0' : ''}${recordSeconds}`
                  : t.voice_ready}
              </div>

              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                {isRecording
                  ? t.voice_listening
                  : t.voice_tap_to_start}
              </div>
            </div>

            {/* Transcription Result Preview */}
            {isTranscribing && (
              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-center mb-6 animate-pulse">
                <span className="text-xs font-mono text-zinc-700 dark:text-zinc-300">
                  {t.voice_processing}
                </span>
              </div>
            )}

            {voiceTranscript && !isTranscribing && (
              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 mb-6">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-500 mb-1.5">
                  <span>{t.voice_result_label}</span>
                  <span className="text-zinc-900 dark:text-zinc-100 font-semibold flex items-center">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> TTN: 680ms
                  </span>
                </div>
                <p className="text-sm text-zinc-900 dark:text-zinc-100 italic">
                  "{voiceTranscript}"
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              {isRecording ? (
                <button
                  type="button"
                  onClick={handleStopVoice}
                  className="flex-1 py-3 rounded-xl bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 font-semibold text-sm flex items-center justify-center space-x-2 transition-colors shadow-sm"
                >
                  <Square className="w-4 h-4" />
                  <span>{t.voice_btn_stop}</span>
                </button>
              ) : voiceTranscript ? (
                <>
                  <button
                    type="button"
                    onClick={handleStartVoice}
                    className="py-3 px-4 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 text-sm flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{t.voice_btn_rerecord}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSendVoiceToChat}
                    className="flex-1 py-3 rounded-xl bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 font-semibold text-sm flex items-center justify-center space-x-2 transition-colors shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                    <span>{t.voice_btn_send}</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleStartVoice}
                  className="w-full py-3 rounded-xl bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 font-semibold text-sm flex items-center justify-center space-x-2 transition-colors shadow-sm"
                >
                  <Mic className="w-4 h-4" />
                  <span>{t.voice_btn_start}</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* CAMERA / OCR MODAL */}
        {multimodalModal === 'camera' && (
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-zinc-500 mb-2">
              <Camera className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
              <span>On-Device ML Kit OCR / Gemini Vision</span>
            </div>
            <h3 className="text-xl font-bold text-zinc-950 dark:text-zinc-50 mb-1">
              {t.ocr_modal_title}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
              {t.ocr_modal_desc}
            </p>

            {/* Doc Type Selector */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <button
                type="button"
                onClick={() => { setSelectedDocType('book'); setOcrText(''); }}
                className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                  selectedDocType === 'book'
                    ? 'border-zinc-950 dark:border-zinc-100 bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-zinc-100 font-semibold'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
                }`}
              >
                {t.ocr_type_book}
              </button>
              <button
                type="button"
                onClick={() => { setSelectedDocType('receipt'); setOcrText(''); }}
                className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                  selectedDocType === 'receipt'
                    ? 'border-zinc-950 dark:border-zinc-100 bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-zinc-100 font-semibold'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
                }`}
              >
                {t.ocr_type_receipt}
              </button>
              <button
                type="button"
                onClick={() => { setSelectedDocType('notes'); setOcrText(''); }}
                className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                  selectedDocType === 'notes'
                    ? 'border-zinc-950 dark:border-zinc-100 bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-zinc-100 font-semibold'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
                }`}
              >
                {t.ocr_type_notes}
              </button>
            </div>

            {/* Scanner Viewport */}
            <div className="relative h-44 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col items-center justify-center p-4 mb-4">
              <div className="absolute inset-4 border border-dashed border-zinc-400 dark:border-zinc-600 rounded-lg pointer-events-none" />
              <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-zinc-800 dark:border-zinc-200" />
              <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-zinc-800 dark:border-zinc-200" />
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-zinc-800 dark:border-zinc-200" />
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-zinc-800 dark:border-zinc-200" />

              {isScanning && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-zinc-900 dark:via-zinc-100 to-transparent animate-pulse" />
              )}

              <Camera className="w-10 h-10 text-zinc-700 dark:text-zinc-300 mb-2 opacity-80" />
              <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                {t.ocr_camera_aimed}
              </span>
              <span className="text-[11px] text-zinc-500 font-mono mt-0.5">
                {t.ocr_camera_specs}
              </span>
            </div>

            {/* OCR Extracted Text Result */}
            {ocrText && (
              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 mb-4 font-mono text-xs">
                <div className="flex items-center justify-between text-zinc-700 dark:text-zinc-300 mb-1">
                  <span>{t.ocr_result_label}</span>
                  <span className="text-zinc-900 dark:text-zinc-100 font-semibold flex items-center">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Confidence 99.2%
                  </span>
                </div>
                <pre className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap font-sans text-xs">
                  {ocrText}
                </pre>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center space-x-3">
              {!ocrText ? (
                <button
                  type="button"
                  onClick={handleRunOcr}
                  disabled={isScanning}
                  className="w-full py-3 rounded-xl bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 font-semibold text-sm flex items-center justify-center space-x-2 transition-colors shadow-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isScanning ? t.ocr_scanning : t.ocr_btn_capture}</span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleRunOcr}
                    className="py-3 px-4 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 text-sm flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{t.ocr_btn_retry}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSendOcrToChat}
                    className="flex-1 py-3 rounded-xl bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 font-semibold text-sm flex items-center justify-center space-x-2 transition-colors shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                    <span>{t.ocr_btn_send}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default MultimodalModal;
