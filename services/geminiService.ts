
import { GoogleGenAI, Type } from "@google/genai";
import { Philosopher } from "../types";

export const generateDialogue = async (
  p1: Philosopher,
  p2: Philosopher,
  topic: string
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    你是一位精通東西方哲學的歷史學者。
    你的任務是模擬兩位哲學家之間的深度對話。
    第一位：${p1.name} (${p1.description})
    第二位：${p2.name} (${p2.description})
    討論主題：${topic}

    對話風格：
    1. 必須嚴格遵守每位哲學家的思想體系與口吻。
    2. 對話應包含 4-6 個回合，每一回合兩人都會發表看法或反駁對方。
    3. 語氣應文雅、深刻，反映出其時代背景。
    4. 請以 JSON 格式返回。
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `請開始 ${p1.name} 與 ${p2.name} 關於「${topic}」的對話。`,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          dialogue: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                role: { type: Type.STRING, description: "p1 或 p2" },
                name: { type: Type.STRING },
                content: { type: Type.STRING }
              },
              required: ["role", "name", "content"]
            }
          }
        },
        required: ["dialogue"]
      }
    }
  });

  try {
    const data = JSON.parse(response.text || "{}");
    return data.dialogue;
  } catch (e) {
    console.error("Failed to parse JSON", e);
    return [];
  }
};
