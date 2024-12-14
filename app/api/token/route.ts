import * as Ably from "ably";

export async function GET(request: Request) {
  const ably = new Ably.Rest({ key: process.env.ABLY_API_KEY });

  const tokenRequest = await ably.auth.createTokenRequest({ clientId: "*" });

  return Response.json(tokenRequest);
}
