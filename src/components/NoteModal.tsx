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
    // Split into lines
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Check if line is a header
      if (line.startsWith('# ')) {
        return <h1 key={idx} className="text-xl font-bold text-white mt-4 mb-2">{line.replace('# ', '')}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={idx} className="text-lg font-semibold text-purple-200 mt-3 mb-1.5">{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={idx} className="text-base font-medium text-purple-300 mt-2 mb-1">{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('> ')) {
        return (
          <blockquote key={idx} className="border-l-2 border-purple-500 pl-3 py-1 my-2 text-obsidian-muted italic text-sm bg-purple-950/20 rounded-r">
            {line.replace('> ', '')}
          </blockquote>
        );
      }
      if (line.startsWith('---')) {
        return <hr key={idx} className="border-obsidian-border my-3" />;
      }

      // Check tasks
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
              className="rounded bg-obsidian-bg border-obsidian-border text-purple-600 focus:ring-0"
            />
            <span className={isChecked ? 'line-through text-obsidian-dim' : 'text-obsidian-text'}>
              {taskBody}
            </span>
          </div>
        );
      }

      // Regular line with wikilinks parsing
      const parts = line.split(/(\[\[.*?\]\])/g);
      return (
        <p key={idx} className="text-sm text-obsidian-muted leading-relaxed min-h-[1.25rem]">
          {parts.map((part, pIdx) => {
            if (part.startsWith('[[') && part.endsWith(']]')) {
              const target = part.slice(2, -2);
              return (
                <button
                  key={pIdx}
                  onClick={() => openNote(target)}
                  className="wikilink mx-1"
                >
                  <FileText className="w-3 h-3 text-purple-400" />
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-obsidian-surface border border-obsidian-border rounded-2xl shadow-obsidian-modal flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-obsidian-border bg-obsidian-subtle/80">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-purple-950/70 border border-purple-800/50 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-purple-400" />
            </div>
            <div className="truncate">
              <span className="font-mono text-xs text-purple-400 block truncate">
                {selectedNotePath}
              </span>
              <h3 className="font-semibold text-white text-base truncate">
                {note.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {isEditing ? (
              <button
                onClick={handleSave}
                className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium flex items-center space-x-1.5 transition-colors shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{t.note_save_btn}</span>
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 rounded-lg bg-obsidian-elevated hover:bg-obsidian-border text-obsidian-text text-xs font-medium border border-obsidian-border transition-colors"
              >
                {t.note_edit_btn}
              </button>
            )}

            <button
              onClick={closeNote}
              className="w-8 h-8 rounded-lg bg-obsidian-bg hover:bg-obsidian-elevated text-obsidian-muted hover:text-white flex items-center justify-center border border-obsidian-border transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* YAML Frontmatter Inspector */}
        {note.frontmatter && Object.keys(note.frontmatter).length > 0 && (
          <div className="px-5 py-2.5 bg-obsidian-bg/90 border-b border-obsidian-border/80 flex flex-wrap items-center gap-3 text-xs font-mono">
            <span className="text-obsidian-dim flex items-center">
              <Tag className="w-3 h-3 mr-1 text-purple-400" /> YAML:
            </span>
            {Object.entries(note.frontmatter).map(([k, v]) => (
              <span key={k} className="px-2 py-0.5 rounded bg-obsidian-surface border border-obsidian-border text-obsidian-muted">
                <strong className="text-purple-300">{k}:</strong> {Array.isArray(v) ? v.join(', ') : String(v)}
              </span>
            ))}
            <span className="ml-auto text-obsidian-dim flex items-center text-[11px]">
              <Clock className="w-3 h-3 mr-1" />
              {note.lastModified}
            </span>
          </div>
        )}

        {/* Note Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 font-mono text-xs sm:text-sm">
          {isEditing ? (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-full min-h-[350px] bg-obsidian-bg border border-obsidian-border rounded-xl p-4 text-obsidian-text font-mono text-xs sm:text-sm focus:outline-none focus:border-purple-500 leading-relaxed resize-none"
            />
          ) : (
            <div className="space-y-1.5">
              {renderPreview(content)}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-5 py-3 border-t border-obsidian-border bg-obsidian-subtle/50 flex items-center justify-between text-xs text-obsidian-dim font-mono">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span>{t.note_synced}</span>
          </div>
          <span>HTTP 200 OK</span>
        </div>
      </div>
    </div>
  );
};
