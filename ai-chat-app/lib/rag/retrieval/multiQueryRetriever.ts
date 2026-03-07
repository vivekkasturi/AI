import { MultiQueryRetriever } from "@langchain/community/retrievers/multi_query";
import { createBaseRetriever } from "./baseRetriever";

export const createMultiQueryRetriever = async (llm: any, vectorStore: any) => {
  const baseRetriever = createBaseRetriever(vectorStore);

  const retriever = await MultiQueryRetriever.fromLLM({
    llm,
    retriever: baseRetriever,
  });

  return retriever;
};