import { Router, Request, Response } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import mammoth from 'mammoth';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { verifyJWT } from '../middleware/auth.js';
import { ProfileData, ResearchArea } from '../types/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = Router();

let client: Anthropic | null = null;
if (process.env.ANTHROPIC_API_KEY) {
  client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });
}

async function extractTextFromFile(filePath: string): Promise<string> {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.pdf') {
    const fileBuffer = fs.readFileSync(filePath);
    const pdfParse = require('pdf-parse') as (buffer: Buffer) => Promise<{ text: string }>;
    const data = await pdfParse(fileBuffer);
    return data.text;
  } else if (ext === '.docx') {
    const fileBuffer = fs.readFileSync(filePath);
    const result = await mammoth.extractRawText({ buffer: fileBuffer });
    return result.value;
  }

  throw new Error('Unsupported file format');
}

router.post('/summarise', verifyJWT, async (req: Request, res: Response) => {
  if (!client) {
    res.status(503).json({ error: 'AI features are not configured. Anthropic API key is missing.' });
    return;
  }
  try {
    const { text, fileId, type } = req.body;

    if (!type || !['project', 'paper', 'research', 'general'].includes(type)) {
      res.status(400).json({ error: 'Invalid type' });
      return;
    }

    let contentToSummarize = '';

    if (fileId) {
      const filePath = path.join(__dirname, '../../uploads/documents', fileId);
      if (!fs.existsSync(filePath)) {
        res.status(404).json({ error: 'File not found' });
        return;
      }
      contentToSummarize = await extractTextFromFile(filePath);
    } else if (text) {
      contentToSummarize = text;
    } else {
      res.status(400).json({ error: 'Either text or fileId required' });
      return;
    }

    // Truncate to 4000 chars
    contentToSummarize = contentToSummarize.substring(0, 4000);

    const prompt = `You are helping an academic researcher write their portfolio. Summarise the following ${type} in 2-3 clear, professional sentences suitable for an academic portfolio website. Focus on the key contribution, methodology, and outcome or impact. Do not use first person. Return only the summary, no preamble.

${contentToSummarize}`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 400,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const summary = message.content[0].type === 'text' ? message.content[0].text : '';

    res.json({ summary });
  } catch (error) {
    console.error('Summarise error:', error);
    res.status(500).json({ error: 'Summarization failed' });
  }
});

router.post('/generate-bio', verifyJWT, async (req: Request, res: Response) => {
  if (!client) {
    res.status(503).json({ error: 'AI features are not configured. Anthropic API key is missing.' });
    return;
  }
  try {
    const { profile, researchAreas, publications, projects } = req.body;

    if (!profile) {
      res.status(400).json({ error: 'Profile data required' });
      return;
    }

    const areasText = Array.isArray(researchAreas)
      ? researchAreas.join(', ')
      : '';

    const prompt = `Generate a professional 3-4 sentence biography for an academic researcher with the following profile:

Name: ${profile.name}
Role: ${profile.role}
Organization: ${profile.organization}
Research Areas: ${areasText}
Publications: ${publications || 0}+
Projects: ${projects || 0}+

Create a compelling, third-person biography suitable for an academic portfolio website. Focus on their expertise, contributions, and achievements. Return only the biography text, no preamble.`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 400,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const bio = message.content[0].type === 'text' ? message.content[0].text : '';

    res.json({ bio });
  } catch (error) {
    console.error('Generate bio error:', error);
    res.status(500).json({ error: 'Bio generation failed' });
  }
});

export default router;
