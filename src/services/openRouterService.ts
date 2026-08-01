import axios from 'axios';
import { buildMedicalSystemPrompt, buildMedicalUserPrompt } from './promptBuilder';

export async function analyzeWithOpenRouter(
  text: string,
  filename?: string,
  timeoutMs: number = 25000
): Promise<any> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    throw new Error('OPENROUTER_API_KEY is not configured in environment variables');
  }

  const systemPrompt = buildMedicalSystemPrompt();
  const userPrompt = buildMedicalUserPrompt(text, filename);

  const response = await axios.post(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      model: 'anthropic/claude-3.5-sonnet',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.2,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey.trim()}`,
        'HTTP-Referer': 'https://medexplain-ai.app',
        'X-Title': 'MedExplain AI Report Analyzer',
        'Content-Type': 'application/json',
      },
      timeout: timeoutMs,
    }
  );

  const choices = response.data?.choices;
  if (!choices || choices.length === 0 || !choices[0].message?.content) {
    throw new Error('Empty response received from OpenRouter API');
  }

  const content = choices[0].message.content;
  let parsed: any;
  try {
    parsed = JSON.parse(content);
  } catch (e) {
    const cleanJson = content.replace(/```json/gi, '').replace(/```/g, '').trim();
    parsed = JSON.parse(cleanJson);
  }

  parsed.provider = 'Claude 3.5 (OpenRouter)';
  return parsed;
}
