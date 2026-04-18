export const rerankDocuments = async (query: string, docs: any, llm: any) => {

const docsText = docs.map((doc: any, i:any) => `Docs ${i+1}: ${doc.pageContent}`).join("\n\n");

const prompt = `
You are helping retrieve documents from a knowledge base.
Given the following user question and retrieved documents, rank the documents based on relevance to the question.
Return the document numbers in order of relevance, separated by commas. Do not include any explanations.
User question: ${query}
${docsText}
`;
    const response = await llm.invoke(prompt);
    const order = response.content
    .replace(/\s/g, "")
    .split(",")
    .map((num: string) => parseInt(num) - 1);

  const rankedDocs = order
    .map((index: number) => docs[index])
    .filter(Boolean);

  return rankedDocs.slice(0, 3); // top 3
}