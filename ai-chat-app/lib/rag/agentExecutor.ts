import { ChatGroq } from "@langchain/groq";
import { planner } from "./planner";
import { retrieveContext } from "./retrievalPipeline";

export const agentExecutor = async (
  query: string,
  llm: ChatGroq
): Promise<string> => {
  const results: string[] = [];

  try {
    const plan = await planner(query, llm);
    console.log("Generated Plan:", plan);

    for (const step of plan) {
      console.log(`Executing step: ${step}`);
      const context = await retrieveContext(step, llm);

      const response = await llm.invoke(`
        Task:
        ${step}

        Context:
        ${context}

        Answer:
        `);

      results.push(response.text);
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
  `);

  return finalResponse.text;
};
