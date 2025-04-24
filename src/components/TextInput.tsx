
import React from 'react';
import { Input } from '@/components/ui/input';

interface TextInputProps {
  onSubmit: (text: string) => void;
  disabled: boolean;
}

const TextInput: React.FC<TextInputProps> = ({ onSubmit, disabled }) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      onSubmit(e.currentTarget.value.trim());
      e.currentTarget.value = '';
    }
  };

  return (
    <Input
      className="mb-4"
      placeholder="Type your message and press Enter..."
      onKeyPress={handleKeyPress}
      disabled={disabled}
    />
  );
};

export default TextInput;
