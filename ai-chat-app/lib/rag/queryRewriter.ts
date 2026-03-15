import { ChatGroq } from "@langchain/groq"
import { PromptTemplate } from "@langchain/core/prompts"

const queryRewriterPrompt = PromptTemplate.fromTemplate(`
Rewrite the user question into a better search query for retrieving documents from a knowledge base.

User Question: {question}

Improved Search Query:
`)

export const rewriterQuery = async (question: string, llm: ChatGroq) => {
const chain = queryRewriterPrompt.pipe(llm);
const response = await chain.invoke({ question });

const rewritten = response.content;
    return rewritten
}
