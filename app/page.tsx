"use client"

import App from "../App"
import { useChannel } from "ably/react";

// export const revalidate = 0

export default function SyntheticV0PageForDeployment() {
  const { channel } = useChannel('photos', 'photoUploaded', (message) => {
    console.log(message);
  });


  return <App />
}