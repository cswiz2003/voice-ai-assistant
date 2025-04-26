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
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="w-24 flex justify-start">
          <SidebarTrigger className="text-white hover:text-white/90" />
        </div>
        
        <h1 className="text-xl font-bold font-['Poppins'] flex-shrink-0">Voice AI Agent</h1>
        
        <div className="w-24 flex justify-end">
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
