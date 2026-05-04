import { StateGraph, START, END } from "@langchain/langgraph";
import { GraphStateSchema } from "./types";

import { routerNode } from "./nodes/routerNode";
import { plannerNode } from "./nodes/plannerNode";
import { researchNode } from "./nodes/researchNode";
import { writerNode } from "./nodes/writerNode";
import { generalNode } from "./nodes/generalNode";
import finalNode from "./finalNode";
import memoryNode from "./nodes/memoryNode";

export function createGraph(llm: any) {
  const graph = new StateGraph(GraphStateSchema);

  // Nodes
  graph.addNode("memory", memoryNode);
  graph.addNode("router", (s) => routerNode(s, llm));

  graph.addNode("planner", (s) => plannerNode(s, llm));
  graph.addNode("research", (s) => researchNode(s, llm));
  graph.addNode("writer", (s) => writerNode(s, llm));

  graph.addNode("general", (s) => generalNode(s, llm));
  graph.addNode("final", (s) => finalNode(s, llm));

  // Entry
  graph.addEdge(START, "memory");
  graph.addEdge("memory", "router");

  // ✅ ONLY RETURN NODE (NO addEdge here)
  graph.addConditionalEdges("router", (state) => {
    console.log("Routing:", state.route);

    if (state.route === "rag") return "planner";
    if (state.route === "general") return "general";

    return "general"; // fallback
  });

  // ✅ Static flow (outside)
  graph.addEdge("planner", "research");
  graph.addEdge("research", "writer");
  graph.addEdge("writer", "final");

  graph.addEdge("general", "final");

  graph.addEdge("final", END);

  return graph.compile();
}