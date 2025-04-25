import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { startSpeechRecognition, SpeechRecognitionResult } from '@/utils/speechUtils';
import { useToast } from '@/hooks/use-toast';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  isProcessing: boolean;
  onListeningChange?: (isListening: boolean) => void;
}

export interface VoiceInputHandle {
  handleStop: () => void;
}

const VoiceInput = forwardRef<VoiceInputHandle, VoiceInputProps>(
  ({ onTranscript, isProcessing, onListeningChange }, ref) => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const { toast } = useToast();
    const stopListeningRef = useRef<(() => void) | null>(null);
    const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useImperativeHandle(ref, () => ({
      handleStop,
    }));

    useEffect(() => {
      if (isProcessing && isListening) {
        handleStop();
      }
      return () => {
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
        }
        if (stopListeningRef.current) {
          stopListeningRef.current();
        }
      };
    }, [isProcessing, isListening]);

    useEffect(() => {
      onListeningChange?.(isListening);
    }, [isListening, onListeningChange]);

    const resetSilenceTimeout = () => {
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
      silenceTimeoutRef.current = setTimeout(() => {
        if (isListening) {
          handleStop();
        }
      }, 2000); // Stop after 2 seconds of silence
    };

    const handleStop = () => {
      if (stopListeningRef.current) {
        stopListeningRef.current();
        stopListeningRef.current = null;
      }
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
      setIsListening(false);
      if (transcript) {
        onTranscript(transcript);
        setTranscript('');
      }
    };

    const handleToggleListen = () => {
      if (isProcessing) return;

      if (!isListening) {
        setTranscript('');

        try {
          const stopListening = startSpeechRecognition(
            (result: SpeechRecognitionResult) => {
              setTranscript(result.transcript);
              resetSilenceTimeout();

              if (result.isFinal) {
                onTranscript(result.transcript);
                handleStop();
              }
            },
            (error: string) => {
              toast({
                title: 'Speech Recognition Error',
                description: error,
                variant: 'destructive',
              });
              handleStop();
            }
          );

          stopListeningRef.current = stopListening;
          setIsListening(true);
          resetSilenceTimeout();
        } catch (error) {
          toast({
            title: 'Error',
            description: 'Failed to start speech recognition',
            variant: 'destructive',
          });
        }
      } else {
        handleStop();
      }
    };

    return (
      <div className="flex flex-col items-center">
        <div className="relative mb-2 flex items-center gap-4">
          {isListening && (
            <div className="absolute -inset-4">
              <div className="w-full h-full rounded-full bg-chatbot-ai opacity-30 animate-pulse-ring"></div>
            </div>
          )}
          <button
            onClick={handleToggleListen}
            disabled={isProcessing}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
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
          <div className="text-sm text-gray-600 mt-2 max-w-xs text-center">{transcript}</div>
        )}
      </div>
    );
  }
);

export default VoiceInput;
