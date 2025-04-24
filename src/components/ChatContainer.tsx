
import React, { useRef, useEffect } from 'react';
import ChatMessage, { MessageType } from './ChatMessage';

export interface Message {
  text: string;
  type: MessageType;
  id: string;
}

interface ChatContainerProps {
  messages: Message[];
}

const ChatContainer: React.FC<ChatContainerProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-gray-400">
          <p className="text-center text-lg mb-2">Welcome to Voice AI Chat</p>
          <p className="text-center text-sm">Click the microphone below to start speaking</p>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <ChatMessage 
              key={message.id} 
              message={message.text} 
              type={message.type} 
            />
          ))}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
};

export default ChatContainer;
