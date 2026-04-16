import build from "next/dist/build";
import { rerankDocuments } from "./reranker";
import { getVectorStore } from "./vectorStore";
import { buildContext } from "./contextBuilder";
import { logRAG } from "./ragLogger";
import { log } from "console";

export const retrieveContext = async (query: string, llm: any) => {

  const vectorStore = await getVectorStore();
console.log("vectorStore output:", vectorStore);
  // Step 1: Generate query variations
  // const prompt = `
  // You are helping retrieve documents from a knowledge base.
  
  // Generate exactly 3 different search queries that could help find relevant information.
  
  // Return ONLY the queries.
  // Do not include explanations.
  // Each query must be on a new line.
  
  // User question: ${query}
  // `;

  const prompt = `
You are helping retrieve documents from a company knowledge base.

Generate 3 search queries that are:
- specific
- detailed
- aligned with internal policies

Avoid generic phrases.

Return only queries, one per line.

User question: ${query}
`;
  console.log("User Query:", query);
  const response = await llm.invoke(prompt);
console.log("LLM response for query generation:", response);
  // const generated = response.content
  //   .split("\n")
  //   .map((q: string) => q.trim())
  //   .filter(Boolean);
  const generated = response.content
  .split("\n")
  .map((q: string) => q.replace(/^\d+\.\s*/, "").trim()) // remove "1. "
  .filter((q: string) => q && !q.toLowerCase().includes("here are")); // remove garbage
console.log("Generated query variations:", generated);
  const queries = [query, ...generated];

  console.log("Generated queries:", queries);
  // Step 2: Run vector search
  const docs: any[] = [];

//   for (const q of queries) {
//     const results = await vectorStore.similaritySearchWithScore(q, 6);
//     // docs.push(...results);
//     const filtered = results
//   .filter(([doc, score]) => score > 0.65) // 🔥 threshold
//   .map(([doc]) => doc);
// console.log(`Results for query "${q}":`, filtered, results);
// docs.push(...results);
//   }
// for (const q of queries) {
//   console.log("Searching for:", q);

//   const results = await vectorStore.similaritySearchWithScore(q, 6);

//   const filtered = results
//     .filter(([doc, score]) => score > 0.65)
//     .map(([doc]) => doc);

//   docs.push(...filtered);
// }

for (const q of queries) {
  console.log("Searching for:", q);

  const results = await vectorStore.similaritySearchWithScore(q, 10);

  console.log(
    "RAW RESULTS:",
    results.map(([doc, score]) => ({
      score,
      preview: doc.pageContent.slice(0, 50),
    }))
  );

  docs.push(...results.map(([doc]) => doc));
}
  console.log("Retrieved documents from vector store:", docs);

  console.log(
    "Retrieved Docs:",
    docs.map((d) => d.pageContent)
  );
  // Step 3: Remove duplicate chunks
  const uniqueDocs = Array.from(
    new Map(docs.map((doc) => [doc.pageContent, doc])).values()
  );

  console.log("Unique documents after deduplication:", uniqueDocs);
  const rankedDocs = await rerankDocuments(query, uniqueDocs, llm);
  
    // console.log("Final context to be used for answering:", context);
    // console.log("Context length (characters):", context.length);
    console.log("Docs before reranking:", docs.length);
    console.log("Docs after reranking:", rankedDocs.length);
    console.log(
      "Reranked Docs:",
      rankedDocs.map((d:any) => d.pageContent)
    );

    const context = buildContext(rankedDocs, 1200);
    console.log("Final Context:", context);

    logRAG({
      query,
      rewrittenQuery: generated.join(" | "),
      generatedQueries: generated,
      retrievedDocs: docs,
      rerankedDocs: rankedDocs,
      context,
    });
  return context;
};