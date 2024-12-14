import * as Ably from "ably";

export const revalidate = 0;

export async function GET(request: Request) {
  const ably = new Ably.Rest({
    key: process.env.ABLY_API_KEY,
    queryTime: true,
  });
  const tokenRequest = await ably.auth.createTokenRequest({
    clientId: "live-gallery-mural",
  });
  return Response.json(tokenRequest);
}
