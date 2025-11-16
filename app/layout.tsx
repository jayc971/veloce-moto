import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Veloce Moto - Premium Automotive Parts & Accessories',
  description: 'Your trusted source for high-quality motor vehicle parts and accessories. Fast shipping, expert support, and competitive prices.',
  keywords: ['automotive parts', 'car parts', 'motorcycle parts', 'auto accessories', 'vehicle parts'],
  openGraph: {
    title: 'Veloce Moto - Premium Automotive Parts & Accessories',
    description: 'Your trusted source for high-quality motor vehicle parts and accessories.',
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
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Veloce Moto - Premium Automotive Parts & Accessories',
    description: 'Your trusted source for high-quality motor vehicle parts and accessories.',
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
      <body className="font-sans antialiased">
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
