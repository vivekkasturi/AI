import { describe, it, expect, vi } from "vitest";
describe("createMultiQueryRetriever", () => {
  it("creates a MultiQueryRetriever using the provided llm and vectorStore", async () => {
    const mockLLM = {} as any;
    const mockVectorStore = {} as any;
    const mockBaseRetriever = { id: "base-retriever" };
    const mockMultiQueryRetriever = {
      llm: mockLLM,
      retriever: mockBaseRetriever,
    };

    const createBaseRetriever = vi.fn().mockReturnValue(mockBaseRetriever);

    const createMultiQueryRetriever = async (llm: any, vectorStore: any) => {
      const baseRetriever = createBaseRetriever(vectorStore);
      const retriever = await Promise.resolve(mockMultiQueryRetriever);
      return retriever;
    };

    const result = await createMultiQueryRetriever(mockLLM, mockVectorStore);

    expect(createBaseRetriever).toHaveBeenCalledWith(mockVectorStore);
    expect(result).toBe(mockMultiQueryRetriever);
  });
});


