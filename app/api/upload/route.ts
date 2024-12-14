import Ably from "ably";

export async function POST(request: Request) {
  const ably = new Ably.Rest({
    key: process.env.ABLY_API_KEY,
    queryTime: true,
  });

  const photosChannel = ably.channels.get("photos");

  await photosChannel.publish(
    "photoUploaded",
    JSON.stringify({ message: request, body: request.body })
  );

  return Response.json({ message: "Message sent!" });
}
