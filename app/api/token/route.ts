import * as Ably from "ably";

export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const ttlParam = url.searchParams.get("ttl");
    const ttl = ttlParam ? Number.parseInt(ttlParam, 10) : 3600 * 1000;

    const ably = new Ably.Rest({
      key: process.env.ABLY_API_KEY,
      queryTime: true,
    });

    const tokenRequest = await ably.auth.createTokenRequest({
      clientId: "live-gallery-mural",
      ttl: ttl,
    });

    console.log(
      `Token created with TTL: ${ttl}ms for clientId: live-gallery-mural`
    );

    return new Response(JSON.stringify(tokenRequest), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating token request:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create token request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
