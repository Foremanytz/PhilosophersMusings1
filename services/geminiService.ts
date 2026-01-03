
import { GoogleGenAI, Type } from "@google/genai";
import { Philosopher } from "../types";

export const generateDialogue = async (
  p1: Philosopher,
  p2: Philosopher,
  topic: string,
  rounds: number,
  history: any[] = []
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const isContinuing = history.length > 0;
  
  const systemInstruction = `
    你是一位精通東西方哲學的歷史學者與語言專家。
    你的任務是模擬兩位哲學家之間的深度對話。
    第一位：${p1.name} (${p1.description})
    第二位：${p2.name} (${p2.description})
    討論主題：${topic}

    對話規則與風格：
    1. 【核心語言】：所有對話內容必須使用「繁體中文」（Traditional Chinese）。
    2. 必須嚴格遵守每位哲學家的思想體系、邏輯思維與其特有的說話口吻（例如老子應帶有道家出世感，康德應嚴謹且具邏輯性）。
    3. ${isContinuing ? '【重要】這是一段既有對話的延續。請仔細閱讀先前的紀錄，針對對方的最後一個觀點進行反駁、深化或轉折，不要重複已經說過的內容。' : `對話應包含約 ${rounds} 個回合。`}
    4. 語氣應文雅、深刻，反映出其時代與文化背景，並確保繁體用字精煉且正確。
    5. 請以 JSON 格式返回。
  `;

  const prompt = isContinuing 
    ? `【對話歷史】：${JSON.stringify(history.slice(-6))}。請讓 ${p1.name} 與 ${p2.name} 針對「${topic}」繼續這場辯論。請務必使用繁體中文發表下一輪深刻見解。`
    : `請開始 ${p1.name} 與 ${p2.name} 關於「${topic}」的對話。請完全使用繁體中文撰寫。`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
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
