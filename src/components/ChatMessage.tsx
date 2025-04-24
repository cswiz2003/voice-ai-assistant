
import React from 'react';
import { Speaker } from 'lucide-react';
import { speakText } from '@/utils/speechUtils';

export type MessageType = 'user' | 'ai';

interface ChatMessageProps {
  message: string;
  type: MessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, type }) => {
  const handleSpeakClick = () => {
    if (type === 'ai') {
      speakText(message);
    }
  };

  return (
    <div 
      className={`flex ${type === 'user' ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in`}
    >
      <div 
        className={`px-4 py-3 rounded-2xl max-w-[80%] md:max-w-[70%] 
          ${type === 'user' 
            ? 'bg-chatbot-user text-gray-800 rounded-tr-none' 
            : 'bg-chatbot-ai text-white rounded-tl-none'
          }`}
      >
        <div className="flex items-start">
          <p className="text-sm md:text-base">{message}</p>
          {type === 'ai' && (
            <button
              onClick={handleSpeakClick}
              className="ml-2 text-white hover:text-gray-200 transition-colors"
              aria-label="Speak this message"
            >
              <Speaker size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
