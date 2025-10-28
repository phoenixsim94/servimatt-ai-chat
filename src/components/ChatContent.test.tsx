import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChatContent } from './ChatContent';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import chatReducer from '../store/chatSlice';

window.HTMLElement.prototype.scrollIntoView = vi.fn()
// Mock componentsp
vi.mock('./MessageBox', () => ({
  MessageBox: ({ role, content }: { role: string; content: string }) => (
    <div data-testid="message-box" data-role={role}>
      {content}
    </div>
  ),
}));

vi.mock('./ChatInput', () => ({
  ChatInput: ({ onSend, disabled }: { onSend: (msg: string) => void; disabled: boolean }) => (
    <input 
      data-testid="chat-input"
      disabled={disabled}
      onChange={(e) => onSend(e.target.value)}
    />
  ),
}));

vi.mock('./ChatHeader', () => ({
  ChatHeader: ({ title, onSaveTitle }: { title: string; onSaveTitle?: (t: string) => void }) => (
    <div data-testid="chat-header">
      {title}
      {onSaveTitle && <button onClick={() => onSaveTitle('New Title')}>Save</button>}
    </div>
  ),
}));

const createMockStore = () => configureStore({
  reducer: {
    chat: chatReducer,
  },
});

describe('ChatContent', () => {
  const mockMessages = [
    { id: '1', conversation_id: 'conv1', role: 'user' as const, content: 'Hello', created_at: '2025-10-28T10:00:00Z' },
    { id: '2', conversation_id: 'conv1', role: 'assistant' as const, content: 'Hi there!', created_at: '2025-10-28T10:00:01Z' },
  ];

  const defaultProps = {
    messages: mockMessages,
    onSendMessage: vi.fn(),
    isLoading: false,
    isStreaming: false,
    error: null,
    title: 'Test Chat',
  };

  it('renders welcome screen when showWelcome is true', () => {
    render(
      <Provider store={createMockStore()}>
        <ChatContent {...defaultProps} showWelcome={true} />
      </Provider>
    );
    expect(screen.getByText('Welcome to Servimatt AI')).toBeInTheDocument();
    expect(screen.queryByTestId('message-box')).not.toBeInTheDocument();
  });

  it('renders messages when showWelcome is false', () => {
    render(
      <Provider store={createMockStore()}>
        <ChatContent {...defaultProps} showWelcome={false} />
      </Provider>
    );
    const messageBoxes = screen.getAllByTestId('message-box');
    expect(messageBoxes).toHaveLength(2);
    expect(messageBoxes[0]).toHaveAttribute('data-role', 'user');
    expect(messageBoxes[1]).toHaveAttribute('data-role', 'assistant');
  });

  it('shows loading indicator when streaming', () => {
    render(
      <Provider store={createMockStore()}>
        <ChatContent {...defaultProps} isStreaming={true} />
      </Provider>
    );
    expect(screen.getByText('AI is typing...')).toBeInTheDocument();
  });

  it('displays error message when error prop is provided', () => {
    const errorMessage = 'Something went wrong';
    render(
      <Provider store={createMockStore()}>
        <ChatContent {...defaultProps} error={errorMessage} />
      </Provider>
    );
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('calls onSendMessage when message is sent', () => {
    const onSendMessage = vi.fn();
    render(
      <Provider store={createMockStore()}>
        <ChatContent {...defaultProps} onSendMessage={onSendMessage} />
      </Provider>
    );
    const input = screen.getByTestId('chat-input');
    fireEvent.change(input, { target: { value: 'New message' } });
    expect(onSendMessage).toHaveBeenCalledWith('New message');
  });

  it('shows chat header with correct title', () => {
    render(
      <Provider store={createMockStore()}>
        <ChatContent {...defaultProps} title="Custom Title" />
      </Provider>
    );
    expect(screen.getByTestId('chat-header')).toHaveTextContent('Custom Title');
  });

  it('handles title updates', () => {
    const onSaveTitle = vi.fn();
    render(
      <Provider store={createMockStore()}>
        <ChatContent {...defaultProps} onSaveTitle={onSaveTitle} />
      </Provider>
    );
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);
    expect(onSaveTitle).toHaveBeenCalledWith('New Title');
  });
});