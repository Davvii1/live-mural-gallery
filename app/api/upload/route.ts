import Ably from "ably";

export async function POST(request: Request) {
  const ably = new Ably.Rest({
    key: process.env.ABLY_API_KEY,
    queryTime: true,
    clientId: "mural",
  });

  const data = await request.json();

  const photosChannel = ably.channels.get("photos");

  await photosChannel.publish(
    "photoUploaded",
    JSON.stringify({ file: data.file })
  );

  return Response.json({ message: "Message sent!" });
}
