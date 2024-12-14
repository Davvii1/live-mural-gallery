import App from "../App"
import { useChannel } from "ably/react";
import Ably from 'ably';
import { AblyProvider, ChannelProvider } from 'ably/react';

export const revalidate = 0

const ably = new Ably.Realtime({
  authUrl: "https://v0-live-mural-gallery-q7dtqa5vvli.vercel.app/api/token",
});

export default async function SyntheticV0PageForDeployment() {
  return (
    <AblyProvider client={ably}>
      <ChannelProvider channelName='photos'>
        <App />
      </ChannelProvider>
    </AblyProvider>
  )
}