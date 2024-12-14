import * as Ably from "ably";

const ably = new Ably.Rest({
  key: process.env.ABLY_API_KEY,
  queryTime: true,
});

export async function GET(request: Request) {
  const tokenRequest = await ably.auth.createTokenRequest({ clientId: "*" });

  return Response.json(tokenRequest);
}
