import { useCallback, useEffect, useMemo, useState } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { ChatContent } from './components/ChatContent';
import { useAppDispatch, useAppSelector } from './store/hooks';
import {
  fetchConversations,
  createConversation,
  fetchMessages,
  saveMessage,
  deleteConversation,
  updateConversationTitle,
  setCurrentConversation,
  addMessageOptimistic,
  updateLastMessage,
  setIsStreaming,
  clearError,
} from './store/chatSlice';
import { openAIService } from './services/openai';

function App() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const dispatch = useAppDispatch();
  const {
    conversations,
    currentConversationId,
    messages,
    isLoading,
    error,
    isStreaming,
  } = useAppSelector((state) => state.chat);


  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  useEffect(() => {
    if (currentConversationId) {
      dispatch(fetchMessages(currentConversationId));
    }
  }, [currentConversationId, dispatch]);

  const toggleMobileSidebar = () => setMobileSidebarOpen((s) => !s);
  const openMobileSidebar = useCallback(() => setMobileSidebarOpen(true), []);
  const closeMobileSidebar = useCallback(() => setMobileSidebarOpen(false), []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleNewChat = useCallback(() => {
    // Clear current conversation to show welcome screen with Servimatt AI logo and input box
    dispatch(setCurrentConversation(null));
  }, [dispatch]);
  const handleNewChatMobile = useCallback(() => { closeMobileSidebar(); handleNewChat(); }, [closeMobileSidebar, handleNewChat]);

  const handleSelectConversation = useCallback((id: string) => {
    dispatch(setCurrentConversation(id));
  }, [dispatch]);
  const handleSelectConversationMobile = useCallback((id: string) => { closeMobileSidebar(); handleSelectConversation(id); }, [closeMobileSidebar, handleSelectConversation]);

  const handleDeleteConversation = useCallback(async (id: string) => {
    try {
      // If the deleted conversation is currently selected, clear selection so UI shows welcome/new chat
      if (currentConversationId === id) {
        dispatch(setCurrentConversation(null));
      }
      // Perform deletion immediately without any confirmation modal
      await dispatch(deleteConversation(id)).unwrap();
    } catch (err) {
      console.error('Failed to delete conversation:', err);
    }
  }, [dispatch, currentConversationId]);
  const handleDeleteConversationMobile = useCallback(async (id: string) => { closeMobileSidebar(); await handleDeleteConversation(id); }, [closeMobileSidebar, handleDeleteConversation]);

  const handleUpdateConversationTitle = useCallback(async (id: string, title: string) => {
    try {
      await dispatch(updateConversationTitle({ id, title })).unwrap();
    } catch (err) {
      console.error('Failed to update conversation title:', err);
    }
  }, [dispatch]);

  const handleSendMessage = async (content: string) => {
    if (!currentConversationId) {
      // Create conversation with first few words as title
      const title = content.split(' ').slice(0, 4).join(' ') + '...';
      const result = await dispatch(createConversation(title)).unwrap();
      dispatch(setCurrentConversation(result.id));
      await handleSendMessageToConversation(result.id, content);
    } else {
      await handleSendMessageToConversation(currentConversationId, content);
    }
  };

  const handleSendMessageToConversation = async (
    conversationId: string,
    content: string
  ) => {
    try {
      await dispatch(
        saveMessage({
          conversationId,
          role: 'user',
          content,
        })
      ).unwrap();

      const tempAssistantMessage = {
        id: 'temp-' + Date.now(),
        conversation_id: conversationId,
        role: 'assistant' as const,
        content: '',
        created_at: new Date().toISOString(),
      };
      dispatch(addMessageOptimistic(tempAssistantMessage));
      dispatch(setIsStreaming(true));

      let fullContent = '';

      const chatHistory = messages
        .filter((m) => m.conversation_id === conversationId)
        .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));

      await openAIService.streamMessage(
        [...chatHistory, { role: 'user', content }],
        (chunk) => {
          fullContent += chunk;
          dispatch(updateLastMessage(fullContent));
        }
      );

      dispatch(setIsStreaming(false));

      await dispatch(
        saveMessage({
          conversationId,
          role: 'assistant',
          content: fullContent,
        })
      ).unwrap();
    } catch (err) {
      dispatch(setIsStreaming(false));
      console.error('Failed to send message:', err);
    }
  };

  const currentMessages = useMemo(() => currentConversationId ? messages.filter(m => m.conversation_id === currentConversationId) : [], [messages, currentConversationId]);
  const currentTitle = useMemo(() => currentConversationId ? conversations.find(c => c.id === currentConversationId)?.title || "New Chat" : "New Chat", [conversations, currentConversationId]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile sidebar toggle */}
      <button
        onClick={toggleMobileSidebar}
        className="md:hidden absolute z-40 top-4 left-4 p-2 bg-white rounded-md shadow-lg"
        aria-label="Open sidebar"
      >
        <Menu className="w-5 h-5 text-gray-700" />
      </button>

      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={closeMobileSidebar}
        conversations={conversations}
        currentConversationId={currentConversationId}
        onNewChat={handleNewChatMobile}
        onSelectConversation={handleSelectConversationMobile}
        onDeleteConversation={handleDeleteConversationMobile}
  onUpdateConversationTitle={handleUpdateConversationTitle}
      />

      <ChatContent
        messages={currentMessages}
        showWelcome={currentConversationId === null}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        isStreaming={isStreaming}
        error={error}
  title={currentTitle}
        onSaveTitle={currentConversationId ? (newTitle: string) => handleUpdateConversationTitle(currentConversationId, newTitle) : undefined}
        onDelete={currentConversationId ? () => handleDeleteConversation(currentConversationId) : undefined}
        onToggleSidebar={openMobileSidebar}
      />
    </div>
  );
}

export default App;
