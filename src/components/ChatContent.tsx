import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { MessageBox } from './MessageBox';
import { ChatInput } from './ChatInput';
import { ChatHeader } from './ChatHeader';
import { Modal } from '../shared/components/Modal';
import { type Message } from '../lib/supabase';

interface ChatContentProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  isStreaming: boolean;
  error: string | null;
  showWelcome?: boolean;
  title?: string;
  onSaveTitle?: (title: string) => void;
  onDelete?: () => void;
  onToggleSidebar?: () => void;
}

export const ChatContent: React.FC<ChatContentProps> = ({
  messages,
  onSendMessage,
  isLoading,
  isStreaming,
  error,
  showWelcome = false,
  title = "New Chat",
  onSaveTitle,
  onDelete,
  onToggleSidebar,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const header = useMemo(() => (
    !showWelcome && (
      <ChatHeader
        title={title}
        onSaveTitle={onSaveTitle}
        onDelete={onDelete}
        onToggleSidebar={onToggleSidebar}
        showDeleteConfirm={showDeleteConfirm}
        setShowDeleteConfirm={setShowDeleteConfirm}
      />
    )
  ), [showWelcome, title, onSaveTitle, onDelete, onToggleSidebar, showDeleteConfirm]);

  return (
    <div className="flex-1 flex flex-col min-h-0 h-full bg-gradient-to-br from-gray-50 to-white">
      {header}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        {showWelcome ? (
          <div className="flex flex-col items-center justify-end h-full text-center">
            <div className="bg-gradient-to-br from-[#860100] to-[#5c0000] p-8 rounded-3xl mb-6 shadow-xl">
              <Sparkles className="w-20 h-20 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-3">
              Welcome to Servimatt AI
            </h2>
            <p className="text-slate-600 max-w-lg text-lg leading-relaxed">
              Your intelligent AI assistant ready to help with any questions or tasks.
              Start a conversation to get started!
            </p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {messages.map((message) => (
              <MessageBox
                key={message.id}
                role={message.role}
                content={message.content}
                timestamp={message.created_at}
              />
            ))}
            {isStreaming && (
              <div className="flex items-center gap-2 text-slate-500 ml-11">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">AI is typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {error && (
        <div className="px-6 py-3 bg-red-50 border-t border-red-200">
          <div className="flex items-center gap-2 text-red-800 max-w-4xl mx-auto">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <Modal
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          title="Delete conversation"
        >
          <div className="flex flex-col items-start">
            <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete this conversation? This action cannot be undone.</p>
            <div className="flex justify-end gap-3 w-full">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1.5 text-sm rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#860100]/20"
              >
                Cancel
              </button>
              <button
                onClick={() => { if (onDelete) { onDelete(); setShowDeleteConfirm(false); } }}
                className="px-3 py-1.5 text-sm rounded-full bg-gradient-to-r from-[#860100] to-[#5c0000] hover:from-[#960200] hover:to-[#6c0000] text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#860100]/40 shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
      <div className={`${showWelcome ? 'flex-1 flex justify-center p-6' : 'border-t border-gray-200 p-4 bg-gray-50/50'}`}>
        <div className={`${showWelcome ? 'w-full max-w-2xl' : 'max-w-4xl mx-auto'}`}>
          <ChatInput
            onSend={onSendMessage}
            disabled={isLoading || isStreaming}
            placeholder={showWelcome ? "Message Servimatt..." : "Ask me anything..."}
          />
        </div>
      </div>
    </div>
  );
};
