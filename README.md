# Servimatt AI Chat App

AI-integrated web application for intelligent Servimatt solutions. Built with React, Redux Toolkit, TailwindCSS, Storybook, and Vite.

[![Live Preview](https://img.shields.io/badge/Live%20Preview-Open-blue?style=flat&logo=vercel)](https://servimatt-ai-chat-app.vercel.app/)

## Features

- **AI Chat Interface**: Interactive chat powered by OpenAI GPT-4o for Servimatt advice
- **Chat History**: Persistent conversation storage using Supabase
- **Real-time Streaming**: See AI responses as they're generated
- **Multi-Conversation Support**: Create, manage, and switch between multiple chat sessions
- **Modern UI/UX**: Clean, responsive design with smooth animations
- **Component Library**: Documented components via Storybook (Button, Modal and Textarea)
- **Type-Safe**: Full TypeScript support throughout the application

## Tech Stack

- **Frontend Framework**: React 19 with TypeScript 5.9
- **State Management**: Redux Toolkit
- **Styling**: TailwindCSS 4
- **Build Tool**: Vite 7
- **Database**: Supabase (PostgreSQL)
- **AI Integration**: OpenAI GPT-4o
- **Component Documentation**: Storybook 9
- **Icons**: Lucide React

## Prerequisites

- Node.js v22
- npm or yarn
- OpenAI API key
- Supabase account

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/phoenixsim94/servimatt-ai-chat
cd project
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

The Supabase configuration is already set up in `.env`. You need to add your OpenAI API key:

```env
VITE_SUPABASE_URL=https://ag..........jwvo.supabase.co
VITE_SUPABASE_ANON_KEY=<already-configured>

# Add your OpenAI API key here
VITE_OPENAI_API_KEY=sk-your-openai-api-key-here
```

**Getting an OpenAI API Key:**
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new secret key
5. Copy and paste it into the `.env` file

### 4. Database Setup

The database schema is already configured with the following tables:
- `conversations`: Stores chat conversation metadata
- `messages`: Stores individual chat messages

You can check the SQL database in superbase folder
No additional database setup is required.

### 5. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 6. View Storybook (Optional)

To explore the component library:

```bash
npm run storybook
```

Storybook will be available at `http://localhost:6006`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run storybook` - Start Storybook development server
- `npm run build-storybook` - Build Storybook for production

## Key Features Explained

### Chat Interface
- Clean, modern chat UI with message boxes
- Auto-scrolling to latest messages
- Loading and streaming states
- Error handling with user-friendly messages

### State Management
- Redux Toolkit for predictable state management
- Async thunks for API calls
- Optimistic UI updates for better UX

### Database Integration
- Supabase for real-time data persistence
- Automatic conversation and message storage
- Row Level Security (RLS) policies configured

### AI Integration
- OpenAI GPT-4o for intelligent responses
- Streaming responses for real-time feedback
- Context-aware conversations

## Usage

1. **Start a New Chat**: Click the "New Chat" button in the sidebar
2. **Send a Message**: Type your Servimatt question and press Enter or click Send
3. **View Response**: Watch as the AI generates a response in real-time
4. **Switch Conversations**: Click on any conversation in the sidebar to view its history
5. **Delete Conversations**: Hover over a conversation and click the trash icon

## Error Handling

The application includes comprehensive error handling:
- API key validation
- Network error handling
- Database connection errors
- User-friendly error messages
- Automatic error dismissal

## Performance Optimizations

- Code splitting with Vite
- Lazy loading of components
- Optimistic UI updates
- Efficient Redux state updates
- Memoized selectors
## Implemented Features

- AI chat UI with streaming responses using OpenAI GPT-4o Turbo (see `src/services/openai.ts`)
- Persistent conversation and message storage using Supabase (migrations included in `supabase/migrations`)
- Multi-conversation support: create, rename, switch, and delete conversations (`src/store/chatSlice.ts`, `src/components/Sidebar.tsx`)
- Real-time streaming and optimistic UI updates (`openAIService.streamMessage`, optimistic add/replace in `chatSlice`)
- Robust error handling and user-friendly messages for API/network/database issues
- Type-safe codebase with TypeScript and Redux Toolkit for state management (`src/store`)
- Component library and local documentation with Storybook (scripts available in `package.json`)
- Responsive UI styled with TailwindCSS and built with Vite
- Supabase and OpenAI integrations wired in `src/lib` and `src/services`