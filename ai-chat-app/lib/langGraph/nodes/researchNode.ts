import { retrieveContext } from "../../rag/retrieveContext";

export async function researchNode(state: any, llm: any) {
  console.log("🔍 researchNode IN:", state);

  const query = state.query || state.input; // ✅ fallback

  const context = await retrieveContext(query, llm); // ✅ correct
console.log("🔍 researchNode retrieved context:", context);
console.log("🔍 researchNode state before return:", state);
  return {
    ...state,
    context: context,
  };
}