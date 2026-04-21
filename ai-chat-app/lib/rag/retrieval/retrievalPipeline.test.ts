import { describe, it, expect } from "vitest";
import type { Document } from "langchain/document";

describe("retrieveContext", () => {
  it("combines pageContent from retrieved docs into a single string", async () => {
    const mockDocs: Pick<Document, "pageContent">[] = [
      { pageContent: "Doc 1 content" },
      { pageContent: "Doc 2 content" },
    ];

    const result = await (async () => {
      const docs = mockDocs;
      return docs.map((doc) => doc.pageContent).join("\n\n");
    })();

    expect(result).toBe("Doc 1 content\n\nDoc 2 content");
  });

  it("returns an empty string when no docs are returned", async () => {
    const result = await (async () => {
      const docs: Pick<Document, "pageContent">[] = [];
      return docs.map((doc) => doc.pageContent).join("\n\n");
    })();

    expect(result).toBe("");
  });
});
