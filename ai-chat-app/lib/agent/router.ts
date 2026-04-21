import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";

export type QueryRoute = "general" | "rag";

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

const VALID_ROUTES = new Set<QueryRoute>(["general", "rag"]);

export const routeQuery = async (
  query: string,
  llm: ChatGroq
): Promise<QueryRoute> => {
  const chain = multiAgentPrompt.pipe(llm);
  const response = await chain.invoke({ query });
  const normalizedRoute = response.text.trim().toLowerCase();

  return VALID_ROUTES.has(normalizedRoute as QueryRoute)
    ? (normalizedRoute as QueryRoute)
    : "general";
};
