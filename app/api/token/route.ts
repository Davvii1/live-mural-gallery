import * as Ably from "ably";

export async function GET(request: Request) {
  const ably = new Ably.Rest({
    key: process.env.ABLY_API_KEY,
    queryTime: true,
    clientId: "mural",
  });

  const tokenRequest = await ably.auth.createTokenRequest({
    clientId: "mural",
  });

  return Response.json(tokenRequest);
}
