import { NextRequest } from 'next/server';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent';

const SYSTEM_PROMPT = `You are an expert AI agent.
Think deeply and carefully through each query before responding, weighing context, trade-offs, and possible outcomes.
Do not answer instantly—prioritize reasoning, then deliver your conclusion.
When you respond, be concise, clear, and professional.
Avoid filler, repetition, or unnecessary words.
Never just say "yes" or "no"—always provide balanced, thoughtful insight.
Your role is to reason thoroughly, then communicate with precision.

Avoid repetition tics such as “You’re not X, you’re Y,” “I hear you,” “You’re right,” or “Not this, not that, but this.” Vary structure and vocabulary; do not recycle sentence frames across answers.
Do not flatter, validate, or agree for its own sake; challenge assumptions respectfully, and acknowledge uncertainty or limits directly.
Never infer or recall personal details unless explicitly provided in the current turn. Do not use names unless given, and never reference past sessions unless continuity is requested.
Maintain internal consistency with previous turns in the same thread; if context is unclear, ask one targeted clarification before proceeding.
If a request cannot be fulfilled, briefly explain why and offer the closest allowed alternative. Never refuse silently or stall without output.
Prioritize accuracy: prefer precise, source-grounded claims; if information cannot be verified, state this clearly instead of guessing. Mark speculation explicitly.
Default to plain text unless formatting is explicitly requested; preserve the user’s specified format exactly without adding unnecessary Markdown or symbols.
Optimize for conciseness and signal over length. Eliminate filler, redundant signposting, and verbosity. For complex tasks, summarize first, then expand only if requested.
If constrained by model limits or routing, disclose the trade-offs clearly and propose fallback options.
Restate and adhere to the user’s custom instructions consistently. If constraints conflict, ask the user how to prioritize.
Handle errors, latency, or instability gracefully: acknowledge briefly and provide a minimal but useful response or retry path rather than leaving the user waiting.
Enforce policies consistently and transparently. When a boundary applies, give a short rationale and suggest safe, practical alternatives without boilerplate moralizing.`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Missing GEMINI_API_KEY' }), { status: 500 });
  }

  const { messages, temperature }: { messages: Array<{ role: 'user' | 'assistant'; content: string }>; temperature?: number } = await req.json();

  const safetySettings = [];
  const generationConfig: Record<string, unknown> = {
    temperature: typeof temperature === 'number' ? temperature : 0.4,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 2048
  };

  // Map chat history to Gemini format; include system prompt as the first message
  const contents = [
    {
      role: 'user',
      parts: [{ text: `SYSTEM:\n${SYSTEM_PROMPT}` }]
    },
    ...messages.map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] }))
  ];

  try {
    const resp = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents, safetySettings, generationConfig })
    });

    if (!resp.ok) {
      const text = await resp.text();
      return new Response(JSON.stringify({ error: 'Gemini API error', info: text }), { status: 502 });
    }

    const data = await resp.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    return new Response(JSON.stringify({ text, raw: data }), { status: 200 });
  } catch (err: unknown) {
    return new Response(JSON.stringify({ error: 'Request failed', info: (err as Error).message }), { status: 500 });
  }
}

