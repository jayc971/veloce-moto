import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Teko, Orbitron, Inter } from 'next/font/google'

const teko = Teko({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-teko'
})

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-orbitron'
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'Veloce Moto - Premium Motorcycle Parts & Accessories',
  description: 'Your trusted source for genuine motorcycle parts and accessories in Sri Lanka. Island-wide delivery, expert support and competitive prices.',
  keywords: ['motorcycle parts', 'bike parts', 'motorcycle accessories', 'motorbike parts', 'Sri Lanka motorcycle parts', 'genuine parts'],
  icons: {
    icon: [
      { url: 'https://i.ibb.co/Ps3HFYh4/veloce-moto-logo.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: 'https://i.ibb.co/Ps3HFYh4/veloce-moto-logo.png', sizes: '192x192', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'Veloce Moto - Premium Motorcycle Parts & Accessories',
    description: 'Your trusted source for genuine motorcycle parts and accessories in Sri Lanka. Island-wide delivery.',
    url: 'https://velocemoto.com',
    siteName: 'Veloce Moto',
    images: [
      {
        url: 'https://i.ibb.co/Ps3HFYh4/veloce-moto-logo.png',
        width: 1200,
        height: 630,
        alt: 'Veloce Moto Logo',
      },
    ],
    locale: 'en_LK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Veloce Moto - Premium Motorcycle Parts & Accessories',
    description: 'Your trusted source for genuine motorcycle parts and accessories in Sri Lanka.',
    images: ['https://i.ibb.co/Ps3HFYh4/veloce-moto-logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased bg-gray-100 ${teko.variable} ${orbitron.variable} ${inter.variable}`}>
        <Header />
        <main className="min-h-screen bg-gray-100">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
