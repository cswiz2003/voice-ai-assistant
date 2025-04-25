# Voice AI Assistant 🎙️ 

A modern, responsive web application that enables seamless voice and text interactions with an AI assistant. Built with cutting-edge technologies and best practices in mind, featuring real-time speech recognition, chat history management, and secure user authentication.

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

</div>

## ✨ Features

- 🎤 **Advanced Voice Input**: Real-time speech recognition with confidence levels and automatic silence detection
- 🤖 **AI-Powered Responses**: Intelligent conversation handling with Hugging Face integration and robust error handling
- 🔊 **Text-to-Speech**: High-quality voice synthesis for AI responses
- 🎯 **Real-time Updates**: Instant message synchronization using Supabase's real-time capabilities
- 📱 **Modern Responsive Design**: Sleek UI that works seamlessly across all devices
- 🔐 **Secure Authentication**: Robust user authentication system via Supabase
- 📜 **Persistent Chat History**: Complete chat history management with editing capabilities
- 🎨 **Beautiful UI Components**: Using shadcn/ui for a consistent and modern look
- 🌓 **Theme Support**: Light and dark mode with system preference detection
- ⚡ **Optimized Performance**: Built with Vite for lightning-fast development and production builds
- 🛡️ **Robust Error Handling**: Graceful handling of AI service interruptions and API issues

## 🛠️ Tech Stack

### Frontend Core
- **Framework**: React 18 with TypeScript for type-safe development
- **Build Tool**: Vite for ultra-fast development and optimized builds
- **Routing**: React Router v6 with protected routes and lazy loading

### Styling & UI
- **CSS Framework**: Tailwind CSS for utility-first styling
- **Component Library**: shadcn/ui for beautiful, accessible components
- **Icons**: Lucide React for consistent, scalable icons
- **Animations**: Tailwind's built-in animations and custom keyframes

### State Management & Data Fetching
- **Server State**: TanStack Query (React Query) v5 for efficient data fetching
- **Local State**: React Context for auth and theme management
- **Real-time**: Supabase real-time subscriptions

### AI Integration
- **Model Provider**: Hugging Face's Inference API
- **Model**: google/flan-t5-base for reliable chat responses
- **Error Handling**: Comprehensive error management with graceful fallbacks
- **Voice Processing**: Web Speech API with advanced error recovery

### Backend & Infrastructure
- **Database & Auth**: Supabase for:
  - PostgreSQL database
  - Real-time subscriptions
  - Row Level Security (RLS)
  - OAuth integration
  - File storage

### Developer Experience
- **Type Safety**: TypeScript with strict mode
- **Code Quality**:
  - ESLint for code linting
  - Prettier for code formatting
  - Husky for git hooks
- **Package Manager**: Bun for ultra-fast dependency management

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- A Supabase account

### Local Development Setup

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd <your-project-name>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:<port>` (default: 5173).

### Supabase Configuration

1. Create a new Supabase project at [https://supabase.com](https://supabase.com)

2. The project already includes the following tables:
   - `chat_messages`: Stores chat history
   ```sql
   chat_messages (
     id uuid PRIMARY KEY,
     user_id uuid NOT NULL,
     created_at timestamptz NOT NULL DEFAULT now(),
     text text NOT NULL,
     type text NOT NULL
   )
   ```

3. Set up authentication:
   - Enable Email/Password authentication
   - Configure Google OAuth (optional)
   - Set your site URL and redirect URLs in Authentication > URL Configuration

### Environment Setup

The project uses the following Supabase configuration:
- Project URL: `https://kfakbcbogixcktvsvgwq.supabase.co`
- Anon Key: **Add your Anon Key to an `.env` file** (do not share it publicly).

Example `.env` file:
```
VITE_SUPABASE_URL=https://kfakbcbogixcktvsvgwq.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── ChatContainer   # Chat interface components
│   ├── VoiceInput      # Speech recognition
│   └── TextInput       # Text input handling
├── hooks/              # Custom React hooks
├── integrations/       # External integrations
├── pages/             # Route components
└── utils/             # Utility functions
```

## 🚀 Key Features in Detail

### Voice Recognition System
- Web Speech API integration with error handling
- Real-time transcription with confidence scoring
- Automatic silence detection
- Visual feedback during recording
- Mobile-friendly voice input

### Chat Interface
- Real-time message updates
- Message edit & delete capabilities
- Markdown support in messages
- Code syntax highlighting
- Image and link previews
- Voice playback for AI responses

### AI Integration
- Hugging Face API integration
- Intelligent error handling and recovery
- Graceful degradation during service interruptions
- User-friendly error messages
- Comprehensive logging for debugging

### Authentication & Security
- Email/password authentication
- OAuth providers support
- Session persistence
- Protected routes
- Row Level Security (RLS)
- CORS configuration

### Performance Optimizations
- Code splitting and lazy loading
- Image optimization
- Efficient re-rendering with React.memo
- Debounced input handling
- Optimistic UI updates

## 🌟 Coming Soon

- 📱 Progressive Web App (PWA) support
- 🌍 Internationalization (i18n)
- 📊 Usage analytics dashboard
- 🤖 Additional AI model integrations
- 🎨 Custom theme builder

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Vibe Coded with ❤️ using [React](https://reactjs.org/), [Vite](https://vitejs.dev/), and [Supabase](https://supabase.io/)

</div>

