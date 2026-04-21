import { ChatGroq } from "@langchain/groq";
import { createMultiQueryRetriever } from "./multiQueryRetriever";
import type { RAGDocument } from "../types";

export const retrieveContext = async (
  query: string,
  llm: ChatGroq,
  vectorStore: Parameters<typeof createMultiQueryRetriever>[1]
) => {
  const retriever = await createMultiQueryRetriever(llm, vectorStore);

  const docs: RAGDocument[] = await retriever.invoke(query);

  const context = docs.map((doc) => doc.pageContent).join("\n\n");

  return context;
};