import { ChatGroq } from "@langchain/groq";
import type { RAGDocument } from "./types";

export const rerankDocuments = async (
  query: string,
  docs: RAGDocument[],
  llm: ChatGroq
): Promise<RAGDocument[]> => {
  if (docs.length === 0) {
    return [];
  }

  const docsText = docs
    .map((doc, index) => `Docs ${index + 1}: ${doc.pageContent}`)
    .join("\n\n");

  const prompt = `
You are helping retrieve documents from a knowledge base.
Given the following user question and retrieved documents, rank the documents based on relevance to the question.
Return the document numbers in order of relevance, separated by commas. Do not include any explanations.
User question: ${query}
${docsText}
`;
  const response = await llm.invoke(prompt);
  const usedIndexes = new Set<number>();
  const order = response.text
    .replace(/\s/g, "")
    .split(",")
    .map((num) => Number.parseInt(num, 10) - 1)
    .filter((index) => Number.isInteger(index))
    .filter((index) => index >= 0 && index < docs.length)
    .filter((index) => {
      if (usedIndexes.has(index)) {
        return false;
      }

      usedIndexes.add(index);
      return true;
    });

  const rankedDocs = order
    .map((index) => docs[index])
    .filter(Boolean);

  return rankedDocs.slice(0, 3); // top 3
};
