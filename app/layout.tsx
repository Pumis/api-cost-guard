import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'API Cost Guard - Stop Overpaying for AI APIs',
  description: 'Track costs across OpenAI, Anthropic, Google & more. Get instant savings recommendations. Never blow your budget again.',
  keywords: ['API cost', 'OpenAI pricing', 'Claude pricing', 'LLM cost tracking', 'AI API monitoring'],
  authors: [{ name: 'API Cost Guard' }],
  openGraph: {
    title: 'API Cost Guard - Stop Overpaying for AI APIs',
    description: 'Track and optimize your AI API costs across all providers',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'API Cost Guard',
    description: 'Stop overpaying for AI APIs',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}