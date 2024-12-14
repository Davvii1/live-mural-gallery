'use client'

import App from "../App"
import Ably from 'ably';
import { AblyProvider, ChannelProvider } from 'ably/react';
import { useEffect, useState } from "react";

export default function SyntheticV0PageForDeployment() {
  const [ably, setAbly] = useState<Ably.Realtime | null>(null);

  useEffect(() => {
    const ablyClient = new Ably.Realtime({
      authUrl: "https://v0-live-mural-gallery-q7dtqa5vvli.vercel.app/api/token",
      defaultTokenParams: {
        clientId: "*"
      }
    });
    setAbly(ablyClient);
  }, []);

  if (!ably) {
    return <div>Loading...</div>;
  }

  return (
    <AblyProvider client={ably}>
      <ChannelProvider channelName='photos'>
        <App />
      </ChannelProvider>
    </AblyProvider>
  )
}