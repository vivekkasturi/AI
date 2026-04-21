import type { BaseRetrieverInterface } from "@langchain/core/retrievers";

type RetrieverFactory = {
  asRetriever: (options: {
    k: number;
  }) => BaseRetrieverInterface;
};

export const createBaseRetriever = (vectorStore: RetrieverFactory) => {
  return vectorStore.asRetriever({
    k: 6,
  });
};
