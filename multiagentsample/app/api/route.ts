import { NextRequest } from "next/server";
import { functionAgent } from "../lib/agent/functionAgent";
export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    console.log("📩 Incoming:", message);

    const result = await functionAgent(message);

    console.log("✅ Agent Result:", result);

    return new Response(result, {
      headers: { "Content-Type": "text/plain" },
    });

  } catch (err: any) {
    console.error("🔥 ERROR:", err);

    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}