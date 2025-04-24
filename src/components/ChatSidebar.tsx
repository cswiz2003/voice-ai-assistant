
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from '@/components/ui/sidebar';
import { format } from 'date-fns';

interface ChatMessage {
  id: string;
  text: string;
  created_at: string;
  type: 'user' | 'ai';
}

const ChatSidebar = () => {
  const { data: messages } = useQuery({
    queryKey: ['chat-history'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ChatMessage[];
    },
  });

  return (
    <Sidebar>
      <SidebarHeader>
        <h2 className="px-2 text-lg font-semibold">Chat History</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Recent Messages</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-2">
              {messages?.map((message) => (
                <div
                  key={message.id}
                  className="p-2 hover:bg-accent rounded-lg cursor-pointer"
                >
                  <p className="text-sm truncate">{message.text}</p>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(message.created_at), 'MMM d, h:mm a')}
                  </span>
                </div>
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default ChatSidebar;
