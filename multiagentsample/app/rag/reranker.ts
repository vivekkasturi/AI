export async function rerankDocuments(query: string, docs: any[], llm: any) {
  try {
    if (!docs.length) return [];

    const prompt = `
You are ranking documents based on relevance.

Query: ${query}

Documents:
${docs.map((d, i) => `${i + 1}. ${d.pageContent}`).join("\n\n")}

Return the numbers of the most relevant documents (comma separated).
Example: 1,3
`;

    const response = await llm.invoke(prompt);

    const text = response.content || "";

    const indices = text
      .match(/\d+/g)
      ?.map((n: string) => parseInt(n) - 1)
      .filter((i: number) => i >= 0 && i < docs.length);

    // ✅ If parsing fails → fallback
    if (!indices || indices.length === 0) {
      console.log("⚠️ Reranker fallback triggered");
      return docs;
    }

    return indices.map((i: number) => docs[i]);

  } catch (err) {
    console.log("❌ Reranker failed → fallback", err);
    return docs; // ✅ NEVER break pipeline
  }
}