import Navbar from '@/components/Navbar'
import Providers from '@/components/Providers'
import { Toaster } from '@/components/ui/toaster'
import { cn } from '@/lib/utils'
import '@/styles/globals.css'
import {Inter} from "next/font/google"

export const metadata = {
  title: 'Forum',
  description: 'A Reddit clone built with Next.js and TypeScript.',
}

const inter = Inter({subsets:['latin']})

export default function RootLayout({
  children,
  authModal
}: {
  children: React.ReactNode,
  authModal: React.ReactNode
}) {
  return (
    <html lang='en' className={cn(
      "bg-white text-slate-900 antialiased light", 
      inter.className)}>
      <body className='min-height-screen antialiased pt-12 bg-slate-50 overflow-y: scroll;'>
        <Providers>
        {/* @ts-expect-error */}
        <Navbar />
        <div className='container mx-auto max-w-7xl h-full pt-12 px-4 sm:px-8'>
          {children}
        </div>
        <Toaster />
        {authModal}
        </Providers>
      </body>
    </html>
  )
}
