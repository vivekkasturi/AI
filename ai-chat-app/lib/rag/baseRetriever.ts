type RetrieverFactory = {
  asRetriever: (options: {
    searchType: "mmr";
    k: number;
    fetchK: number;
    lambda: number;
  }) => unknown;
};

export const createBaseRetriever = (vectorStore: RetrieverFactory) => {
  return vectorStore.asRetriever({
    searchType: "mmr",
    k: 6,
    fetchK: 20,
    lambda: 0.7,
  });
};
