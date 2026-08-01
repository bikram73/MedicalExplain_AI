import axios from 'axios';
import { buildMedicalSystemPrompt, buildMedicalUserPrompt } from './promptBuilder';

export async function analyzeWithGroq(
  text: string,
  filename?: string,
  timeoutMs: number = 25000
): Promise<any> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    throw new Error('GROQ_API_KEY is not configured in environment variables');
  }

  const systemPrompt = buildMedicalSystemPrompt(filename, text);
  const userPrompt = buildMedicalUserPrompt(text, filename);

  const response = await axios.post(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json',
      },
      timeout: timeoutMs,
    }
  );

  const choices = response.data?.choices;
  if (!choices || choices.length === 0 || !choices[0].message?.content) {
    throw new Error('Empty response received from Groq API');
  }

  const content = choices[0].message.content;
  let parsed: any;
  try {
    parsed = JSON.parse(content);
  } catch (e) {
    const cleanJson = content.replace(/```json/gi, '').replace(/```/g, '').trim();
    parsed = JSON.parse(cleanJson);
  }

  parsed.provider = 'Groq Llama 3.3';
  return parsed;
}
