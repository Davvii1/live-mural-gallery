'use client'

import './globals.css'
import { AblyWrapper } from '@/components/AblyWrapper'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (
    <html lang="en">
      <body>
        <AblyWrapper>
          {children}
        </AblyWrapper>
      </body>
    </html>
  )
}
