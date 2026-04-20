import { NextResponse } from "next/server";
import { multiAgent } from "@/lib/rag/multiagent/multiagent";

type ChatRequestBody = {
  message?: string;
};

export const handleChatRequest = async (req: Request): Promise<Response> => {
  try {
    const { message } = (await req.json()) as ChatRequestBody;
    const normalizedMessage = message?.trim();

    if (!normalizedMessage) {
      return NextResponse.json(
        { error: "A non-empty message is required." },
        { status: 400 }
      );
    }

    const result = await multiAgent(normalizedMessage);

    return new Response(result, {
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Chat request failed:", error);

    return NextResponse.json(
      { error: "Unable to process the chat request right now." },
      { status: 500 }
    );
  }
};
