import { HfInference } from '@huggingface/inference';

const hf = new HfInference(import.meta.env.VITE_HUGGING_FACE_API_TOKEN);

export const getAIResponse = async (userMessage: string): Promise<string> => {
  try {
    if (!import.meta.env.VITE_HUGGING_FACE_API_TOKEN) {
      console.error('Hugging Face API token not configured');
      return "I'm sorry, I'm having configuration issues. Please contact support.";
    }

    // Use google/flan-t5-base which is more reliable for chat
    const response = await hf.textGeneration({
      model: 'google/flan-t5-base',
      inputs: `Human: ${userMessage}\nAssistant: Let me help you with that.`,
      parameters: {
        max_new_tokens: 150,
        temperature: 0.7,
        top_p: 0.95,
        repetition_penalty: 1.2,
        do_sample: true
      },
    });

    let aiResponse = response.generated_text || "I'm sorry, I'm having trouble understanding that.";
    
    // Extract only the assistant's response
    const assistantMatch = aiResponse.match(/Assistant:(.+?)(?=(Human:|$))/s);
    aiResponse = assistantMatch ? assistantMatch[1].trim() : aiResponse;
    
    // Remove any special tokens or artifacts
    aiResponse = aiResponse.replace(/\<\|endoftext\|\>/g, '')
                         .replace(/\[CLS\]/g, '')
                         .replace(/\[SEP\]/g, '')
                         .trim();
    
    // If response is empty or too short after cleaning
    if (!aiResponse || aiResponse.length < 2) {
      return "I understand your message, but I need to think about it more. Could you please rephrase or provide more details?";
    }
    
    return aiResponse;

  } catch (error) {
    console.error('Error getting AI response:', error);
    
    // Check for specific error types and provide user-friendly messages
    if (error instanceof Error) {
      if (error.message.includes('API token')) {
        console.error('API token configuration error:', error);
        return "I'm having trouble with my configuration. Please contact support.";
      }
      if (error.message.includes('inference provider')) {
        console.warn('Model temporarily unavailable:', error);
        return "I'm temporarily unavailable. Please try again in a moment. If this persists, you may want to try a different query.";
      }
      if (error.message.includes('model not found')) {
        console.error('Model not found error:', error);
        return "I'm experiencing technical difficulties. Please try again later.";
      }
    }
    
    // Generic error fallback
    return "I apologize, but I'm having trouble processing your request. Please try again.";
  }
};
