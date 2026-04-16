import { ChatGroq } from "@langchain/groq";
import { planner } from "./planner";
import { retrieveContext } from "./retrievalPipeline";

const llm = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.1-8b-instant",
    temperature: 0.2,
  });

export const agentExecutor = async (query: string, llm:any) => {
    const results: string[] = [];

  try {
    const plan = await planner(query, llm);
    console.log("Generated Plan:", plan);
    // Here you would execute the plan step by step
    // For demonstration, we will just log the steps
    for (const step of plan) {
      console.log(`Executing step: ${step.description}`);
  
      const context = await retrieveContext(step, ChatGroq);

        // Here you would use the context to perform the action
        const response = await llm.invoke(`
        Task:
        ${step}
        
        Context:
        ${context}
        
        Answer:
        `);

        results.push(response.content);
    }

    console.log("Plan execution completed.", results);
  } catch (error) {
    console.error("Error executing agent plan:", error);
  }

  const finalResponse = await llm.invoke(`
  Combine the following results into a final answer.

  User Query:
  ${query}
  
  Results:
  ${results.join("\n")}
  
  Final Answer:
  `)
  
    return finalResponse.content;

};