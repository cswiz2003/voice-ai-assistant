# Voice AI Assistant

A responsive web application that enables voice and text interactions with an AI assistant, featuring real-time speech recognition, chat history, and user authentication.

## Features

- 🎤 **Voice Input**: Real-time speech recognition for hands-free interaction
- ⌨️ **Text Input**: Traditional text-based chat interface
- 🔊 **Text-to-Speech**: AI responses can be played back as speech
- 📱 **Responsive Design**: Works seamlessly on mobile and desktop
- 🔐 **Authentication**: Secure user authentication via Supabase
- 📜 **Chat History**: Persistent chat history stored in Supabase
- 🎯 **Real-time Updates**: Instant message synchronization
- 📊 **Sidebar Navigation**: Easy access to chat history

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: 
  - Tailwind CSS for utility-first styling
  - shadcn/ui for pre-built components
- **State Management**: 
  - TanStack Query for server state
  - React Context for auth state
- **Backend & Auth**: 
  - Supabase for authentication and data storage
  - Real-time subscriptions for live updates
- **Additional Libraries**:
  - `react-router-dom` for routing
  - `date-fns` for date formatting
  - `lucide-react` for icons

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

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── ChatContainer.tsx
│   ├── ChatMessage.tsx
│   ├── Header.tsx
│   ├── TextInput.tsx
│   └── VoiceInput.tsx
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
│   └── supabase/      # Supabase client and types
├── pages/             # Route components
│   ├── Index.tsx
│   └── NotFound.tsx
└── utils/             # Utility functions
    ├── aiUtils.ts     # AI response handling
    └── speechUtils.ts # Speech recognition utilities
```

## Features in Detail

### Voice Recognition
The app uses the Web Speech API for voice recognition, enabling real-time transcription of user speech. The `VoiceInput` component handles:
- Starting/stopping voice recording
- Real-time transcription
- Automatic submission after silence

### Chat Interface
The chat interface supports:
- Voice input with visual feedback
- Text input with Enter key submission
- Message history with timestamps
- Text-to-speech playback of AI responses

### Authentication
User authentication is handled through Supabase Auth, supporting:
- Email/password authentication
- Session persistence
- Protected routes
- User-specific chat history

## Deployment

The app can be deployed to any static hosting service. For optimal performance:

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `dist` directory to your hosting service

3. Configure your hosting service with the appropriate environment variables

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

