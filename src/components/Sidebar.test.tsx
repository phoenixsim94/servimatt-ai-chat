import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Sidebar } from './Sidebar';

describe('Sidebar', () => {
  const mockConversations = [
    { 
      id: '1', 
      title: 'Chat 1', 
      created_at: '2025-10-28T10:00:00Z',
      updated_at: '2025-10-28T10:00:00Z'
    },
    { 
      id: '2', 
      title: 'Chat 2', 
      created_at: '2025-10-28T11:00:00Z',
      updated_at: '2025-10-28T11:00:00Z'
    },
  ];

  const defaultProps = {
    conversations: mockConversations,
    currentConversationId: '1',
    onNewChat: vi.fn(),
    onSelectConversation: vi.fn(),
    onDeleteConversation: vi.fn(),
    onUpdateConversationTitle: vi.fn(),
  };

  it('renders conversations list', () => {
    render(<Sidebar {...defaultProps} />);
    
    expect(screen.getByText('Chat 1')).toBeInTheDocument();
    expect(screen.getByText('Chat 2')).toBeInTheDocument();
  });

  it('calls onNewChat when new chat button is clicked', async () => {
    const onNewChat = vi.fn();
    render(<Sidebar {...defaultProps} onNewChat={onNewChat} />);
    
    const newChatButton = screen.getByRole('button', { name: /new chat/i });
    await userEvent.click(newChatButton);
    
    expect(onNewChat).toHaveBeenCalled();
  });

  it('calls onSelectConversation when a conversation is clicked', async () => {
    const onSelectConversation = vi.fn();
    render(<Sidebar {...defaultProps} onSelectConversation={onSelectConversation} />);
    
    await userEvent.click(screen.getByText('Chat 2'));
    expect(onSelectConversation).toHaveBeenCalledWith('2');
  });

});