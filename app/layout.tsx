'use client'

import './globals.css'
import { AblyWrapper } from '@/components/AblyWrapper'
import Ably from 'ably';
import { ReactNode } from 'react';
import { AblyProvider, ChannelProvider } from 'ably/react';

const ably = new Ably.Realtime({
  authUrl: "https://v0-live-mural-gallery-q7dtqa5vvli.vercel.app/api/token",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (
    <html lang="en">
      <body>
        <AblyProvider client={ably}>
          <ChannelProvider channelName='photos'>
            {children}
          </ChannelProvider>
        </AblyProvider>
      </body>
    </html>
  )
}
