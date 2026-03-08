import build from "next/dist/build";
import { rerankDocuments } from "./reranker";
import { getVectorStore } from "./vectorStore";
import { buildContext } from "./contextBuilder";

export const retrieveContext = async (query: string, llm: any) => {

  const vectorStore = await getVectorStore();
console.log("vectorStore output:", vectorStore);
  // Step 1: Generate query variations
  const prompt = `
  You are helping retrieve documents from a knowledge base.
  
  Generate exactly 3 different search queries that could help find relevant information.
  
  Return ONLY the queries.
  Do not include explanations.
  Each query must be on a new line.
  
  User question: ${query}
  `;

  const response = await llm.invoke(prompt);
console.log("LLM response for query generation:", response);
  const generated = response.content
    .split("\n")
    .map((q: string) => q.trim())
    .filter(Boolean);
console.log("Generated query variations:", generated);
  const queries = [query, ...generated];

  console.log("Generated queries:", queries);
  // Step 2: Run vector search
  const docs: any[] = [];

  for (const q of queries) {
    const results = await vectorStore.similaritySearch(q, 6);
    docs.push(...results);
  }
  console.log("Retrieved documents from vector store:", docs);

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
    

    const context = buildContext(rankedDocs, 1200);

  return context;
};