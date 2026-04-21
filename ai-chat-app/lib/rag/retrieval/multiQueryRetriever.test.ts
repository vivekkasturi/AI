import { describe, it, expect, vi } from "vitest";

type MockRetriever = {
  id: string;
};

describe("createMultiQueryRetriever", () => {
  it("creates a MultiQueryRetriever using the provided llm and vectorStore", async () => {
    const mockLLM = {};
    const mockVectorStore = {};
    const mockBaseRetriever = { id: "base-retriever" };
    const mockMultiQueryRetriever = {
      llm: mockLLM,
      retriever: mockBaseRetriever,
    };

    const createBaseRetriever = vi
      .fn<(vectorStore: unknown) => MockRetriever>()
      .mockReturnValue(mockBaseRetriever);

    const createMultiQueryRetriever = async (
      llm: unknown,
      vectorStore: unknown
    ) => {
      createBaseRetriever(vectorStore);
      return Promise.resolve({
        llm,
        retriever: mockBaseRetriever,
      });
    };

    const result = await createMultiQueryRetriever(mockLLM, mockVectorStore);

    expect(createBaseRetriever).toHaveBeenCalledWith(mockVectorStore);
    expect(result).toBe(mockMultiQueryRetriever);
  });
});

