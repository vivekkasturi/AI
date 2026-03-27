import { multiAgent } from "../rag/multiagent";

export async function POST(req: Request) {

  const { message } = await req.json();

  const result:any = await multiAgent(message);

  console.log("Final Result from multiAgent:", result);

  return new Response(result, {
    headers: {
      "Content-Type": "text/plain",
    },
  });

} 

