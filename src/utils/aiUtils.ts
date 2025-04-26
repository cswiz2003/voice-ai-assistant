import { HfInference } from '@huggingface/inference';

const hf = new HfInference(import.meta.env.VITE_HUGGING_FACE_API_TOKEN);

const IDENTITY_KEYWORDS = ['who are you', 'what model', 'what llm', 'how were you built', 'who made you', 'who created you'];
const MAX_RESPONSE_LENGTH = 500;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getIdentityResponse = () => {
  return "I was built by Shafique (Github: cswiz2003). He vibe coded this whole app with VS Code's Agent mode and Lovable. You can learn more about this project by going to github repo and read readme.md file.";
};

const createPrompt = (userMessage: string) => {
  const conversation = [
    "Context: You are a helpful AI assistant. Be friendly and concise.",
    "Human: Hi there!",
    "Assistant: Hello! How can I help you today?",
    `Human: ${userMessage}`,
    "Assistant:"
  ].join("\n");
  
  return conversation;
};

async function withRetry<T>(fn: () => Promise<T>, retries = MAX_RETRIES): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      await wait(RETRY_DELAY);
      return withRetry(fn, retries - 1);
    }
    throw error;
  }
}

export const getAIResponse = async (userMessage: string): Promise<string> => {
  try {
    if (!import.meta.env.VITE_HUGGING_FACE_API_TOKEN) {
      throw new Error('API token not configured');
    }

    // Check if the user is asking about identity
    const lowercaseMessage = userMessage.toLowerCase();
    if (IDENTITY_KEYWORDS.some(keyword => lowercaseMessage.includes(keyword))) {
      return getIdentityResponse();
    }

    // Handle basic greetings directly
    if (/^(hi|hello|hey|hi there|hello there)$/i.test(userMessage.trim())) {
      return "Hello! How can I help you today?";
    }

    // Using google/flan-t5-base model which is more reliable for chat
    const response = await withRetry(() => hf.text2textGeneration({
      model: 'google/flan-t5-base',
      inputs: createPrompt(userMessage),
      parameters: {
        max_new_tokens: 100,
        temperature: 0.7,
        top_p: 0.95,
        repetition_penalty: 1.2,
        do_sample: true
      },
    }));

    let aiResponse = response.generated_text || "I apologize, but I couldn't generate a proper response.";
    
    // Clean up the response
    aiResponse = aiResponse
      .replace(/Human:|Assistant:|Context:/gi, '')
      .replace(/<\|endoftext\|\>/g, '')
      .replace(/\n/g, ' ')
      .trim();
    
    // Validate response quality
    if (!aiResponse || aiResponse.length < 5) {
      return "I understand your message. How can I assist you today?";
    }

    // Ensure the response ends with proper punctuation
    if (aiResponse.length > MAX_RESPONSE_LENGTH) {
      const truncated = aiResponse.substring(0, MAX_RESPONSE_LENGTH);
      const lastPeriod = truncated.lastIndexOf('.');
      const lastExclamation = truncated.lastIndexOf('!');
      const lastQuestion = truncated.lastIndexOf('?');
      const lastPunctuation = Math.max(lastPeriod, lastExclamation, lastQuestion);
      
      if (lastPunctuation > 0) {
        aiResponse = truncated.substring(0, lastPunctuation + 1);
      } else {
        const lastSpace = truncated.lastIndexOf(' ');
        aiResponse = truncated.substring(0, lastSpace > 0 ? lastSpace : MAX_RESPONSE_LENGTH) + '.';
      }
    } else if (!aiResponse.match(/[.!?]$/)) {
      aiResponse += '.';
    }
    
    return aiResponse.trim();

  } catch (error) {
    console.error('Error getting AI response:', error);
    
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();
      if (errorMessage.includes('api token')) {
        return "There seems to be an issue with the AI service authentication. Please try again in a moment.";
      }
      if (errorMessage.includes('inference provider') || errorMessage.includes('model not found')) {
        return "The AI service is temporarily unavailable. Please try again in a moment.";
      }
      if (errorMessage.includes('rate limit')) {
        return "We've hit the rate limit. Please wait a moment before trying again.";
      }
    }
    
    return "I apologize, but I'm having trouble processing your request. Please try again.";
  }
};
