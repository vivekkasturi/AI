import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import embeddings from "./embedding";
import { Document } from "@langchain/core/documents";

export const vectorStore = new MemoryVectorStore(embeddings);

export const addDocuments = async (text: string) => {
  const doc = new Document({
    pageContent: text,
  });

  await vectorStore.addDocuments([doc]);
};

export const searchDocuments = async (query: string, k: number) => {
  const results = await vectorStore.similaritySearch(query, k);
  return results;
};
