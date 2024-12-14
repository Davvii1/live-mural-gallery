'use client'

import App from "../App"
import Ably from 'ably';
import { AblyProvider, ChannelProvider } from 'ably/react';

const ably = new Ably.Realtime({
  authUrl: "https://v0-live-mural-gallery-q7dtqa5vvli.vercel.app/api/token",
});

export default function SyntheticV0PageForDeployment() {
  return (
    <AblyProvider client={ably}>
      <ChannelProvider channelName='photos'>
        <App />
      </ChannelProvider>
    </AblyProvider>
  )
}