import { NextResponse } from "next/server";
import { chatChain, model } from "@/lib/langchain/chatChain";
import { retrieveContext } from "@/lib/rag/retrievalPipeline";

export async function POST(req: Request) {
  const { message } = await req.json();

  const context = await retrieveContext(message, model);

  const response = await chatChain.invoke({
    context,
    input: message,
  });

  return NextResponse.json({
    response,
  });
}