import { ChatGroq } from "@langchain/groq";
import { planner } from "../planner";
import { retrieveContext } from "../retrievalPipeline";
import { routeQuery, type QueryRoute } from "../../agent/router";

const createModel = () =>
  new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.1-8b-instant",
    temperature: 0.2,
  });

const answerGeneralQuery = async (
  query: string,
  llm: ChatGroq
): Promise<string> => {
  const response = await llm.invoke(`
  You are a helpful AI assistant.
  Answer the following user question clearly and directly.

  User Question:
  ${query}

  Answer:
  `);

  console.log("LLM response for general query:", response);
  return response.text.trim();
};

const answerRagQuery = async (
  query: string,
  llm: ChatGroq
): Promise<string> => {
  const steps = await planner(query, llm);
  console.log("Generated Plan:", steps);

  const contextQueries = steps.length > 0 ? steps.slice(0, 3) : [query];
  const researchResults = await Promise.all(
    contextQueries.map(async (step) => {
      console.log(`Researching for step: ${step}`);
      return retrieveContext(step, llm);
    })
  );
  const usableResearch = researchResults.filter(Boolean);

  if (usableResearch.length === 0) {
    return "I couldn't find supporting context in the knowledge base for that question.";
  }

  const finalResponse = await llm.invoke(`
    Combine the following research results into a final answer.

    Use only the research results below when answering.
    If the answer is not supported by the research, say that you don't know based on the available context.

    User Query: ${query}
    Research Results:
    ${usableResearch.join("\n\n")}

    Final Answer:
  `);

  console.log("LLM response for RAG query:", finalResponse);
  return finalResponse.text.trim();
};

const routeHandlers: Record<QueryRoute, (query: string, llm: ChatGroq) => Promise<string>> = {
  general: answerGeneralQuery,
  rag: answerRagQuery,
};

export const multiAgent = async (query: string): Promise<string> => {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return "Please enter a question so I can help.";
  }

  const llm = createModel();
  console.log("Routing decision0:");

  const route = await routeQuery(normalizedQuery, llm);
  console.log("Routing decision:", route);

  return routeHandlers[route](normalizedQuery, llm);
};
