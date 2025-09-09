import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'VyomaAI – Gemini 2.5 Pro Agent',
  description: 'A modern, glassy, black-themed AI chat powered by Gemini 2.5 Pro.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}

