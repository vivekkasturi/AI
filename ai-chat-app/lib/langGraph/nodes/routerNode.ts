// import {routeQuery} from "../../agent/router"
// import { GraphState } from "../types";


// export async function routerNode(state: GraphState, llm: any) {

//     const route = await routeQuery(state.query || "", llm);

// return { route };

// }   


export async function routerNode(state: any, llm: any) {
    console.log("👉 router IN:", state);
  
    const input = state.input;
    const query = input.toLowerCase();

    const ragKeywords = [
      "policy",
      "support",
      "refund",
      "shipping",
      "availabile",
      "hours"
    ];
    
    const isRag = ragKeywords.some(k => query.includes(k));
    
    let route = isRag ? "rag" : "general";
  
    const updatedState = {
      ...state,
      query: input,   // ✅ REQUIRED
      route,          // ✅ REQUIRED
    };
  
    console.log("✅ router OUT:", updatedState);
  
    return updatedState;
  }