import { retrieveContext } from "@/lib/rag/retrieval/retrievalPipeline";
import { chatChain } from "@/lib/langchain/chatChain";

export async function POST(req: Request) {

  const { message } = await req.json();

  const context = await retrieveContext(message, model, vectorStore);

  const response = await chatChain.invoke({
    context,
    input: message,
  });

  return Response.json({ response });

}