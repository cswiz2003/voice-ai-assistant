import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import VoiceInput from '@/components/VoiceInput';
import TextInput from '@/components/TextInput';
import ChatContainer, { Message } from '@/components/ChatContainer';
import { getAIResponse } from '@/utils/aiUtils';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { SidebarProvider } from '@/components/ui/sidebar';
import ChatSidebar from '@/components/ChatSidebar';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const Index: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const voiceInputRef = useRef<{ handleStop: () => void }>();
  const queryClient = useQueryClient();

  // Query for current chat messages
  const { data: chatMessages } = useQuery({
    queryKey: ['chat-messages', currentChatId],
    queryFn: async () => {
      if (!currentChatId) return [];
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('chat_id', currentChatId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data.map(msg => ({
        id: msg.id,
        text: msg.text,
        type: msg.type
      })) as Message[];
    },
    enabled: !!currentChatId
  });

  // Update messages when chat changes
  useEffect(() => {
    if (chatMessages) {
      setMessages(chatMessages);
    }
  }, [chatMessages]);

  const createNewChat = async () => {
    if (!user) return null;
    const { data, error } = await supabase
      .from('chats')
      .insert({ user_id: user.id })
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create new chat.",
        variant: "destructive",
      });
      return null;
    }

    return data.id;
  };

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
  };

  const handleNewChat = async () => {
    const newChatId = await createNewChat();
    if (newChatId) {
      setCurrentChatId(newChatId);
      setMessages([]);
    }
  };

  const handleNewMessage = async (text: string) => {
    if (!text.trim()) return;
    if (!user) {
      navigate('/auth');
      return;
    }

    // Create a new chat if there isn't one
    if (!currentChatId) {
      const newChatId = await createNewChat();
      if (!newChatId) return;
      setCurrentChatId(newChatId);
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
      user_id: user.id,
      chat_id: currentChatId
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
        user_id: user.id,
        chat_id: currentChatId
      });

      // Update chat title after first exchange if it's a new chat
      const firstMessage = messages.length === 0;
      if (firstMessage) {
        await supabase
          .from('chats')
          .update({ title: text.slice(0, 50) })
          .eq('id', currentChatId);
        queryClient.invalidateQueries({ queryKey: ['chats'] });
      }
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
        <div className="flex flex-1 overflow-hidden pt-20">{/* pt-20 matches header height */}
          <ChatSidebar 
            onSelectChat={handleSelectChat}
            onNewChat={handleNewChat}
            currentChatId={currentChatId}
          />
          <main className="flex-1 flex flex-col max-w-3xl mx-auto w-full min-h-0">
            <ChatContainer messages={messages} />
            <div className="border-t border-gray-200 p-4 space-y-4">
              <TextInput 
                onSubmit={handleNewMessage} 
                disabled={isProcessing}
                isListening={isListening}
                onStopListening={() => voiceInputRef.current?.handleStop()}
              />
              <div className="flex justify-center">
                <VoiceInput 
                  onTranscript={handleNewMessage}
                  isProcessing={isProcessing}
                  onListeningChange={setIsListening}
                  ref={voiceInputRef}
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
