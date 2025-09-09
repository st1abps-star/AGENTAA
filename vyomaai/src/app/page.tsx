"use client";
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LiquidButton from '../components/LiquidButton';
import TypingDots from '../components/TypingDots';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export default function HomePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [temperature, setTemperature] = useState(0.4);
  const [isLoading, setIsLoading] = useState(false);
  const [controller, setController] = useState<AbortController | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading]);

  const canSend = useMemo(() => input.trim().length > 0 && !isLoading, [input, isLoading]);

  async function sendMessage(text?: string) {
    const content = (text ?? input).trim();
    if (!content) return;
    setInput('');
    const newUser: ChatMessage = { id: crypto.randomUUID(), role: 'user', content };
    const history = [...messages, newUser];
    setMessages(history);
    setIsLoading(true);
    const abort = new AbortController();
    setController(abort);
    try {
      const resp = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history.map(({ role, content }) => ({ role, content })),
          temperature
        }),
        signal: abort.signal
      });
      if (!resp.ok) {
        const info = await resp.text();
        throw new Error(info);
      }
      const data = await resp.json();
      const ai: ChatMessage = { id: crypto.randomUUID(), role: 'assistant', content: data.text || '...' };
      setMessages((prev) => [...prev, ai]);
    } catch (e) {
      if ((e as any).name === 'AbortError') {
        setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'assistant', content: 'Stopped.' }]);
      } else {
        setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'assistant', content: 'Error fetching response.' }]);
      }
    } finally {
      setIsLoading(false);
      setController(null);
    }
  }

  function abortRequest() {
    controller?.abort();
  }

  function regenerate() {
    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUser) {
      sendMessage(lastUser.content);
    }
  }

  function clearChat() {
    setMessages([]);
  }

  async function copyMessage(messageId: string) {
    const msg = messages.find((m) => m.id === messageId);
    if (!msg) return;
    await navigator.clipboard.writeText(msg.content);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4" style={{ backgroundColor: '#0d0d0d' }}>
      <div className="w-full max-w-3xl glass rounded-3xl p-4 md:p-6">
        <header className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-[rgba(0,209,255,0.18)] border border-[rgba(0,209,255,0.35)]" />
            <h1 className="text-lg font-semibold tracking-wide">
              <span className="text-sky-300">Vyoma</span>AI
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 border border-white/10">
              <span className="text-xs text-gray-300/80">Temperature</span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="accent-sky-400"
              />
              <span className="text-xs text-gray-300/80 w-8 text-right">{temperature.toFixed(1)}</span>
            </div>
            <LiquidButton variant="secondary" onClick={clearChat}>Clear</LiquidButton>
          </div>
        </header>

        <div ref={containerRef} className="h-[60vh] overflow-y-auto rounded-2xl p-3 bg-black/20 border border-white/10">
          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className={`mb-3 flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 border ${m.role === 'user' ? 'bubble-user' : 'bubble-ai'}`}>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{m.content}</p>
                  <div className="mt-2 flex justify-end">
                    <LiquidButton variant="secondary" className="text-xs px-2 py-1" onClick={() => copyMessage(m.id)}>Copy</LiquidButton>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <div className="mb-3 flex justify-start">
              <div className="bubble-ai max-w-[60%] rounded-2xl px-4 py-3 border">
                <TypingDots />
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <div className="flex-1 glass rounded-2xl px-3 py-2 flex items-center gap-2">
            <input
              className="w-full bg-transparent outline-none placeholder:text-gray-400 text-gray-100"
              placeholder="Ask VyomaAI..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
          </div>
          <LiquidButton onClick={() => sendMessage()} disabled={!canSend}>
            Send
          </LiquidButton>
          <LiquidButton variant="secondary" onClick={abortRequest} disabled={!isLoading}>
            Stop
          </LiquidButton>
          <LiquidButton variant="secondary" onClick={regenerate} disabled={isLoading || messages.every((m) => m.role !== 'user')}>
            Regenerate
          </LiquidButton>
        </div>
      </div>
    </main>
  );
}

