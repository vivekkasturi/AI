import { ChatGroq } from "@langchain/groq";
import { rerankDocuments } from "./reranker";
import { getVectorStore } from "./vectorStore";
import { buildContext } from "./contextBuilder";
import { logRAG } from "./ragLogger";
import type { RAGDocument } from "./types";

export const retrieveContext = async (
  query: string,
  llm: ChatGroq
): Promise<string> => {
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
  console.log("User Query:", query);
  const response = await llm.invoke(prompt);
  console.log("LLM response for query generation:", response);
  const generated = response.text
    .split("\n")
    .map((candidate) => candidate.trim())
    .filter(Boolean);
  console.log("Generated query variations:", generated);
  const queries = [query, ...generated];

  console.log("Generated queries:", queries);
  // Step 2: Run vector search
  const docs: RAGDocument[] = [];

  for (const q of queries) {
    const results = await vectorStore.similaritySearch(q, 6);
    docs.push(...results);
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

  console.log("Docs before reranking:", docs.length);
  console.log("Docs after reranking:", rankedDocs.length);
  console.log(
    "Reranked Docs:",
    rankedDocs.map((doc) => doc.pageContent)
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
