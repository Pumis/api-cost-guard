import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'API Cost Guard - Stop Overpaying for AI APIs | Save 40-70%',
  description: 'Track costs across OpenAI, Anthropic, Google & more. Get instant savings recommendations. Free calculator and budget alerts.',
  keywords: 'AI API costs, OpenAI pricing, Claude pricing, API cost tracking, AI cost optimization',
  openGraph: {
    title: 'API Cost Guard - Stop Overpaying for AI APIs',
    description: 'Track and optimize your AI API costs across all providers. Save 40-70% with smart recommendations.',
    url: 'https://apicostguard.com',
    siteName: 'API Cost Guard',
    images: [
      {
        url: 'https://apicostguard.com/og-image.png', // You'll need to create this
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'API Cost Guard - Stop Overpaying for AI APIs',
    description: 'Track and optimize your AI API costs. Save 40-70%.',
    images: ['https://apicostguard.com/og-image.png'],
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