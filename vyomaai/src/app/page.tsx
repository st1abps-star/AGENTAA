"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Send,
  Square,
  RotateCcw,
  Trash2,
  Settings,
  Zap,
} from "lucide-react";
import LiquidButton from "../components/LiquidButton";
import TypingDots from "../components/TypingDots";
import GlassIcon from "../components/GlassIcon";
import SmoothScroll from "../components/SmoothScroll";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function HomePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [temperature, setTemperature] = useState(0.4);
  const [isLoading, setIsLoading] = useState(false);
  const [controller, setController] = useState<AbortController | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  const canSend = useMemo(
    () => input.trim().length > 0 && !isLoading,
    [input, isLoading]
  );

  async function sendMessage(text?: string) {
    const content = (text ?? input).trim();
    if (!content) return;
    setInput("");
    const newUser: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    };
    const history = [...messages, newUser];
    setMessages(history);
    setIsLoading(true);
    const abort = new AbortController();
    setController(abort);
    try {
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.map(({ role, content }) => ({ role, content })),
          temperature,
        }),
        signal: abort.signal,
      });
      if (!resp.ok) {
        const info = await resp.text();
        throw new Error(info);
      }
      const data = await resp.json();
      const ai: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.text || "...",
      };
      setMessages((prev) => [...prev, ai]);
    } catch (e) {
      if ((e as any).name === "AbortError") {
        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), role: "assistant", content: "Stopped." },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: "Error fetching response.",
          },
        ]);
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
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
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
    <SmoothScroll>
      <main className="min-h-screen flex flex-col items-center justify-center p-4 lg:p-8">
        {/* Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-r from-neon/5 to-purple/5 blur-3xl"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-r from-teal/5 to-purple/5 blur-3xl"
          />
        </div>

        <div className="w-full max-w-5xl glass-card relative z-10">
          <header className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GlassIcon size="lg" variant="neon">
                <Sparkles className="h-6 w-6 text-neon" />
              </GlassIcon>
              <div>
                <h1 className="heading-primary text-2xl lg:text-3xl">
                  <span className="bg-gradient-to-r from-neon to-purple bg-clip-text text-transparent">
                    Seido
                  </span>
                  <span className="text-slate-100 ml-1">AI</span>
                </h1>
                <p className="heading-secondary text-sm text-slate-400 mt-1">
                  Advanced Intelligence
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="glass-panel rounded-xl px-4 py-2 flex items-center gap-3">
                <Settings className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-400 font-medium">
                  Temperature
                </span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-16 accent-neon"
                />
                <span className="text-xs text-slate-300 font-mono w-8 text-right">
                  {temperature.toFixed(1)}
                </span>
              </div>
              <LiquidButton
                variant="secondary"
                size="sm"
                onClick={clearChat}
                icon={<Trash2 className="h-4 w-4" />}
              >
                Clear
              </LiquidButton>
            </div>
          </header>

          <div
            ref={containerRef}
            className="h-[65vh] lg:h-[70vh] overflow-y-auto rounded-2xl p-4 glass-panel mb-6"
            style={{
              background:
                "linear-gradient(135deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1))",
            }}
          >
            {messages.length === 0 && (
              <div className="h-full flex items-center justify-center">
                <div className="text-center space-y-4">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <GlassIcon size="lg" variant="neon">
                      <Zap className="h-8 w-8 text-neon" />
                    </GlassIcon>
                  </motion.div>
                  <div>
                    <h2 className="heading-primary text-xl text-slate-200 mb-2">
                      Welcome to Seido AI
                    </h2>
                    <p className="text-slate-400 text-sm max-w-md">
                      Start a conversation with our advanced AI assistant. Ask
                      questions, get insights, or explore creative ideas.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                    opacity: { duration: 0.2 },
                  }}
                  className={`mb-4 flex ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] lg:max-w-[75%] rounded-2xl px-5 py-4 ${
                      m.role === "user" ? "bubble-user" : "bubble-ai"
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-sm lg:text-base leading-relaxed text-slate-100">
                      {m.content}
                    </p>
                    <div className="mt-3 flex justify-end">
                      <LiquidButton
                        variant="secondary"
                        size="sm"
                        onClick={() => copyMessage(m.id)}
                      >
                        Copy
                      </LiquidButton>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 flex justify-start"
              >
                <div className="bubble-ai max-w-[60%] rounded-2xl px-5 py-4 pulse-glow">
                  <TypingDots />
                </div>
              </motion.div>
            )}
          </div>

          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
            <div className="flex-1 glass-panel rounded-2xl px-4 py-3 flex items-center gap-3">
              <input
                className="w-full bg-transparent outline-none placeholder:text-slate-400 text-slate-100 text-sm lg:text-base"
                placeholder="Ask Seido AI anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
            </div>

            <div className="flex items-center gap-2">
              <LiquidButton
                onClick={() => sendMessage()}
                disabled={!canSend}
                icon={<Send className="h-4 w-4" />}
              >
                Send
              </LiquidButton>
              <LiquidButton
                variant="secondary"
                onClick={abortRequest}
                disabled={!isLoading}
                icon={<Square className="h-4 w-4" />}
              >
                Stop
              </LiquidButton>
              <LiquidButton
                variant="secondary"
                onClick={regenerate}
                disabled={isLoading || messages.every((m) => m.role !== "user")}
                icon={<RotateCcw className="h-4 w-4" />}
              >
                Retry
              </LiquidButton>
            </div>
          </div>
        </div>
      </main>
    </SmoothScroll>
  );
}
