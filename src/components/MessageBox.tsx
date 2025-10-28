import React from 'react';
import { User, Bot } from 'lucide-react';

interface MessageBoxProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export const MessageBox: React.FC<MessageBoxProps> = ({ role, content, timestamp }) => {
  const isUser = role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-6`}>
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
          isUser ? 'bg-gradient-to-br from-[#860100] to-[#5c0000]' : 'bg-gray-100'
        }`}
      >
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-[#860100]" />
        )}
      </div>
      <div className={`flex flex-col max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-4 py-3 rounded-2xl shadow-sm ${
            isUser
              ? 'bg-gradient-to-br from-[#860100] to-[#5c0000] text-white rounded-tr-sm'
              : 'bg-white text-gray-700 rounded-tl-sm border border-gray-200'
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{content}</p>
        </div>
        {timestamp && (
          <span className="text-xs text-slate-500 mt-1 px-2">
            {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
    </div>
  );
};
