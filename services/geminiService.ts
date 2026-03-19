
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

export const generateCommunityStrategy = async (collectionDescription: string) => {
  if (!API_KEY) throw new Error("API Key is missing");
  
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Act as a senior Web3 community manager and Matrica specialist. 
    Analyze this NFT collection description and suggest a robust verification and role hierarchy 
    to maximize engagement and utility.
    
    Collection Description: ${collectionDescription}
    
    Provide your answer in a JSON format with:
    1. A list of 5 roles (name, requirement, color).
    2. A brief strategy description.
    3. Three engagement ideas for the Discord server.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          strategy: { type: Type.STRING },
          roles: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                requirement: { type: Type.STRING },
                color: { type: Type.STRING }
              }
            }
          },
          engagementIdeas: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["strategy", "roles", "engagementIdeas"]
      }
    }
  });

  return JSON.parse(response.text);
};
