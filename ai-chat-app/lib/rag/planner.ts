import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";

const plannerPrompt = PromptTemplate.fromTemplate(`
You are an AI planner.

Break the user query into a list of steps needed to solve it.

User Query:
{query}

Rules:
- Return only the steps
- Each step should be on a new line
- Be concise`
);

export const planner = async (
  query: string,
  llm: ChatGroq
): Promise<string[]> => {
  const chain = plannerPrompt.pipe(llm);
  const response = await chain.invoke({ query });

  return response.text
    .split("\n")
    .map((step) => step.replace(/^[\d\s).:-]+/, "").trim())
    .filter(Boolean);
};
