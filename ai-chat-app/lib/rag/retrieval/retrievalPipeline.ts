import { createMultiQueryRetriever } from "./multiQueryRetriever";

export const retrieveContext = async (
  query: string,
  llm: any,
  vectorStore: any
) => {
  const retriever = await createMultiQueryRetriever(llm, vectorStore);

  const docs = await retriever.invoke(query);

  const context = docs.map((doc: any) => doc.pageContent).join("\n\n");

  return context;
};