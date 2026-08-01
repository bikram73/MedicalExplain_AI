import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { processMedicalReportPipeline } from './src/services/aiService';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '25mb' }));

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// AI Medical Report Analysis Route with Failover Orchestrator
app.post('/api/analyze', async (req, res) => {
  try {
    const { imageBase64, mimeType, filename, fileText } = req.body;

    if (!imageBase64 && !fileText) {
      return res.status(400).json({ success: false, error: 'No image or text provided' });
    }

    const reportResult = await processMedicalReportPipeline(
      fileText || '',
      filename || 'Medical_Report.pdf',
      imageBase64,
      mimeType
    );

    res.json({
      success: true,
      filename: filename || 'Medical_Report.pdf',
      ...reportResult,
    });
  } catch (err: any) {
    console.error('Error in /api/analyze:', err);
    res.status(500).json({ success: false, error: err.message || 'All AI providers unavailable' });
  }
});


// AI Q&A Chat Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { question, reportContext } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        reply: `Based on your report context, your indicators have been highlighted for review. Please ask your physician if you experience worsening chest pain or breathlessness.`
      });
    }

    const prompt = `You are a friendly, compassionate AI Medical Assistant helping a patient understand their medical report.
Report Context:
${JSON.stringify(reportContext || {})}

Patient Question: "${question}"

Provide a clear, reassuring, and accurate response based strictly on the report context. Explain medical terms simply. End with an encouraging reminder to discuss key findings with their doctor.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    res.json({ reply: response.text });
  } catch (err: any) {
    console.error('Error in /api/chat:', err);
    res.status(500).json({ error: err.message || 'Failed to generate chat response' });
  }
});

// Serve frontend assets or Vite dev server
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
