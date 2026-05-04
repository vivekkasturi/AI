// import { routerNode } from "./nodes/routerNode";
// import { writerNode } from "./nodes/writerNode";
// import { StateGraph } from "@langchain/langgraph";
// import { ChatGroq } from "@langchain/groq";

// import { plannerNode } from "./nodes/plannerNode";
// import { researchNode } from "./nodes/researchNode";
// import { generalNode } from "./nodes/generalNode";

// import { GraphState } from "./types";
// import { START, END } from "@langchain/langgraph";

// // ✅ Create Graph - Note: Ensure you pass your State definition here
// const graph = new StateGraph<GraphState>({
// });  

// // 🧩 Nodes
// graph.addNode("router", (state) => routerNode(state, llm));
// graph.addNode("planner", (state) => plannerNode(state, llm));
// graph.addNode("research", (state) => researchNode(state, llm));
// graph.addNode("writer", (state) => writerNode(state, llm));
// graph.addNode("general", (state) => generalNode(state, llm));

// // 🚀 Entry - Using the START constant
// graph.addEdge(START, "router");

// // 🔀 Conditional Routing
// graph.addConditionalEdges("router", (state) => {
//     if (state.route === "rag") return "planner";
//     return "general";
// });

// // 🔗 RAG Flow 
// // Removed the duplicate and the comment about "__start__"
// graph.addEdge("planner", "research");
// graph.addEdge("research", "writer");

// // 🏁 Finish - Use END constant instead of setFinishPoint
// graph.addEdge("writer", END);
// graph.addEdge("general", END);

// // ✅ Compile
// export const app = graph.compile();

// Below one is working

// import { StateGraph, START, END } from "@langchain/langgraph";
// import { GraphState } from "./types";

// import { routerNode } from "./nodes/routerNode";
// import { plannerNode } from "./nodes/plannerNode";
// import { researchNode } from "./nodes/researchNode";
// import { writerNode } from "./nodes/writerNode";
// import { generalNode } from "./nodes/generalNode";
// export function createGraph(llm: any) {
//     const graph = new StateGraph(GraphState);
//   console.log("know the graph:", graph);
//   // Nodes
//   graph.addNode("router", (state) => routerNode(state));
//   graph.addNode("planner", (state) => plannerNode(state, llm));

//   // ✅ IMPORTANT FIX
//   graph.addNode("research_node", (state) => researchNode(state));

//   graph.addNode("writer", (state) => writerNode(state, llm));
// graph.addNode("general", (state) => generalNode(state, llm));

//   graph.addEdge(START, "router");

//   graph.addConditionalEdges("router", (state) => {
//     console.log("Routing decision based on state:", state.route);
//     if (state.route === "rag") return "planner";
//     return "general"; // Directly route to writer if not RAG
//   });

//   // Flow (EXPLICIT)

//   graph.addEdge("planner", "research_node");
//   graph.addEdge("research_node", "writer");
//   graph.addEdge("writer", END);
//   graph.addEdge("general", END);

//   return graph.compile();
// }

// New one below 

// import { StateGraph, START, END } from "@langchain/langgraph";
// import { GraphState } from "./types";

// import { routerNode } from "./nodes/routerNode";
// import { plannerNode } from "./nodes/plannerNode";
// import { researchNode } from "./nodes/researchNode";
// import { writerNode } from "./nodes/writerNode";
// import { generalNode } from "./nodes/generalNode";

// export function createGraph(llm: any) {
//   const graph = new StateGraph(GraphState);

//   // Nodes
//   graph.addNode("router", (state) => routerNode(state, llm));
//   graph.addNode("planner", (state) => plannerNode(state, llm));
//   graph.addNode("research_node", (state) => researchNode(state));
//   graph.addNode("writer", (state) => writerNode(state, llm));
//   graph.addNode("general", (state) => generalNode(state, llm));

//   // ✅ START always required
//   graph.addEdge(START, "router");

//   // ✅ CONDITIONAL ROUTING (NO addEdge for router)
//   graph.addConditionalEdges("router", (state) => {
//     if (state.route === "rag") return "planner";
//     return "general";
//   });

//   // ✅ RAG flow
//   graph.addEdge("planner", "research_node");
//   graph.addEdge("research_node", "writer");

//   // ✅ END always required
//   graph.addEdge("writer", END);
//   graph.addEdge("general", END);

//   return graph.compile();
// }

// updated
import { StateGraph, START, END } from "@langchain/langgraph";
import { GraphState } from "./types";

import { routerNode } from "./nodes/routerNode";
import { plannerNode } from "./nodes/plannerNode";
import { researchNode } from "./nodes/researchNode";
import { writerNode } from "./nodes/writerNode";
import { generalNode } from "./nodes/generalNode";
import { retrieveContext } from "@/app/rag/retrieveContext";
import finalNode from "../../../../ai-chat-app/lib/langGraph/finalNode";
import memoryNode from "../../../../ai-chat-app/lib/langGraph/memory/memoryNode";

export function createGraph(llm: any) {
  const graph = new StateGraph(GraphState);

  graph.addNode("router", (state) => routerNode(state, llm));
  graph.addNode("planner", (state) => plannerNode(state, llm));
  graph.addNode("research_node", (state) => researchNode(state,llm));
  graph.addNode("writer", (state) => writerNode(state, llm));
  graph.addNode("general", (state) => generalNode(state, llm)); // ✅
  graph.addNode("final", (state) => finalNode(state, llm)); // ✅
  graph.addNode("memory", (state) => memoryNode(state)); // ✅

  graph.addEdge(START, "router");

  graph.addConditionalEdges("router", async (state) => {
    console.log("Routing decision based on state:", state.route);
    if (state.route === "rag") return "rag";{
      // ✅ For RAG, we go through the planner, research, and writer nodes
      graph.addEdge("planner", "research_node");
      graph.addEdge("research_node", "writer");
      graph.addEdge("writer", "final"); // ✅ After writing, go to final node
    }
    if (state.route === "tool") return "tool";{
      // ✅ For Tool use case, we can directly go to a memory node or a tool execution node
      graph.addEdge("tool", "memory"); // Example: after deciding to use a tool, we go to memory to store the interaction
      graph.addEdge("memory", "final"); // Then we go to final node
    }
    if (state.route === "general") return "general";
  });
  

  return graph.compile();
}