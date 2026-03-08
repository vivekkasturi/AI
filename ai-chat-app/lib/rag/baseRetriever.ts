export const createBaseRetriever = (vectorStore: any) => {
  return vectorStore.asRetriever({
    searchType: "mmr",
    k: 6,
    fetchK: 20,
    lambda: 0.7,
  });
};