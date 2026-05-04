  // import { retrieveContext } from "../../../rag/retrieveContext";
  // export async function generalNode(state: any, llm: any) {

  //     //const response = await llm.invoke(state.input || "");
  //     const prompt = `
  //     You are a helpful assistant.
      
  //     Answer the question using ONLY the provided context.
      
  //     - Be concise
  //     - Do NOT return full document
  //     - Extract only relevant answer
      
  //     Context:
  //     ${state.context}
      
  //     Question:
  //     ${state.query}
  //     `;
      
  //     const response = await llm.invoke(prompt);
  //     console.log("generalNode response:", response);
  //     return {...state, response: response.content || "" };
  // }

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