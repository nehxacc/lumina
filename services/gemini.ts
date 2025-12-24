
import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini API with named parameter and direct process.env.API_KEY access
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface SearchResult {
  text: string;
  sources: GroundingChunk[];
}

/**
 * Uses Gemini with Google Search Grounding to provide real-world aesthetic inspiration.
 * Acts as a gateway to help users find real content on external platforms.
 */
export const getInspiration = async (query: string): Promise<SearchResult> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User is looking for aesthetic inspiration for: "${query}". 
      Use Google Search to find real, current trends, artists, or specific visual directions. 
      Provide a calm, poetic summary of what you found and offer specific keywords for Pinterest or YouTube. 
      Focus only on real information found on the web.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "I couldn't find specific details for that, but here are some sources to explore.";
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return {
      text,
      sources: sources as GroundingChunk[]
    };
  } catch (error) {
    console.error("Gemini Search Error:", error);
    return {
      text: "I encountered a quiet moment of technical difficulty. Please try searching on Google directly.",
      sources: []
    };
  }
};
