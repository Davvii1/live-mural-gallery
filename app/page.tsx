"use client";

import App from "../App";
import Ably from "ably";
import { AblyProvider, ChannelProvider } from "ably/react";
import { useEffect, useState } from "react";

const ably = new Ably.Realtime({
  authUrl: "/api/token",
  autoConnect: typeof window !== 'undefined',
  clientId: "mural",
});

export default function a() {
  return (
    <AblyProvider client={ably}>
      <ChannelProvider channelName="photos"></ChannelProvider>
    </AblyProvider>
  );
}
