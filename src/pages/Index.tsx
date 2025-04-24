
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import VoiceInput from '@/components/VoiceInput';
import TextInput from '@/components/TextInput';
import ChatContainer, { Message } from '@/components/ChatContainer';
import { getAIResponse } from '@/utils/aiUtils';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import ChatSidebar from '@/components/ChatSidebar';

const Index: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleNewMessage = async (text: string) => {
    if (!text.trim()) return;
    if (!user) {
      navigate('/auth');
      return;
    }
    
    // Add user message
    const userMessage: Message = {
      text,
      type: 'user',
      id: `user-${Date.now()}`,
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    
    // Store message in Supabase
    await supabase.from('chat_messages').insert({
      text,
      type: 'user',
      user_id: user.id
    });
    
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
      
      // Store AI response in Supabase
      await supabase.from('chat_messages').insert({
        text: aiResponse,
        type: 'ai',
        user_id: user.id
      });
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
    <SidebarProvider>
      <div className="flex flex-col h-screen bg-gray-50 w-full">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <ChatSidebar />
          <main className="flex-1 flex flex-col max-w-3xl mx-auto w-full relative">
            <div className="absolute top-4 left-4">
              <SidebarTrigger />
            </div>
            <ChatContainer messages={messages} />
            <div className="border-t border-gray-200 p-4 space-y-4">
              <TextInput onSubmit={handleNewMessage} disabled={isProcessing} />
              <div className="flex justify-center">
                <VoiceInput 
                  onTranscript={handleNewMessage} 
                  isProcessing={isProcessing} 
                />
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
