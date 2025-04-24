
export interface SpeechRecognitionResult {
  transcript: string;
  isFinal: boolean;
}

export const startSpeechRecognition = (
  onResult: (result: SpeechRecognitionResult) => void,
  onError: (error: string) => void
): (() => void) => {
  // Check if browser supports speech recognition
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    onError('Speech recognition is not supported in this browser.');
    return () => {};
  }

  // Use either the standard or webkit version
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.lang = 'en-US';
  recognition.interimResults = true;
  recognition.continuous = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => {
    const transcript = Array.from(event.results)
      .map((result) => result[0].transcript)
      .join('');
    
    const isFinal = event.results[0].isFinal;
    
    onResult({ transcript, isFinal });
  };

  recognition.onerror = (event) => {
    onError(`Error occurred in recognition: ${event.error}`);
  };

  recognition.start();

  // Return a function to stop recognition
  return () => {
    recognition.stop();
  };
};

export const speakText = (text: string): void => {
  if (!('speechSynthesis' in window)) {
    console.error('Text-to-speech is not supported in this browser.');
    return;
  }

  // Stop any current speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 1.0;
  utterance.pitch = 1.0;

  window.speechSynthesis.speak(utterance);
};
