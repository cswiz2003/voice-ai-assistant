
import React, { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { startSpeechRecognition, SpeechRecognitionResult } from '@/utils/speechUtils';
import { useToast } from '@/hooks/use-toast';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  isProcessing: boolean;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript, isProcessing }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const { toast } = useToast();
  
  // Stop listening when processing
  useEffect(() => {
    if (isProcessing && isListening) {
      setIsListening(false);
    }
  }, [isProcessing, isListening]);

  const handleToggleListen = () => {
    if (isProcessing) return;
    
    if (!isListening) {
      setTranscript('');
      
      try {
        const stopListening = startSpeechRecognition(
          (result: SpeechRecognitionResult) => {
            setTranscript(result.transcript);
            
            if (result.isFinal) {
              onTranscript(result.transcript);
              setIsListening(false);
            }
          },
          (error: string) => {
            toast({
              title: "Speech Recognition Error",
              description: error,
              variant: "destructive",
            });
            setIsListening(false);
          }
        );
        
        setIsListening(true);
        
        // Auto stop after 10 seconds as fallback
        setTimeout(() => {
          if (isListening) {
            stopListening();
            if (transcript) {
              onTranscript(transcript);
            }
            setIsListening(false);
          }
        }, 10000);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to start speech recognition",
          variant: "destructive",
        });
      }
    } else {
      setIsListening(false);
      if (transcript) {
        onTranscript(transcript);
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-2">
        {isListening && (
          <div className="absolute -inset-4">
            <div className="w-full h-full rounded-full bg-chatbot-ai opacity-30 animate-pulse-ring"></div>
          </div>
        )}
        <button
          onClick={handleToggleListen}
          disabled={isProcessing}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
            isListening
              ? 'bg-chatbot-ai text-white'
              : isProcessing
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-chatbot-aiLight text-gray-700 hover:bg-chatbot-ai hover:text-white'
          }`}
          aria-label={isListening ? 'Stop listening' : 'Start listening'}
        >
          {isListening ? <MicOff size={24} /> : <Mic size={24} />}
        </button>
      </div>
      
      {transcript && isListening && (
        <div className="text-sm text-gray-600 mt-2 max-w-xs text-center">
          {transcript}
        </div>
      )}
    </div>
  );
};

export default VoiceInput;
