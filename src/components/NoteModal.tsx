import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, FileText, Save, Tag, Clock, Calendar, CheckSquare, Hash, ExternalLink } from 'lucide-react';

export const NoteModal: React.FC = () => {
  const { selectedNotePath, notes, closeNote, saveNote, openNote, t } = useApp();
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const note = selectedNotePath ? notes[selectedNotePath] : null;

  useEffect(() => {
    if (note) {
      setContent(note.content);
      setIsEditing(false);
    }
  }, [note]);

  if (!selectedNotePath || !note) return null;

  const handleSave = () => {
    saveNote(selectedNotePath, content);
    setIsEditing(false);
  };

  // Render markdown with clickable wikilinks and tasks in preview mode
  const renderPreview = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('# ')) {
        return <h1 key={idx} className="text-xl font-bold text-zinc-950 dark:text-zinc-50 mt-4 mb-2">{line.replace('# ', '')}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={idx} className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mt-3 mb-1.5">{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={idx} className="text-base font-medium text-zinc-800 dark:text-zinc-200 mt-2 mb-1">{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('> ')) {
        return (
          <blockquote key={idx} className="border-l-2 border-zinc-400 dark:border-zinc-600 pl-3 py-1 my-2 text-zinc-600 dark:text-zinc-400 italic text-sm bg-zinc-100/60 dark:bg-zinc-900/60 rounded-r">
            {line.replace('> ', '')}
          </blockquote>
        );
      }
      if (line.startsWith('---')) {
        return <hr key={idx} className="border-zinc-200 dark:border-zinc-800 my-3" />;
      }

      const isTask = line.trim().startsWith('- [ ]') || line.trim().startsWith('- [x]');
      if (isTask) {
        const isChecked = line.trim().startsWith('- [x]');
        const taskBody = line.replace(/- \[[ x]\]\s*/, '');
        return (
          <div key={idx} className="flex items-center space-x-2 py-1 text-sm font-sans">
            <input
              type="checkbox"
              checked={isChecked}
              readOnly
              className="rounded bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-0"
            />
            <span className={isChecked ? 'line-through text-zinc-400 dark:text-zinc-500' : 'text-zinc-900 dark:text-zinc-100'}>
              {taskBody}
            </span>
          </div>
        );
      }

      const parts = line.split(/(\[\[.*?\]\])/g);
      return (
        <p key={idx} className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed min-h-[1.25rem]">
          {parts.map((part, pIdx) => {
            if (part.startsWith('[[') && part.endsWith(']]')) {
              const target = part.slice(2, -2);
              return (
                <button
                  key={pIdx}
                  type="button"
                  onClick={() => openNote(target)}
                  className="inline-flex items-center gap-1 font-mono text-xs px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 hover:border-zinc-500 transition-colors mx-1"
                >
                  <FileText className="w-3 h-3 text-zinc-500 inline" />
                  <span>{target}</span>
                </button>
              );
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-zinc-950/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-left">
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center shrink-0 text-zinc-700 dark:text-zinc-300">
              <FileText className="w-4 h-4" />
            </div>
            <div className="truncate">
              <span className="font-mono text-xs text-zinc-500 block truncate">
                {selectedNotePath}
              </span>
              <h3 className="font-semibold text-zinc-950 dark:text-zinc-50 text-base truncate">
                {note.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {isEditing ? (
              <button
                type="button"
                onClick={handleSave}
                className="px-3 py-1.5 rounded-lg bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{t.note_save_btn}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-medium border border-zinc-200 dark:border-zinc-800 transition-colors"
              >
                {t.note_edit_btn}
              </button>
            )}

            <button
              type="button"
              onClick={closeNote}
              className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-100 flex items-center justify-center border border-zinc-200 dark:border-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* YAML Frontmatter Inspector */}
        {note.frontmatter && Object.keys(note.frontmatter).length > 0 && (
          <div className="px-5 py-2.5 bg-zinc-50/80 dark:bg-zinc-900/40 border-b border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="text-zinc-500 flex items-center">
              <Tag className="w-3 h-3 mr-1 text-zinc-400" /> YAML:
            </span>
            {Object.entries(note.frontmatter).map(([k, v]) => (
              <span key={k} className="px-2 py-0.5 rounded bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
                <strong className="text-zinc-900 dark:text-zinc-100">{k}:</strong> {Array.isArray(v) ? v.join(', ') : String(v)}
              </span>
            ))}
            <span className="ml-auto text-zinc-400 flex items-center text-[11px]">
              <Clock className="w-3 h-3 mr-1" />
              {note.lastModified}
            </span>
          </div>
        )}

        {/* Note Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 font-mono text-xs sm:text-sm bg-white dark:bg-zinc-950">
          {isEditing ? (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-full min-h-[350px] bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-zinc-900 dark:text-zinc-100 font-mono text-xs sm:text-sm focus:outline-none focus:border-zinc-500 leading-relaxed resize-none"
            />
          ) : (
            <div className="space-y-1.5">
              {renderPreview(content)}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-5 py-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 flex items-center justify-between text-xs text-zinc-500 font-mono">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-zinc-900 dark:bg-zinc-100" />
            <span>{t.note_synced}</span>
          </div>
          <span>HTTP 200 OK</span>
        </div>
      </div>
    </div>
  );
};
export default NoteModal;
