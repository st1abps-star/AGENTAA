"use client";
export default function TypingDots() {
  return (
    <div className="flex items-center gap-1">
      <span className="h-2 w-2 rounded-full bg-gray-300/80 animate-pulseDots" />
      <span className="h-2 w-2 rounded-full bg-gray-300/60 animate-pulseDots" style={{ animationDelay: '0.2s' }} />
      <span className="h-2 w-2 rounded-full bg-gray-300/40 animate-pulseDots" style={{ animationDelay: '0.4s' }} />
    </div>
  );
}

