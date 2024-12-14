import Ably from "ably";

export async function POST(request: Request) {
  console.log("Request:", request);
  const ably = new Ably.Rest({
    key: process.env.ABLY_API_KEY,
    queryTime: true,
  });

  const photosChannel = ably.channels.get("photos");

  await photosChannel.publish("photoUploaded", "Here is my first message!");

  return Response.json({ message: "Message sent!" });
}
