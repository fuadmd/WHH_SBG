
import { GoogleGenAI, Type } from "@google/genai";

// Initialize the GoogleGenAI with the API key from process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const geminiService = {
  generateSocialMediaTemplate: async (projectName: string, description: string) => {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate 3 creative social media post templates for a small business named "${projectName}". 
        Description: ${description}. 
        Return a JSON array of objects with "platform" (e.g., Instagram, Facebook) and "caption" fields.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                platform: { type: Type.STRING },
                caption: { type: Type.STRING },
              },
              required: ["platform", "caption"],
            },
          },
        },
      });
      return JSON.parse(response.text || '[]');
    } catch (error) {
      console.error("Error generating templates:", error);
      return [];
    }
  },

  analyzePerformance: async (reports: any[]) => {
    try {
      const prompt = `Analyze the following monthly business reports and provide a short summary of performance trends and risk factors: ${JSON.stringify(reports)}`;
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      return response.text;
    } catch (error) {
      console.error("Error analyzing performance:", error);
      return "Unable to analyze at this time.";
    }
  }
};
