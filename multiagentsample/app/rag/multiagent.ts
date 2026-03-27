import { ChatGroq } from "@langchain/groq";
import { planner } from "./planner";
import { researchAgent } from "./researchAgent";
import { routeQuery } from "../lib/agent/router";
import { retrieveContext } from "./retrieveContext";

export const multiAgent = async (query: string) => {

const llm = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.1-8b-instant",
    temperature: 0.2,
  });

    console.log("Routing decision0:");
    // Step 0: Classify the query (optional, can be used to route to different pipelines)
    // const isRAG = query.toLowerCase().includes("company policy") || query.toLowerCase().includes("internal document");
    const route = await routeQuery(query, llm);
    console.log("Routing decision:", route);

    if(route === "general") {
        // For general queries, we can directly use the LLM to answer
        const researchResults: string[] = [];
        const researchAgentResult = await researchAgent(query, llm);
        for(const step of researchAgentResult){
            const researchAgentResult = await researchAgent(step, llm);
                    console.log(`Research result for step "${step}":`, researchAgentResult);
                    researchResults.push(`Step: ${step}\nResearch Result: ${researchAgentResult}`);
                }
        const finalResponse = await llm.invoke(`
        Combine the following research results into a final answer.
        User Query:${query}
        Research Results:${researchResults.join("\n")}
        Final Answer:
        `);
        return finalResponse.content;
    }

    console.log("Executing RAG pipeline...");


    // Step 1: Generate a planner agent
    const steps = await planner(query, llm);
    console.log("Generated Plan:", steps);

const response:any = await retrieveContext(query, llm);;

    const finalResponse = await llm.invoke(`
    Combine the following research results into a final answer.
    User Query:${query}
    Research Results:${response}
    Final Answer:
    `);
console.log("LLM response for RAG query:", finalResponse);
    return finalResponse.content;
}

