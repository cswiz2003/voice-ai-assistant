
import React, { useState } from 'react';
import Header from '@/components/Header';
import VoiceInput from '@/components/VoiceInput';
import ChatContainer, { Message } from '@/components/ChatContainer';
import { getAIResponse } from '@/utils/aiUtils';
import { useToast } from '@/hooks/use-toast';

const Index: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleTranscript = async (text: string) => {
    if (!text.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      text,
      type: 'user',
      id: `user-${Date.now()}`,
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    
    // Process AI response
    setIsProcessing(true);
    try {
      const aiResponse = await getAIResponse(text);
      
      // Add AI message
      const aiMessage: Message = {
        text: aiResponse,
        type: 'ai',
        id: `ai-${Date.now()}`,
      };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1 flex flex-col max-w-3xl mx-auto w-full">
        <ChatContainer messages={messages} />
        
        <div className="border-t border-gray-200 p-4 flex justify-center">
          <VoiceInput 
            onTranscript={handleTranscript} 
            isProcessing={isProcessing} 
          />
        </div>
      </main>
    </div>
  );
};

export default Index;
