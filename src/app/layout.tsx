import { Toaster } from "@/components/ui/sonner"
import { type Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Header from '@/FunComponents/Header'
import Footer from '@/FunComponents/footer'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: "Auctionary - Bid Smart. Win Big.",
  description: "Join premium live auctions, bid on unique collectables, and launch your own seller store with secure real-time bidding.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <Header/>
          {children}
            <Toaster />
          <Footer/>
        </body>
      </html>
    </ClerkProvider>
  )
}