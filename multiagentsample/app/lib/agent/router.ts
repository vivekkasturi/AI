import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";

const multiAgentPrompt = PromptTemplate.fromTemplate(`
You are a query router.
Classify the user query into one of the following categories:

- "rag" → if the query is about company policies, documents, or internal knowledge
- "general" → if the query is general knowledge (React, coding, world facts, etc.)

Rules:
- Return ONLY one word: rag OR general
- Do not explain

User Query:
{query}

Category:`)


const llm = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
   // model: "llama-3.1-8b-instant",
   model:"mxbai-embed-large",
    temperature: 0,
  });

export const routeQuery = async (query: string,llm:ChatGroq
    
) => {


    const chain = multiAgentPrompt.pipe(llm);
    const response :any = await chain.invoke({query});
  return response.content;
  }
  

// export async function routerNode(state: any) {
//     console.log("👉 router IN:", state);
  
//     const newState = {
//       ...state,
//     };
  
//     console.log("✅ router OUT:", newState);
//     return newState;
//   }