/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini API client
let aiInstance: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiInstance;
}

// 1. AI Weekly Reflection summary endpoint
app.post('/api/ai/reflection', async (req, res) => {
  const { name, interactionCount, topQualities, growthOpportunities } = req.body;

  const client = getGeminiClient();

  const fallbackSummary = `Hello ${name || 'friend'}! 🌱 This week, you made a wonderful impression with ${interactionCount || 0} meaningful interactions. 

People who met you deeply appreciated your **${topQualities?.join(', ') || 'kindness and support'}**. They felt comfortable and inspired in your presence, reflecting a natural ability to connect and collaborate.

For your journey ahead, they see a beautiful growth opportunity in **${growthOpportunities?.join(', ') || 'taking initiative'}**. Developing this will help you step into your full potential and share your unique gifts even more effectively with your community. Keep growing, you are doing amazing!`;

  if (!client) {
    // Graceful fallback with high-quality simulated content
    return res.json({ summary: fallbackSummary });
  }

  try {
    const response = await client.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: `You are the AI Personal Growth Companion for "Elevate", a Positive Impact Network.
Our core philosophy: "We don't judge people. We help them grow."
Write a beautiful, highly encouraging, supportive, and motivating Weekly Reflection summary.
Use positive language. Avoid words like ratings, scores, critiques, or weaknesses.

User details:
- Name: ${name || 'User'}
- Meaningful interactions this week: ${interactionCount || 0}
- Qualities people appreciated most in them: ${topQualities?.join(', ') || 'N/A'}
- Constructive growth opportunities suggested: ${growthOpportunities?.join(', ') || 'N/A'}

Structure your response into 3 short paragraphs:
1. A warm, encouraging greeting celebrating their presence and the number of lives they touched this week.
2. An appreciative reflection of how people experience them (highlighting their top qualities).
3. A motivating suggestion on how they can embrace their growth opportunity to become an even better version of themselves, concluding with a small action step.`,
    });

    return res.json({ summary: response.text || fallbackSummary });
  } catch (error) {
    console.error('Gemini API Error in reflection:', error);
    return res.json({ summary: fallbackSummary });
  }
});

// 2. AI Personal Growth Coach Endpoint
app.post('/api/ai/coach', async (req, res) => {
  const { message, userName, qualities, growthOpportunities, chatHistory } = req.body;

  const client = getGeminiClient();

  const fallbackReplies = [
    `That is a wonderful reflection, ${userName || 'friend'}! Working on your growth area is a courageous step. What is one small, concrete action you can take today?`,
    `I hear you! Our communities grow when we allow ourselves to grow. Embracing collaboration and listening can reveal amazing strengths you didn't know you had.`,
    `A beautiful insight! Remember, personal growth is a journey, not a destination. Your contributions are already making a positive ripple effect in your communities!`,
  ];
  const randomFallback = fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];

  if (!client) {
    return res.json({ reply: randomFallback });
  }

  try {
    // Format chat history for Gemini
    const contents: any[] = [];
    
    // Add system-like prompt inside first message to guide persona
    const systemPrompt = `You are the Elevate AI Growth Coach. You are warm, encouraging, motivational, and help the user reflect on their everyday kindness, leadership, and collaboration.
User name: ${userName || 'Friend'}.
User's top appreciated qualities: ${qualities?.join(', ') || 'Kindness, helpfulness'}.
User's recent growth opportunities: ${growthOpportunities?.join(', ') || 'Confidence, public speaking'}.
Never use critical, grading, or toxic language. Always seek to uplift, suggest constructive solutions, and ask reflective questions.`;

    contents.push({
      role: 'user',
      parts: [{ text: systemPrompt + '\n\nUser says: ' + message }],
    });

    const response = await client.models.generateContent({
      model: 'gemini-3.5-flash',
      contents,
    });

    return res.json({ reply: response.text || randomFallback });
  } catch (error) {
    console.error('Gemini API Error in coach:', error);
    return res.json({ reply: randomFallback });
  }
});

async function startServer() {
  // Vite middleware for development
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
