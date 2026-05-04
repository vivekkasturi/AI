// import { NextResponse } from "next/server";
// import { ChatGroq } from "@langchain/groq";
// import { createGraph } from "@/lib/langGraph/graph";

// export async function POST(req: Request) {
//   const { message } = await req.json();

//   const llm = new ChatGroq({
//     apiKey: process.env.GROQ_API_KEY!,
//     model: "llama-3.1-8b-instant",
//   });

// const response = createGraph(llm);

//   console.log("LLM Response:", response);
//   return NextResponse.json({
//     response: response.output,
//   });
// }
import { NextResponse } from "next/server";
import { ChatGroq } from "@langchain/groq";
import { createGraph } from "@/lib/langGraph/graph";

export async function POST(req: Request) {
  const { message } = await req.json();

  // ✅ Step 1: Create LLM
  const llm = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY!,
    model: "llama-3.1-8b-instant",
  });

  // ✅ Step 2: Build graph
  const graph = createGraph(llm);

  // ✅ Step 3: Execute graph
  const result = await graph.invoke({
    input: message,
    messages: [],
  });

  console.log("GRAPH RESULT:", result);

  // ✅ Step 4: Return ONLY output
  return NextResponse.json({
    response: result.output || "No response",
  });
}