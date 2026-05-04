export async function generalNode(state: any, llm: any) {

      const prompt = `
    You are a helpful assistant.
    
    Answer the question normally.
    
    Question:
    ${state.input}
    `;
    
      const response = await llm.invoke(prompt);
    
      console.log("generalNode response:", response);
    
      return {
        ...state,
        output: response.content,
      };
    }