import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";

const plannerPrompt = PromptTemplate.fromTemplate(`
You are an AI planner.

Break the user query into steps.

Rules:
- Each step on new line
- No explanations

User Query:
{query}

Steps:
`);

export const planner = async(query:string, llm: ChatGroq) => {
    const chain = plannerPrompt.pipe(llm);
    const response:any = await chain.invoke({query});
    const steps = response.content.split("\n").map((s:string) => s.trim()).filter(Boolean);
    return steps;
}