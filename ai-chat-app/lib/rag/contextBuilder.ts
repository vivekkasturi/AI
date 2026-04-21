import type { RAGDocument } from "./types";

export const buildContext = (
  docs: RAGDocument[],
  maxTokens: number = 1200
): string => {
  let totalTokens = 0;
  const selectedDocs: RAGDocument[] = [];

  for (const doc of docs) {
    const docTokens = doc.pageContent.length / 4;

    if (totalTokens + docTokens > maxTokens) {
      break;
    }

    selectedDocs.push(doc);
    totalTokens += docTokens;
  }

  return selectedDocs.map((doc) => doc.pageContent).join("\n\n");
};
