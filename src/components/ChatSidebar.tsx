import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { useAuth } from '@/components/AuthProvider';
import { MoreVertical, Plus } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from './ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface Chat {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

interface ChatSidebarProps {
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  currentChatId?: string | null;
}

const ChatSidebar = ({ onSelectChat, onNewChat, currentChatId }: ChatSidebarProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isRenaming, setIsRenaming] = useState(false);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [newTitle, setNewTitle] = useState('');

  const { data: chats } = useQuery({
    queryKey: ['chats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      return data as Chat[];
    },
  });

  const deleteChat = useMutation({
    mutationFn: async (chatId: string) => {
      const { error } = await supabase
        .from('chats')
        .delete()
        .eq('id', chatId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      toast({
        title: 'Chat deleted',
        description: 'The chat has been deleted successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete chat. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const renameChat = useMutation({
    mutationFn: async ({ chatId, title }: { chatId: string; title: string }) => {
      const { error } = await supabase
        .from('chats')
        .update({ title })
        .eq('id', chatId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      setIsRenaming(false);
      toast({
        title: 'Chat renamed',
        description: 'The chat has been renamed successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to rename chat. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleRename = (chat: Chat) => {
    setSelectedChat(chat);
    setNewTitle(chat.title);
    setIsRenaming(true);
  };

  const handleSubmitRename = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedChat && newTitle.trim()) {
      renameChat.mutate({ chatId: selectedChat.id, title: newTitle.trim() });
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className="space-y-2">
        <h2 className="px-2 text-lg font-semibold">Chat History</h2>
        <p className="px-2 text-sm text-muted-foreground">{user?.email}</p>
        <Separator className="my-2" />
        <div className="px-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={onNewChat}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-2">
              {chats?.map((chat) => (
                <div
                  key={chat.id}
                  className={`p-2 hover:bg-accent rounded-lg cursor-pointer group ${
                    currentChatId === chat.id ? 'bg-accent' : ''
                  }`}
                  onClick={() => onSelectChat(chat.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{chat.title}</p>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(chat.updated_at), 'MMM d, h:mm a')}
                      </span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          handleRename(chat);
                        }}>
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteChat.mutate(chat.id);
                          }}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <Dialog open={isRenaming} onOpenChange={setIsRenaming}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Chat</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitRename} className="space-y-4">
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Enter new title"
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsRenaming(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Sidebar>
  );
};

export default ChatSidebar;
