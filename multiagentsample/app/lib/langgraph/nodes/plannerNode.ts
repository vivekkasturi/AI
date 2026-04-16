export async function plannerNode(state: any, llm: any) {
    console .log("🧠 plannerNode IN:", state);
    return {
      ...state,
       plan: "Retrieve relevant documents and answer from them", // ✅ simple
    };
  }