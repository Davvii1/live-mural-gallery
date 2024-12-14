'use client'

import App from "../App"
import Ably from 'ably';
import { AblyProvider, ChannelProvider } from 'ably/react';

export default function SyntheticV0PageForDeployment() {
  const ably = new Ably.Realtime({
    authUrl: "https://v0-live-mural-gallery-q7dtqa5vvli.vercel.app/api/token",
    clientId: "*"
  });

  return (
    <AblyProvider client={ably}>
      <ChannelProvider channelName='photos'>
        <App />
      </ChannelProvider>
    </AblyProvider>
  )
}