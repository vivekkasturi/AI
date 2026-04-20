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
You are a helpful AI assistant.

Answer the user's question using ONLY the provided context.

Context:
{context}

Question:
{input}

Rules:
- Use only the provided context.
- If the answer is not present in the context, say:
  "I don't know based on the provided documents."
- Do not make up information.

Answer:
`);



export const chatChain = prompt
                            .pipe(model)
                            .pipe(new StringOutputParser())
