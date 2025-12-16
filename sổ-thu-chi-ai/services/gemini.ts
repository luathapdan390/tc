import { GoogleGenAI, Type } from "@google/genai";
import { TransactionPayload } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const parseTransactionIntent = async (text: string): Promise<TransactionPayload> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: text,
      config: {
        systemInstruction: `
          You are a Vietnamese financial assistant. 
          Analyze the user's text and extract transaction details into a JSON object with:
          - "lydo" (string): The reason or description of the transaction (in Vietnamese).
          - "thu" (number): The income amount. Set to 0 if it is an expense.
          - "chi" (number): The expense amount. Set to 0 if it is an income.
          
          Rules:
          - If the text implies spending, buying, paying, or loss, put the amount in "chi" and 0 in "thu".
          - If the text implies receiving, salary, selling, or gain, put the amount in "thu" and 0 in "chi".
          - Handle 'k' as thousand (e.g., 50k = 50000).
          - Handle 'tr' or 'triệu' as million (e.g., 1tr = 1000000).
          - Return ONLY the JSON object.
        `,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            lydo: { type: Type.STRING },
            thu: { type: Type.NUMBER },
            chi: { type: Type.NUMBER },
          },
          required: ["lydo", "thu", "chi"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    
    // Safety check defaults
    return {
      lydo: result.lydo || "Giao dịch không tên",
      thu: typeof result.thu === 'number' ? result.thu : 0,
      chi: typeof result.chi === 'number' ? result.chi : 0,
    };
  } catch (error) {
    console.error("Gemini parsing error:", error);
    throw new Error("Could not understand the transaction details.");
  }
};