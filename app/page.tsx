'use client'

import App from "../App"
import Ably from 'ably';
import { AblyProvider, ChannelProvider } from 'ably/react';
import { useEffect, useState } from "react";

export default function SyntheticV0PageForDeployment() {
  const ably = new Ably.Realtime({
    authUrl: "/api/token",
  });
  
  return (
    <AblyProvider client={ably}>
      <ChannelProvider channelName='photos'>
        <App />
      </ChannelProvider>
    </AblyProvider>
  )
}