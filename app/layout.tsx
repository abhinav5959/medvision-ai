import type { Metadata, Viewport } from 'next'
import { Sora, Inter, JetBrains_Mono } from 'next/font/google'
import '@/app/globals.css'
import { CursorProvider } from '@/lib/cursor-context'
import { CustomCursor } from '@/components/custom-cursor'
import { Providers } from '@/components/providers'

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'MedVision AI — AI Medical Imaging Intelligence Platform',
  description:
    'The world’s most trusted AI-powered medical imaging investigation platform. Specializing in high-precision orthopedic fracture analysis with explainable Grad-CAM heatmaps and clinician-in-the-loop workflows.',
  keywords: ['AI Medical Imaging', 'Radiology AI', 'Orthopedic Fracture Analysis', 'Grad-CAM', 'Healthcare AI', 'MedVision AI'],
  authors: [{ name: 'MedVision AI Engineering Team' }],
}

export const viewport: Viewport = {
  themeColor: '#050b14',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${inter.variable} ${jetbrainsMono.variable} dark`}
      style={{ colorScheme: 'dark' }}
    >
      <body className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-cyan/30 selection:text-foreground">
        <Providers>
          <CursorProvider>
            <CustomCursor />
            {children}
          </CursorProvider>
        </Providers>
      </body>
    </html>
  )
}
