import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

export const model = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.1-8b-instant", // free model
    temperature: 0.2,
    streaming: true,
  });

const prompt = ChatPromptTemplate.fromTemplate(`
You are a query router.
Classify the user query into one of the following categories:

- "rag" → if the query is about company policies, documents, or internal knowledge
- "general" → if the query is general knowledge (React, coding, world facts, etc.)

Rules:
- Return ONLY one word: rag OR general
- Do not explain

User Query:
{query}

Category:
`);



export const chatChain = prompt
                            .pipe(model)
                            .pipe(new StringOutputParser())
