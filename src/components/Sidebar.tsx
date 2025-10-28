import React, { useState, useRef, useEffect } from 'react';
import { Plus, MessageSquare, Trash2, Edit2, Check, X as XIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button, Modal } from '../shared/components';
import { type Conversation } from '../lib/supabase';

interface SidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onUpdateConversationTitle?: (id: string, title: string) => void;
  // mobile overlay controls
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  currentConversationId,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
  onUpdateConversationTitle,
  mobileOpen = false,
  onCloseMobile,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [deleteCandidate, setDeleteCandidate] = useState<string | null>(null);
  const editingRef = useRef<HTMLDivElement | null>(null);

  // close edit mode when clicking outside the editing container
  useEffect(() => {
    if (!editingId) return;
    const onDocClick = (e: MouseEvent) => {
      if (editingRef.current && !editingRef.current.contains(e.target as Node)) {
        handleEditCancel();
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [editingId]);

  const handleEditStart = (conversation: Conversation) => {
    setEditingId(conversation.id);
    setEditTitle(conversation.title);
  };

  const handleEditSave = () => {
    if (editingId && editTitle.trim() && onUpdateConversationTitle) {
      onUpdateConversationTitle(editingId, editTitle.trim());
    }
    setEditingId(null);
    setEditTitle('');
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditTitle('');
  };
  return (
    <div className={`${mobileOpen ? 'fixed inset-0 z-50' : 'hidden'} md:block`}>
      {mobileOpen && <div className="absolute inset-0 bg-black/40 md:hidden" onClick={() => onCloseMobile && onCloseMobile()} />}
      <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-gradient-to-b from-gray-100 to-white border-r border-gray-200 flex flex-col min-h-0 h-full transition-all duration-300 relative`}>
        <div className={`${isCollapsed ? 'p-4 border-b border-gray-200 min-h-[140px]' : 'p-4 border-b border-gray-200'}`}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} mb-4`}>
            <div className="flex items-center gap-3">
              {/* Logo container - when collapsed, hovering this shows an open button */}
              <div className="relative group w-12 h-12 flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-[#860100] to-[#5c0000] rounded-full shadow-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>

                {/* Overlay open button appears when collapsed and user hovers logo; same size as logo */}
                {isCollapsed && (
                  <>
                    <button
                      onClick={() => setIsCollapsed(false)}
                      aria-label="Open sidebar"
                      className="absolute inset-0 flex items-center justify-center bg-[#860100]/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                    >
                      <ChevronRight className="w-5 h-5 text-white" />
                    </button>

                    {/* Collapsed: New Chat icon button under logo, same width */}
                    <div className="mt-3 flex justify-center">
                      <button
                        onClick={(e) => { e.stopPropagation(); onNewChat(); }}
                        aria-label="New chat"
                        title="New chat"
                        className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-[#860100] to-[#5c0000] hover:from-[#960200] hover:to-[#6c0000] shadow-lg"
                      >
                        <Plus className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </>
                )}
              </div>

              {!isCollapsed && (
                <div>
                  <h1 className="text-lg font-bold text-gray-800">Servimatt</h1>
                  <p className="text-xs text-gray-500">AI Assistant</p>
                </div>
              )}
            </div>

            {/* Main collapse button (visible when expanded) */}
            {!isCollapsed && (
              <button
                onClick={() => setIsCollapsed(true)}
                aria-label="Collapse sidebar"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          {!isCollapsed && (
            <Button onClick={onNewChat} className="w-full bg-gradient-to-r from-[#860100] to-[#5c0000] hover:from-[#960200] hover:to-[#6c0000] text-white border-0 shadow-lg" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New Chat
            </Button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
          {conversations.length === 0 ? (
            <div className="text-center text-gray-500 text-sm py-8 px-4">
              {isCollapsed ? '...' : 'No conversations yet. Start a new chat!'}
            </div>
          ) : (
            <div className="space-y-1">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`group flex items-center ${isCollapsed ? 'justify-center p-2' : 'gap-2 px-3'} rounded-lg cursor-pointer transition-all duration-200 border min-h-[48px] ${currentConversationId === conversation.id
                      ? 'bg-gradient-to-r from-[#860100]/10 to-[#5c0000]/10 border-[#860100]/20'
                      : 'border-transparent hover:bg-gray-100 hover:border-gray-200'
                    }`}
                  onClick={() => onSelectConversation(conversation.id)}
                >
                  <MessageSquare className={`${isCollapsed ? 'w-5 h-5' : 'w-4 h-4'} text-gray-400 group-hover:text-gray-600 flex-shrink-0`} />
                  {!isCollapsed && (
                    <div className="flex flex-1 items-center justify-between min-w-0">
                      {/* middle area: title or input */}
                      <div className="flex-1 min-w-0 py-2">
                        {editingId === conversation.id ? (
                          <div ref={editingRef} className="flex items-center gap-2 h-full">
                            <div className="flex-1 h-full">
                              <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded px-2 h-9 w-full transition-colors duration-150 focus:outline-none focus-visible:ring-0 focus-visible:border-gray-300 focus-visible:bg-white"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleEditSave();
                                  if (e.key === 'Escape') handleEditCancel();
                                }}
                                autoFocus
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col">
                            <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900 truncate">
                              {conversation.title}
                            </p>
                            <p className="text-xs text-gray-400">
                              {new Date(conversation.updated_at).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* right actions: reserve space always to avoid shifts */}
                      <div className="w-14 flex items-center justify-end">
                        {editingId === conversation.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditSave();
                              }}
                              className="p-1 hover:bg-[#860100]/10 rounded"
                            >
                              <Check className="w-3 h-3 text-gray-500 hover:text-[#860100]" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditCancel();
                              }}
                              className="p-1 hover:bg-[#860100]/10 rounded"
                            >
                              <XIcon className="w-3 h-3 text-gray-500 hover:text-[#860100]" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditStart(conversation);
                              }}
                              className="p-1 hover:bg-[#860100]/10 rounded transition-colors"
                            >
                              <Edit2 className="w-3 h-3 text-gray-500 hover:text-[#860100]" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteCandidate(conversation.id);
                              }}
                              className="p-1 hover:bg-[#860100]/10 rounded transition-colors"
                            >
                              <Trash2 className="w-3 h-3 text-gray-500 hover:text-[#860100]" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {!isCollapsed && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-400 text-center">
              Powered by OpenAI GPT-4o
            </p>
          </div>
        )}

        {/* Delete confirmation modal */}
        <Modal
          isOpen={!!deleteCandidate}
          onClose={() => setDeleteCandidate(null)}
          title="Delete conversation"
        >
          <div className="flex flex-col items-start">
            <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete this conversation? This action cannot be undone.</p>
            <div className="flex justify-end gap-3 w-full">
              <button
                onClick={() => setDeleteCandidate(null)}
                className="px-3 py-1.5 text-sm rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#860100]/20"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (deleteCandidate) {
                    onDeleteConversation(deleteCandidate);
                  }
                  setDeleteCandidate(null);
                }}
                className="px-3 py-1.5 text-sm rounded-full bg-gradient-to-r from-[#860100] to-[#5c0000] hover:from-[#960200] hover:to-[#6c0000] text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#860100]/40 shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};
