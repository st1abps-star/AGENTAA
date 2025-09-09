import { NextRequest } from 'next/server';

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent';

const SYSTEM_PROMPT = `You are an expert AI agent.
... (keep your long system prompt here) ...
`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Missing GEMINI_API_KEY' }), {
      status: 500,
    });
  }

  const {
    messages,
    temperature,
  }: {
    messages: Array<{ role: 'user' | 'assistant'; content: string }>;
    temperature?: number;
  } = await req.json();

  const safetySettings = [];
  const generationConfig: Record<string, unknown> = {
    temperature: typeof temperature === 'number' ? temperature : 0.4,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 2048,
  };

  // Gemini format: contents = array of { parts: [{ text: ... }] }
  const contents = [
    {
      parts: [{ text: `SYSTEM:\n${SYSTEM_PROMPT}` }],
    },
    ...messages.map((m) => ({
      parts: [{ text: m.content }],
    })),
  ];

  try {
    const resp = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents, safetySettings, generationConfig }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      return new Response(
        JSON.stringify({ error: 'Gemini API error', info: text }),
        { status: 502 }
      );
    }

    const data = await resp.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      '(no response text from Gemini)';
    return new Response(JSON.stringify({ text, raw: data }), { status: 200 });
  } catch (err: unknown) {
    return new Response(
      JSON.stringify({ error: 'Request failed', info: (err as Error).message }),
      { status: 500 }
    );
  }
}
