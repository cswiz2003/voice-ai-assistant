import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google AI client
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);

const IDENTITY_KEYWORDS = ['who are you', 'what model', 'what llm', 'how were you built', 'who made you', 'who created you'];
const MAX_RESPONSE_LENGTH = 500;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// System instructions for the AI
const SYSTEM_INSTRUCTIONS = {
  identity: "I am a Voice-enabled AI Agent developed by Shafique (Github: cswiz2003). I was created using VS Code's Agent mode and Lovable framework through an innovative vibe coding approach. You can explore this project in detail by visiting our GitHub repository's README.md file.",
  responseLength: "Responses are optimized for clarity and brevity, limited to 250 characters.",
};

const getIdentityResponse = () => {
  return SYSTEM_INSTRUCTIONS.identity;
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
    if (!import.meta.env.VITE_GOOGLE_API_KEY) {
      throw new Error('Google API token not configured');
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

    // Get the model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });

    // Create chat history with system instructions
    const history = [
      {
        role: "user",
        parts: [{ text: "Hi, I need your help today." }]
      },
      {
        role: "model",
        parts: [{ text: "Hello! I'm here to help. What can I assist you with?" }]
      }
    ];

    // Start chat with system instructions
    const chat = model.startChat({
      history,
      generationConfig: {
        maxOutputTokens: 500, // Enforcing shorter responses
      },
    });

    // Send message with system instructions
    const result = await withRetry(async () => {
      const response = await chat.sendMessage([
        { 
          text: `${SYSTEM_INSTRUCTIONS.responseLength}\n${SYSTEM_INSTRUCTIONS.purpose}\n${userMessage}` 
        }
      ]);
      return response.response;
    });

    let aiResponse = result.text();

    // Clean up the response
    aiResponse = aiResponse
      .replace(/Human:|Assistant:|Context:/gi, '')
      .replace(/<\|endoftext\|>/g, '')
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
      if (errorMessage.includes('api token') || errorMessage.includes('api key')) {
        return "There seems to be an issue with the Google API authentication. Please check your API key configuration.";
      }
      if (errorMessage.includes('quota') || errorMessage.includes('rate limit')) {
        return "We've hit the rate limit. Please wait a moment before trying again.";
      }
    }
    
    return "I apologize, but I'm having trouble processing your request. Please try again.";
  }
};
