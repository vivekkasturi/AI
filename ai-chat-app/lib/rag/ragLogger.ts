import type { RAGDocument } from "./types";

type RAGLogPayload = {
  query: string;
  rewrittenQuery: string;
  generatedQueries: string[];
  retrievedDocs: RAGDocument[];
  rerankedDocs: RAGDocument[];
  context: string;
};

export const logRAG = (data: RAGLogPayload): void => {
  console.log(" RAG DEBUG START ====================");
  console.log(" User Query:", data.query);
  console.log(" Rewritten Query:", data.rewrittenQuery);
  console.log(" Generated Queries:", data.generatedQueries);
  console.log(
    " Retrieved Docs:",
    data.retrievedDocs.map((doc) => doc.pageContent)
  );
  console.log(
    " Reranked Docs:",
    data.rerankedDocs.map((doc) => doc.pageContent)
  );
  console.log(" Final Context:", data.context);
  console.log(" RAG DEBUG END ======================");
};
