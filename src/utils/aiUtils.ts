
// Simple mock function to simulate AI responses
// In a real application, this would call an actual AI API
export const getAIResponse = async (userMessage: string): Promise<string> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simple response patterns based on user input
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return "Hello there! How can I assist you today?";
  } 
  else if (lowerMessage.includes('how are you')) {
    return "I'm just a simple AI assistant, but I'm functioning well! How can I help you?";
  }
  else if (lowerMessage.includes('name')) {
    return "I'm your voice-enabled assistant, built with React and the Web Speech API!";
  }
  else if (lowerMessage.includes('weather')) {
    return "I don't have access to real-time weather data in this simple demo, but I'd be happy to chat about something else!";
  }
  else if (lowerMessage.includes('thank')) {
    return "You're welcome! Is there anything else I can help you with?";
  }
  else if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
    return "Goodbye! Feel free to talk to me again anytime.";
  }
  else {
    return "That's interesting. While this is just a demo with pre-programmed responses, a full version would connect to an AI model like Llama 3 or Mistral. What else would you like to talk about?";
  }
};
