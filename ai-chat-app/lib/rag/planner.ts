import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";

const plannerPrompt = PromptTemplate.fromTemplate(`
You are an AI planner.

Break the user query into a list of steps needed to solve it.

Rules:
- Return only the steps
- Each step should be on a new line
- Be concise`
);

export const planner = async(query:string, llm: ChatGroq) => {
    const chain = plannerPrompt.pipe(llm);
    const response:any = await chain.invoke({query});
    const steps = response.content.split("\n").map((s:string) => s.trim()).filter(Boolean);
    return steps;
}