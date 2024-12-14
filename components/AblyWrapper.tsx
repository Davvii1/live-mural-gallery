'use client'

import Ably from 'ably';
import { ReactNode } from 'react';
import { AblyProvider, ChannelProvider } from 'ably/react';


export const AblyWrapper = ({ children }: { children: ReactNode }) => {
    return (<></>
        // <AblyProvider client={ably}>
        //     <ChannelProvider channelName='photos'>
        //         {children}
        //     </ChannelProvider>
        // </AblyProvider>
    )
}
