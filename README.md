# Voice AI Agent 🎙️ 

> Vibe coded with Lovable and VS Code Agent Mode 🚀

A cutting-edge web application that brings voice interaction to life through AI. Built using modern web technologies, this app seamlessly combines voice recognition, AI-powered conversations, and real-time updates to create an intuitive and responsive chat experience. The project leverages Google's powerful Gemini model, Supabase's real-time capabilities, and a robust frontend stack for a smooth user experience.

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

</div>

## ✨ Features

- 🎤 **Voice Input**: Advanced real-time speech recognition with confidence scoring
- 🤖 **Google Gemini Integration**: Powered by gemini-1.5-flash-8b model for intelligent responses
- 🔊 **Speech to Text & TTS**: Seamless voice-to-text and text-to-speech capabilities
- 🔄 **Real-time Updates**: Instant message synchronization via Supabase
- 🔐 **Authentication**: Secure user authentication with Supabase
- 💾 **Persistent Chat History**: Complete message history with edit capabilities
- 🎨 **Shadcn UI**: Beautiful and accessible component library
- ⚡ **Vite**: Lightning-fast development and production builds
- 🛡️ **Error Handling**: Robust error management with graceful fallbacks

## 🛠️ Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- shadcn/ui components
- React Router v6
- TanStack Query v5
- Lucide React icons

### Backend
- Supabase Backend-as-a-Service
  - PostgreSQL database
  - Real-time subscriptions
  - Authentication
  - Row Level Security (RLS)

### AI Integration
- Google Generative AI SDK
- Model: gemini-1.5-flash-8b
- Web Speech API for voice processing

### Infrastructure
- TypeScript with strict mode
- ESLint & Prettier
- Vercel for deployment
- Bun package manager

## 🚀 Getting Started

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

   The app will be available at `http://localhost:5173`.

### Supabase & Environment Setup

1. Create a new Supabase project at [https://supabase.com](https://supabase.com)

2. Set up the required table:
   ```sql
   chat_messages (
     id uuid PRIMARY KEY,
     user_id uuid NOT NULL,
     created_at timestamptz NOT NULL DEFAULT now(),
     text text NOT NULL,
     type text NOT NULL
   )
   ```

3. Configure your environment:
   Create a `.env` file with:
   ```
   VITE_SUPABASE_URL=your-project-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

### Deployment

The application is deployed on Vercel for optimal performance and reliability. To deploy your own instance:

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Configure your environment variables
4. Deploy!

Your app will be live at `https://your-project.vercel.app`

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── ChatContainer   # Chat interface
│   ├── VoiceInput      # Speech recognition
│   └── TextInput       # Text input handling
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
├── pages/             # Route components
└── utils/             # Utility functions
```

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

Vibe Coded with ❤️ using [Lovable](https://lovable.dev), [VS Code Agent Mode](https://marketplace.visualstudio.com/items?itemName=CodeAgent.agent-mode), [Google Generative AI](https://ai.google.dev/), and [Supabase](https://supabase.io/)

</div>

