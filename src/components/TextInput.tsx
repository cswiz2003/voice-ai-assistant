import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Square } from 'lucide-react';

interface TextInputProps {
  onSubmit: (text: string) => void;
  disabled: boolean;
  isListening?: boolean;
  onStopListening?: () => void;
}

const TextInput: React.FC<TextInputProps> = ({ 
  onSubmit, 
  disabled,
  isListening = false,
  onStopListening
}) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      onSubmit(e.currentTarget.value.trim());
      e.currentTarget.value = '';
    }
  };

  return (
    <div className="relative">
      <Input
        className="pr-12"
        placeholder="Type your message and press Enter..."
        onKeyPress={handleKeyPress}
        disabled={disabled}
      />
      {isListening && onStopListening && (
        <Button
          size="icon"
          variant="destructive"
          className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 cursor-pointer"
          onClick={onStopListening}
        >
          <Square className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default TextInput;
