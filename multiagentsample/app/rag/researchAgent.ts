import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";

const researchAgentPrompt = PromptTemplate.fromTemplate(`
You are a research agent.

Your job is to gather useful information to complete the task.

Task:
{task}

Provide relevant information concisely.`
);

export const researchAgent = async(task:string, llm: ChatGroq) => {

    const chain = researchAgentPrompt.pipe(llm);
    const response:any = await chain.invoke({task});
    const steps = response.content.split("\n").map((s:string) => s.trim()).filter(Boolean);
    return steps;
}