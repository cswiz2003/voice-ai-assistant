import React from 'react';
import { Button } from './ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { SidebarTrigger } from './ui/sidebar';

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  return (
    <header className="border-b border-gray-200 p-4 bg-gradient-to-r from-[hsl(187,100%,42%)] to-[hsl(187,40%,20%)] text-white">
      <div className="container mx-auto relative flex items-center">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center justify-center h-10 w-10">
          <SidebarTrigger className="text-white hover:text-white/90" />
        </div>
        <h1 className="text-xl font-bold text-center flex-1">Voice AI Agent</h1>
        <div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleSignOut}
            className="text-white hover:text-white hover:bg-white/20"
          >
            Sign out
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
