import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button, Textarea } from '../shared/components';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setDraft } from '../store/chatSlice';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  maxHeight?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  disabled = false,
  placeholder = 'Type your message...',
  maxHeight = '200px',
}) => {
  const dispatch = useAppDispatch();
  const currentConversationId = useAppSelector((s) => s.chat.currentConversationId);
  const drafts = useAppSelector((s) => s.chat.drafts);

  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const prevConversationRef = useRef<string | null>(null);

  const updateTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const max = parseInt(String(maxHeight).replace('px', ''), 10) || 200;
      const newHeight = Math.min(textarea.scrollHeight, max);
      textarea.style.height = `${newHeight}px`;
      textarea.style.overflowY = newHeight >= max ? 'auto' : 'hidden';
    }
  };

  const formatDraft = (raw: string) => {
    if (!raw) return '';
    let t = raw.replace(/\r\n/g, '\n');
    t = t.trim();
    t = t.replace(/\n{3,}/g, '\n\n');
    t = t.split('\n').map((l) => l.replace(/\s+$/g, '')).join('\n');
    return t;
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setMessage(val);
    updateTextareaHeight();
    if (currentConversationId) {
      dispatch(setDraft({ conversationId: currentConversationId, draft: val }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      if (currentConversationId) {
        dispatch(setDraft({ conversationId: currentConversationId, draft: '' }));
      }
      setMessage('');
      setTimeout(() => updateTextareaHeight(), 0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  // initialize height when maxHeight changes
  useEffect(() => {
    updateTextareaHeight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxHeight]);

  // save previous draft and load formatted draft for new conversation
  useEffect(() => {
    const prevId = prevConversationRef.current;
    if (prevId && prevId !== currentConversationId) {
      // save last message for previous conversation
      dispatch(setDraft({ conversationId: prevId, draft: message }));
    }

    prevConversationRef.current = currentConversationId;

    if (currentConversationId) {
      const raw = drafts[currentConversationId] ?? '';
      const formatted = formatDraft(raw);
      setMessage(formatted);
      setTimeout(() => updateTextareaHeight(), 0);
    } else {
      setMessage('');
      setTimeout(() => updateTextareaHeight(), 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentConversationId]);

  const isMultiline = message.includes('\n') || message.length > 100;

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className={`relative flex ${isMultiline ? 'flex-col' : 'items-center'} bg-white rounded-2xl border border-gray-200 shadow-lg focus-within:shadow-xl transition-all duration-200`}
      >
        <div className={`flex-grow flex items-center ${isMultiline ? 'p-3' : 'p-2'}`}>
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            style={{ maxHeight, minHeight: '24px', lineHeight: '1.5' }}
            className="w-full border-0 focus:ring-0 resize-none disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 placeholder-gray-400 custom-scrollbar flex items-center"
          />
        </div>

        <div className={`flex justify-end ${isMultiline ? 'px-3 pb-3' : 'pr-2'}`}>
          <Button type="submit" disabled={disabled || !message.trim()} className="px-4 py-2 h-9 shadow-md hover:shadow-lg transition-shadow">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;

