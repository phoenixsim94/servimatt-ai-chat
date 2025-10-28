import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { supabase, type Message, type Conversation } from '../lib/supabase';

interface ChatState {
  conversations: Conversation[];
  currentConversationId: string | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  isStreaming: boolean;
  drafts: Record<string, string>;
}

const initialState: ChatState = {
  conversations: [],
  currentConversationId: null,
  messages: [],
  isLoading: false,
  error: null,
  isStreaming: false,
  drafts: {},
};

export const fetchConversations = createAsyncThunk(
  'chat/fetchConversations',
  async () => {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data as Conversation[];
  }
);

export const createConversation = createAsyncThunk(
  'chat/createConversation',
  async (title: string = 'New Conversation') => {
    const { data, error } = await supabase
      .from('conversations')
      .insert({ title })
      .select()
      .single();

    if (error) throw error;
    return data as Conversation;
  }
);

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (conversationId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data as Message[];
  }
);

export const saveMessage = createAsyncThunk(
  'chat/saveMessage',
  async ({ conversationId, role, content }: { conversationId: string; role: 'user' | 'assistant'; content: string }) => {
    const { data, error } = await supabase
      .from('messages')
      .insert({ conversation_id: conversationId, role, content })
      .select()
      .single();

    if (error) throw error;

    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId);

    return data as Message;
  }
);

export const deleteConversation = createAsyncThunk(
  'chat/deleteConversation',
  async (conversationId: string) => {
    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', conversationId);

    if (error) throw error;
    return conversationId;
  }
);

export const updateConversationTitle = createAsyncThunk(
  'chat/updateConversationTitle',
  async ({ id, title }: { id: string; title: string }) => {
    const { data, error } = await supabase
      .from('conversations')
      .update({ title })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Conversation;
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentConversation: (state, action: PayloadAction<string | null>) => {
      state.currentConversationId = action.payload;
    },
    // Save a draft for a conversation (keyed by conversation id)
    setDraft: (state, action: PayloadAction<{ conversationId: string; draft: string }>) => {
      const { conversationId, draft } = action.payload;
      if (conversationId) state.drafts[conversationId] = draft;
    },
    clearDraft: (state, action: PayloadAction<string>) => {
      delete state.drafts[action.payload];
    },
    setIsStreaming: (state, action: PayloadAction<boolean>) => {
      state.isStreaming = action.payload;
    },
    addMessageOptimistic: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    updateLastMessage: (state, action: PayloadAction<string>) => {
      if (state.messages.length > 0) {
        state.messages[state.messages.length - 1].content = action.payload;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch conversations';
      })
      .addCase(createConversation.fulfilled, (state, action) => {
        state.conversations.unshift(action.payload);
        state.currentConversationId = action.payload.id;
      })
      .addCase(createConversation.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to create conversation';
      })
      .addCase(fetchMessages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch messages';
      })
      .addCase(saveMessage.fulfilled, (state, action) => {
        const existingIndex = state.messages.findIndex(m => m.id === action.payload.id);
        if (existingIndex === -1) {
          // Check if there's a temporary message with the same conversation_id and role
          const tempMessageIndex = state.messages.findIndex(m => 
            m.id.startsWith('temp-') && 
            m.conversation_id === action.payload.conversation_id && 
            m.role === action.payload.role
          );
          
          if (tempMessageIndex !== -1) {
            // Replace the temporary message with the saved message
            state.messages[tempMessageIndex] = action.payload;
          } else {
            // No temporary message found, add the new message
            state.messages.push(action.payload);
          }
        }
      })
      .addCase(saveMessage.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to save message';
        // Remove any temporary messages that failed to save
        state.messages = state.messages.filter(m => !m.id.startsWith('temp-'));
      })
      .addCase(deleteConversation.fulfilled, (state, action) => {
        state.conversations = state.conversations.filter(c => c.id !== action.payload);
        if (state.currentConversationId === action.payload) {
          state.currentConversationId = null;
          state.messages = [];
        }
      })
      .addCase(deleteConversation.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to delete conversation';
      })
      .addCase(updateConversationTitle.fulfilled, (state, action) => {
        const index = state.conversations.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.conversations[index] = action.payload;
        }
      })
      .addCase(updateConversationTitle.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update conversation title';
      });
  },
});

export const {
  setCurrentConversation,
  setIsStreaming,
  addMessageOptimistic,
  updateLastMessage,
  clearError,
  clearMessages
} = chatSlice.actions;

// export draft actions
export const { setDraft, clearDraft } = chatSlice.actions;

export default chatSlice.reducer;
