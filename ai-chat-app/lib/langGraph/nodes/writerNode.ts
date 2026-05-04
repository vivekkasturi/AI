export async function writerNode(state: any, llm: any) {
    console.log("✍️ writerNode IN:", state);
    const context = state.context || "";
  const query = state.query || state.input;
    const prompt = `
    You are a helpful assistant.

    Answer ONLY from the context.
    
    Context:
    ${context}
    
    Question:
    ${query}

  `;
  
    const response = await llm.invoke(prompt);
    console  .log("✍️ writerNode context before return:", context);
    console  .log("✍️ writerNode query before return:", query);
  console.log("✍️ writerNode response:", response);
  console  .log("✍️ writerNode state before return:", state);
    return {
      ...state,
      output: response.content, // ✅ THIS is used in API
    };
  }