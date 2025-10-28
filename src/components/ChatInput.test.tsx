import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatInput } from './ChatInput';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import chatReducer from '../store/chatSlice';

const createMockStore = (initialState = {}) => configureStore({
  reducer: {
    chat: chatReducer,
  },
  preloadedState: {
    chat: {
      drafts: {},
      currentConversationId: null,
      conversations: [],
      messages: [],
      isLoading: false,
      error: null,
      isStreaming: false,
      ...initialState,
    },
  },
});

describe('ChatInput', () => {
  const renderWithStore = (ui: React.ReactElement, initialState = {}) => {
    return render(
      <Provider store={createMockStore(initialState)}>
        {ui}
      </Provider>
    );
  };

  it('renders with placeholder text', () => {
    renderWithStore(<ChatInput onSend={vi.fn()} />);
    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();
  });

  it('handles message input and submission', async () => {
    const onSend = vi.fn();
    renderWithStore(<ChatInput onSend={onSend} />);
    
    const textarea = screen.getByRole('textbox');
    await userEvent.type(textarea, 'Hello{enter}');
    
    expect(onSend).toHaveBeenCalledWith('Hello');
    expect(textarea).toHaveValue('');
  });

  it('disables input when disabled prop is true', () => {
    renderWithStore(<ChatInput onSend={vi.fn()} disabled={true} />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('loads draft from store when conversation changes', () => {
    const conversationId = 'conv1';
    const draft = 'Draft message';
    
    renderWithStore(
      <ChatInput onSend={vi.fn()} />,
      {
        currentConversationId: conversationId,
        drafts: { [conversationId]: draft },
      }
    );
    
    expect(screen.getByRole('textbox')).toHaveValue(draft);
  });

  it('saves draft to store when typing', async () => {
    const conversationId = 'conv1';
    const store = createMockStore({ currentConversationId: conversationId });
    
    render(
      <Provider store={store}>
        <ChatInput onSend={vi.fn()} />
      </Provider>
    );
    
    const textarea = screen.getByRole('textbox');
    await userEvent.type(textarea, 'Draft message');
    
    const state = store.getState();
    expect(state.chat.drafts[conversationId]).toBe('Draft message');
  });

  it('clears draft from store on successful message send', async () => {
    const conversationId = 'conv1';
    const store = createMockStore({
      currentConversationId: conversationId,
      drafts: { [conversationId]: 'Draft message' },
    });
    
    render(
      <Provider store={store}>
        <ChatInput onSend={vi.fn()} />
      </Provider>
    );
    
    const textarea = screen.getByRole('textbox');
    await userEvent.type(textarea, '{enter}');
    
    const state = store.getState();
    expect(state.chat.drafts[conversationId]).toBe('');
  });

  // it('respects maxHeight prop', () => {
  //   renderWithStore(<ChatInput onSend={vi.fn()} maxHeight="100px" />);
  //   const container = screen.getByRole('textbox').parentElement;
  //   expect(container).toHaveStyle({ maxHeight: '100px' });
  // });
});