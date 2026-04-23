// import { app } from "../lib/langgraph/graph";

// export async function POST(req: Request) {
//   const { message } = await req.json();
//   console.log("Message from LangGraph:", message);

//   const result = await app.invoke({
//     query: message,
//   });

//   console.log("Final Result from LangGraph:", result);
//   return new Response(result.answer, {
//     headers: {
//       "Content-Type": "text/plain",
//     },
//   });
// }

// import { NextRequest } from "next/server";
// import { ChatGroq } from "@langchain/groq";
// import { createGraph } from "@/app/lib/langgraph/graph";

// export async function POST(req: NextRequest) {
//   try {
//     const { message } = await req.json();

//     const llm = new ChatGroq({
//       apiKey: process.env.GROQ_API_KEY,
//       model: "llama-3.1-8b-instant",
//     });

//     const graph = createGraph(llm);

//     const result = await graph.invoke({
//         input: message,
//       });
//       console.log("Final Result from LangGraph:", result);
//       // 🔥 IMPORTANT FIX
//       const finalAnswer =
//         result.general_data ||
//         result.output ||
//         "No response";
      
//       return new Response(finalAnswer, {
//         headers: {
//           "Content-Type": "text/plain",
//         },
//       });
//   } catch (err: any) {
//     console.error("🔥 ERROR:", err);
//     return new Response(JSON.stringify({ error: err.message }), {
//       status: 500,
//     });
//   }
// }

// export async function routerNode(state: any) {
//     const query = state.input;
  
//     if (query.toLowerCase().includes("policy")) {
//       return { ...state, route: "rag", query };
//     }
  
//     return {
//       ...state,
//       route: "general", // ✅ MUST
//       query,
//     };
//   }



import { NextRequest } from "next/server";
import { ChatGroq } from "@langchain/groq";
import { functionAgentLoop } from "../lib/agent/functionAgentLoop";
// ✅ MUST be named export
export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    const llm = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      model: "llama-3.1-8b-instant",
    });

   const result = await functionAgentLoop(message);

    // const result = await graph.invoke({
    //   input: message,
    // });

    console.log("Final Result from LangGraph:", result);

    const finalAnswer =
      result.general_data ||
      result.output ||
      "No response";

    return new Response(finalAnswer, {
      headers: {
        "Content-Type": "text/plain",
      },
    });

  } catch (err: any) {
    console.error("🔥 ERROR:", err);

    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 }
    );
  }
}

// export async function routerNode(state: any) {
//     console.log("👉 router IN:", state);
  
//     const query = state.input;
  
//     let route = "general";
  
//     if (query.toLowerCase().includes("policy")) {
//       route = "rag";
//     }
  
//     const updatedState = {
//       ...state,
//       query,        // ✅ VERY IMPORTANT
//       route,        // ✅ VERY IMPORTANT
//     };
  
//     console.log("✅ router OUT:", updatedState);
  
//     return updatedState;
//   }