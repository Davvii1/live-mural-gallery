'use client'

import Ably from 'ably';
import { ReactNode } from 'react';
import { AblyProvider, ChannelProvider } from 'ably/react';


export const AblyWrapper = ({ children }: { children: ReactNode }) => {
    const ably = new Ably.Realtime({
        authUrl: "https://v0-live-mural-gallery-q7dtqa5vvli.vercel.app/api/token",
    });
    
    return (
        <AblyProvider client={ably}>
            <ChannelProvider channelName='photos'>
                {children}
            </ChannelProvider>
        </AblyProvider>
    )
}
