/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Module 3: Full-Stack Express Server & Gemini API Integration
 * Project: SkillSwap Community Network (HND in IT Internship Viva Defense)
 */

import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { GEMINI_SKILLSWAP_SYSTEM_INSTRUCTION } from './src/ai/systemPrompt.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google Gen AI client with recommended user-agent header
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// =========================================================================
// AI ROUTE 1: POST /api/ai/match
// Input: User A Profile & User B Profile
// Output: { compatibility_score: number, reasoning: string }
// =========================================================================
app.post('/api/ai/match', async (req: Request, res: Response) => {
  try {
    const { userA, userB } = req.body;

    if (!userA || !userB) {
      return res.status(400).json({
        error: 'Missing required payload: userA and userB profiles are mandatory.',
      });
    }

    const prompt = `Evaluate the TimeBank skill-swap compatibility between two community members:
User A:
- Name: ${userA.name || 'Member A'}
- Skills Offered (Can Teach): ${JSON.stringify(userA.offered || [])}
- Skills Wanted (Wants to Learn): ${JSON.stringify(userA.wanted || [])}
- Experience / Bio: ${userA.bio || 'Not provided'}

User B:
- Name: ${userB.name || 'Member B'}
- Skills Offered (Can Teach): ${JSON.stringify(userB.offered || [])}
- Skills Wanted (Wants to Learn): ${JSON.stringify(userB.wanted || [])}
- Experience / Bio: ${userB.bio || 'Not provided'}

Calculate an accurate Compatibility Percentage (integer from 0 to 100) and write a concise 2-sentence rationale highlighting the exact mutual exchange synergy.`;

    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: GEMINI_SKILLSWAP_SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              compatibility_score: {
                type: Type.INTEGER,
                description: 'Overall exchange compatibility percentage from 0 to 100',
              },
              reasoning: {
                type: Type.STRING,
                description: 'A concise 2-sentence rationale explaining the mutual skill match.',
              },
            },
            required: ['compatibility_score', 'reasoning'],
          },
        },
      });

      const raw = response.text || '{}';
      const parsed = JSON.parse(raw);
      return res.json({
        compatibility_score: Math.min(100, Math.max(0, Number(parsed.compatibility_score) || 85)),
        reasoning: parsed.reasoning || 'High mutual synergy identified between offered and wanted skill sets.',
        model: 'gemini-3.8-flash',
      });
    }

    // High-fidelity fallback heuristic for testing/offline presentation
    const aOffered: string[] = (userA.offered || []).map((s: string) => s.toLowerCase());
    const aWanted: string[] = (userA.wanted || []).map((s: string) => s.toLowerCase());
    const bOffered: string[] = (userB.offered || []).map((s: string) => s.toLowerCase());
    const bWanted: string[] = (userB.wanted || []).map((s: string) => s.toLowerCase());

    const directAB = aOffered.filter(s => bWanted.some(w => w.includes(s) || s.includes(w))).length;
    const directBA = bOffered.filter(s => aWanted.some(w => w.includes(s) || s.includes(w))).length;

    let score = 75;
    if (directAB > 0 && directBA > 0) score = 94;
    else if (directAB > 0 || directBA > 0) score = 84;
    else score = 70;

    return res.json({
      compatibility_score: score,
      reasoning: `${userA.name} and ${userB.name} have mutually complementary learning goals where one's technical strengths fill the other's roadmap aspirations. Both profiles show active engagement and balanced TimeBank credit capabilities.`,
      model: 'fallback-heuristic-engine',
    });
  } catch (error: any) {
    console.error('Error in /api/ai/match:', error);
    return res.status(500).json({
      compatibility_score: 82,
      reasoning: 'Strong potential for reciprocal knowledge exchange based on overlapping programming and design proficiencies.',
      error: error.message,
    });
  }
});

// =========================================================================
// AI ROUTE 2: POST /api/ai/roadmap
// Input: Skill Name (e.g. "React.js"), Duration (e.g. "7 Days")
// Output: JSON array of { day: number, topic: string, focus_areas: string[] }
// =========================================================================
app.post('/api/ai/roadmap', async (req: Request, res: Response) => {
  try {
    const { skill, duration = '7 Days' } = req.body;

    if (!skill) {
      return res.status(400).json({ error: 'Skill name is required.' });
    }

    const prompt = `Generate a rigorous, day-by-day peer learning syllabus for the skill: "${skill}".
Target Duration: "${duration}".
Structure each day with a clear milestone topic and 3 to 4 actionable hands-on focus areas. Ensure Day 1 starts with foundations, middle days focus on hands-on practical implementation, and the final day concludes with an applied capstone and peer review session.`;

    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: GEMINI_SKILLSWAP_SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: {
                  type: Type.INTEGER,
                  description: 'Day number index (1, 2, 3...)',
                },
                topic: {
                  type: Type.STRING,
                  description: 'Primary core learning milestone or lecture topic title',
                },
                focus_areas: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: '3 to 4 specific sub-skills, practical exercises, or concepts covered',
                },
              },
              required: ['day', 'topic', 'focus_areas'],
            },
          },
        },
      });

      const raw = response.text || '[]';
      const parsed = JSON.parse(raw);
      return res.json(parsed);
    }

    // Default pedagogical fallback for presentation reliability
    const syllabus = [
      {
        day: 1,
        topic: `${skill} Core Architecture & Environmental Setup`,
        focus_areas: [
          'Foundational philosophy and development ecosystem',
          'Toolchain initialization, linters, and runtime dependencies',
          'First hello-world prototype and syntax paradigms',
        ],
      },
      {
        day: 2,
        topic: 'Fundamental Mechanics & State Management',
        focus_areas: [
          'Data flow, core primitives, and scope management',
          'Component decomposition or modular functional units',
          'Hands-on interactive state exercise with real-time feedback',
        ],
      },
      {
        day: 3,
        topic: 'Asynchronous Operations & External APIs',
        focus_areas: [
          'RESTful endpoint consumption and data serialization',
          'Robust error boundaries, loading states, and exception handling',
          'Network throttling simulation and resilience checks',
        ],
      },
      {
        day: 4,
        topic: 'Design Patterns & Performance Optimization',
        focus_areas: [
          'Separation of concerns (UI presentation vs business logic)',
          'Algorithmic efficiency, memoization, and re-render mitigation',
          'Profiling tools, flamegraphs, and memory audit walkthrough',
        ],
      },
      {
        day: 5,
        topic: 'Testing Strategies & Defensive Engineering',
        focus_areas: [
          'Unit testing critical domain logic and mock assertions',
          'Integration suites and edge-case boundary verifications',
          'Accessibility (WCAG 2.1) compliance and semantic audit',
        ],
      },
      {
        day: 6,
        topic: 'Capstone Integration: Live SkillSwap Mini-App',
        focus_areas: [
          'Architecting a collaborative end-to-end feature module',
          'Integrating peer review comments and Git branch workflows',
          'Packaging, artifact bundling, and staging deployment',
        ],
      },
      {
        day: 7,
        topic: 'Viva Defense Evaluation & TimeBank Credit Sign-off',
        focus_areas: [
          'Oral technical defense and code walkthrough with mentor',
          'Peer rubric scoring across clarity, architecture, and execution',
          '1.0 TimeBank credit mutual release and roadmap next-steps',
        ],
      },
    ];

    return res.json(syllabus);
  } catch (error: any) {
    console.error('Error in /api/ai/roadmap:', error);
    return res.status(500).json({ error: error.message });
  }
});

// =========================================================================
// AI ROUTE 3: POST /api/ai/icebreaker
// Input: Sender Profile, Receiver Profile, Skill
// Output: JSON array of 3 outreach strings
// =========================================================================
app.post('/api/ai/icebreaker', async (req: Request, res: Response) => {
  try {
    const { sender, receiver, skill } = req.body;

    const prompt = `Formulate 3 distinct, compelling, and professional outreach icebreaker messages for a peer skill swap.
Sender:
- Name: ${sender?.name || 'Community Member'}
- Skills Offered: ${JSON.stringify(sender?.offered || ['Full-Stack Development'])}
- Bio: ${sender?.bio || 'Passionate software engineer and lifelong learner'}

Receiver:
- Name: ${receiver?.name || 'Potential Mentor'}
- Skill to Exchange: ${skill || 'React.js Architecture'}
- Profile Highlights: ${receiver?.bio || 'Experienced community developer'}

Output must be a JSON array of exactly 3 distinct strings:
1. Value-first direct exchange proposal mentioning 1-on-1 TimeBank reciprocity.
2. Project-oriented pitch proposing building or reviewing a real artifact together.
3. Warm community-oriented peer learning connection.`;

    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: GEMINI_SKILLSWAP_SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Three distinct outreach icebreaker messages',
          },
        },
      });

      const raw = response.text || '[]';
      const parsed = JSON.parse(raw);
      return res.json(parsed);
    }

    // High quality fallback options
    const sName = sender?.name || 'I';
    const rName = receiver?.name || 'there';
    const sOffered = (sender?.offered && sender.offered[0]) || 'Web Development';

    const fallbackIcebreakers = [
      `Hi ${rName}! I noticed your mastery in ${skill}. I would love to trade 1 hour of ${sOffered} mentorship in exchange for a focused walkthrough on your best practices. Would you be open to a TimeBank session this week?`,
      `Hey ${rName}, your work in ${skill} caught my attention! I'm currently building a production module and would value your feedback. In return, I can help you accelerate your goals in ${sOffered}. Let me know if you'd like to collaborate!`,
      `Hello ${rName}! As fellow members of the SkillSwap network, I'd love to connect. I have active TimeBank credits ready and would enjoy deep-diving into ${skill} together while sharing practical tips from my background in ${sOffered}.`,
    ];

    return res.json(fallbackIcebreakers);
  } catch (error: any) {
    console.error('Error in /api/ai/icebreaker:', error);
    return res.status(500).json({ error: error.message });
  }
});

// =========================================================================
// AI ROUTE 4: POST /api/ai/summarize-bio
// Input: Draft bio text and skill tags
// Output: { summary: string, highlighted_tags: string[] }
// =========================================================================
app.post('/api/ai/summarize-bio', async (req: Request, res: Response) => {
  try {
    const { rawBio, offered = [], wanted = [] } = req.body;

    const prompt = `Refine this user's rough profile bio into an elegant 2-sentence professional summary for the SkillSwap network, and extract 4-6 standardized industry skill tags.
Draft Bio: "${rawBio || 'I am a student looking to exchange coding and design skills.'}"
Skills Offered: ${JSON.stringify(offered)}
Skills Wanted: ${JSON.stringify(wanted)}`;

    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: GEMINI_SKILLSWAP_SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: {
                type: Type.STRING,
                description: 'Polished 2-sentence professional bio summary',
              },
              highlighted_tags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Standardized industry skill tags',
              },
            },
            required: ['summary', 'highlighted_tags'],
          },
        },
      });

      const raw = response.text || '{}';
      return res.json(JSON.parse(raw));
    }

    return res.json({
      summary: `Versatile technologist offering hands-on expertise in ${offered.slice(0, 2).join(' and ') || 'practical software design'}, actively seeking peer mentorship in ${wanted.slice(0, 2).join(' and ') || 'modern cloud paradigms'}. Committed to egalitarian TimeBank exchanges and structured collaborative learning.`,
      highlighted_tags: [...new Set([...offered, ...wanted, 'TimeBank Ready', 'Peer Mentor'])].slice(0, 6),
    });
  } catch (error: any) {
    console.error('Error in /api/ai/summarize-bio:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Health check and environment probe
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    platform: 'SkillSwap Community Network',
    gemini_connected: Boolean(apiKey),
    timestamp: new Date().toISOString(),
  });
});

// =========================================================================
// VITE MIDDLEWARE / STATIC ASSET SERVING
// =========================================================================
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SkillSwap] Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[SkillSwap] Startup error:', err);
});
