import { GoogleGenAI } from '@google/genai';
import { buildMedicalSystemPrompt, buildMedicalUserPrompt } from './promptBuilder';

export async function analyzeWithGemini(
  text: string,
  filename?: string,
  imageBase64?: string,
  mimeType?: string,
  timeoutMs: number = 25000
): Promise<any> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in environment variables');
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  const systemPrompt = buildMedicalSystemPrompt();
  const userPrompt = buildMedicalUserPrompt(text, filename);

  let contents: any;
  if (imageBase64) {
    const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, '');
    contents = [
      {
        inlineData: {
          data: cleanBase64,
          mimeType: mimeType || 'image/png',
        },
      },
      {
        text: `${systemPrompt}\n\n${userPrompt}`,
      },
    ];
  } else {
    contents = `${systemPrompt}\n\n${userPrompt}`;
  }

  // Timeout wrapper
  const apiCall = ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents,
    config: {
      responseMimeType: 'application/json',
    },
  });

  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Gemini API request timed out')), timeoutMs)
  );

  const response: any = await Promise.race([apiCall, timeoutPromise]);

  if (!response || !response.text) {
    throw new Error('Empty response received from Gemini API');
  }

  const rawText = response.text;
  let parsed: any;
  try {
    parsed = JSON.parse(rawText);
  } catch (err) {
    // Attempt markdown block cleanup
    const cleanJson = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
    parsed = JSON.parse(cleanJson);
  }

  parsed.provider = 'Gemini';
  return parsed;
}
