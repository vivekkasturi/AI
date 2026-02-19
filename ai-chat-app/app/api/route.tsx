// app/api/chat/route.ts

import { chatChain } from "../lib/langchain/chatChain";
import  { getHistory }  from "../lib/memory/inMemoryStore";
import { appendMessage } from "../lib/memory/inMemoryStore";

export async function POST(req: Request) {
  const { sessionId, message } = await req.json();

  const history = getHistory(sessionId);

  let fullResponse = "";

  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of await chatChain.stream({
        input: message,
        history
      }))
      {

        fullResponse += chunk;
        controller.enqueue(chunk);
      }

      appendMessage(sessionId, { role: "user", content: message });
      appendMessage(sessionId, { role: "assistant", content: fullResponse });

      controller.close();
    }
  });

  return new Response(stream);
}

