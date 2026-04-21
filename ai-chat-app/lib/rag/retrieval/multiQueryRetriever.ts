import { MultiQueryRetriever } from "@langchain/classic/retrievers/multi_query";
import { ChatGroq } from "@langchain/groq";
import { createBaseRetriever } from "./baseRetriever";

type VectorStoreInput = Parameters<typeof createBaseRetriever>[0];

export const createMultiQueryRetriever = async (
  llm: ChatGroq,
  vectorStore: VectorStoreInput
) => {
  const baseRetriever = createBaseRetriever(vectorStore);

  const retriever = await MultiQueryRetriever.fromLLM({
    llm,
    retriever: baseRetriever,
  });

  return retriever;
};
