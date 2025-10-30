import React from 'react';
import { User, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MessageBoxProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export const MessageBox: React.FC<MessageBoxProps> = ({ role, content, timestamp }) => {
  const isUser = role === 'user';

  const renderContent = () => {
    const codeBlockRegex = /```([^]+?)```/g;
    const hasMarkdown = codeBlockRegex.test(content);

    if (hasMarkdown) {
      const segments = content.split(codeBlockRegex);
      return (
        <>
          {segments.map((segment, index) => {
            if (index % 2 === 0) {
              return (
                <div key={index} className='markdown'>
                  <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                    {segment}
                  </ReactMarkdown>
                </div>
              );
            } else {
              const firstNewline = segment.indexOf('\n');
              let language = 'plaintext';
              let code = segment;
              if (firstNewline > -1) {
                const potentialLang = segment.slice(0, firstNewline).trim();
                const looksLikeLang = /^[A-Za-z0-9_+.-]{1,20}$/.test(potentialLang);
                if (looksLikeLang) {
                  language = potentialLang.toLowerCase();
                  code = segment.slice(firstNewline + 1);
                }
              }
              const handleCopy = async () => {
                try { await navigator.clipboard.writeText(code); } catch { }
              };
              return (
                <div key={index} className="my-2 border border-gray-200 rounded-md overflow-hidden">
                  <div className="flex items-center justify-between px-3 py-1.5 bg-gray-50 text-xs text-gray-600">
                    <span className="font-medium">{language}</span>
                    <button
                      onClick={handleCopy}
                      className="px-2 py-0.5 rounded border border-gray-300 hover:bg-white active:bg-gray-100"
                    >
                      Copy
                    </button>
                  </div>
                  <SyntaxHighlighter
                    language={language}
                    style={atomDark}
                    showLineNumbers
                    wrapLongLines
                    customStyle={{ margin: 0, padding: '12px' }}
                  >
                    {code}
                  </SyntaxHighlighter>
                </div>
              );
            }
          })}
        </>
      );
    }

    return (
      <ReactMarkdown rehypePlugins={[rehypeRaw]}>
        {content}
      </ReactMarkdown>
    );
  };

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-6`}>
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${isUser ? 'bg-gradient-to-br from-[#860100] to-[#5c0000]' : 'bg-gray-100'
          }`}
      >
        {isUser ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-[#860100]" />}
      </div>
      <div className={`flex flex-col max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-4 py-3 rounded-2xl shadow-sm ${isUser
            ? 'bg-gradient-to-br from-[#860100] to-[#5c0000] text-white rounded-tr-sm'
            : 'bg-white text-gray-700 rounded-tl-sm border border-gray-200'
            }`}
        >
          {renderContent()}
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