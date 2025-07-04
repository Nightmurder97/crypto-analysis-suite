import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// API Key should be provided as an environment variable.
// The vite.config.ts file is configured to expose GEMINI_API_KEY as process.env.API_KEY
if (!process.env.API_KEY) {
  // This warning is helpful for developers during setup.
  console.warn("Gemini API key (process.env.API_KEY) is not set. The application will not be able to make API calls to Gemini.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const MODEL_NAME = 'gemini-2.5-flash-preview-04-17';

export const analyzeCryptoData = async (prompt: string): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY_MISSING: Gemini API key is not configured. Please set the API_KEY environment variable.");
  }

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });
    
    const text = response.text;
    if (typeof text === 'string') {
      return text;
    }
    throw new Error("Invalid response format from Gemini API. Expected text.");

  } catch (error) {
    console.error("Error calling Gemini API for crypto analysis:", error);
    if (error instanceof Error) {
        if (error.message.includes("API key not valid") || error.message.includes("provide an API key")) {
            throw new Error("Invalid or missing API Key: Please ensure your Gemini API key is correctly configured as an environment variable.");
        }
        throw new Error(`Gemini API request failed: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the Gemini API.");
  }
};