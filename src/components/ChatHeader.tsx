import React, { useCallback, useState, useRef, useEffect } from 'react';
import { Check, Edit2, Menu, Trash2, X as XIcon } from 'lucide-react';

interface ChatHeaderProps {
  title: string;
  onSaveTitle?: (title: string) => void;
  onDelete?: () => void;
  onToggleSidebar?: () => void;
  showDeleteConfirm: boolean;
  setShowDeleteConfirm: (show: boolean) => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  title,
  onSaveTitle,
  onToggleSidebar,
  setShowDeleteConfirm,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const editingRef = useRef<HTMLDivElement | null>(null);

  // Keep edit input in sync with title prop when switching conversations
  useEffect(() => {
    if (!isEditing) setEditTitle(title || '');
  }, [title, isEditing]);

  // Click outside to cancel edit
  useEffect(() => {
    if (!isEditing) return;
    const onDocClick = (e: MouseEvent) => {
      if (editingRef.current && !editingRef.current.contains(e.target as Node)) {
        setIsEditing(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [isEditing]);

  const handleEditStart = useCallback(() => {
    setEditTitle(title || '');
    setIsEditing(true);
  }, [title]);

  const handleEditSave = useCallback(() => {
    const trimmed = editTitle.trim();
    if (trimmed && onSaveTitle) onSaveTitle(trimmed);
    setIsEditing(false);
  }, [editTitle, onSaveTitle]);

  const handleEditCancel = useCallback(() => {
    setIsEditing(false);
    setEditTitle(title || '');
  }, [title]);

  return (
    <div className="border-b border-gray-200 bg-white/50 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
          title="Toggle sidebar"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex-1 flex items-center justify-between min-w-0">
          <div className="mr-2 flex-1 min-w-0">
            <div className="h-[40px] flex items-center">
              {isEditing ? (
                <div ref={editingRef} className="flex items-center gap-2 w-full">
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleEditSave();
                      if (e.key === 'Escape') handleEditCancel();
                    }}
                    onFocus={(e) => e.currentTarget.select()}
                    className="text-lg font-medium text-gray-900 bg-gray-50 border border-gray-200 rounded px-2 h-9 w-full transition-colors duration-150 focus:outline-none focus-visible:ring-0 focus-visible:border-gray-300 focus-visible:bg-white"
                    autoFocus
                    aria-label="Edit conversation title"
                  />
                </div>
              ) : (
                <h1 className="text-lg font-medium text-gray-900 truncate" aria-live="polite">{title}</h1>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isEditing ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => { e.stopPropagation(); handleEditSave(); }}
                  className="p-2 hover:bg-[#860100]/10 rounded-full transition-colors"
                  title="Save"
                  aria-label="Save title"
                >
                  <Check className="w-4 h-4 text-gray-700" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleEditCancel(); }}
                  className="p-2 hover:bg-[#860100]/10 rounded-full transition-colors"
                  title="Cancel"
                  aria-label="Cancel edit"
                >
                  <XIcon className="w-4 h-4 text-gray-700" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); handleEditStart(); }}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                  title="Edit conversation"
                  aria-label="Edit conversation title"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(true); }}
                  className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                  title="Delete conversation"
                  aria-label="Delete conversation"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};