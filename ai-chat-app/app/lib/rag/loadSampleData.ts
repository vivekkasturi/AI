import { addDocuments } from "./vectorStore";

export async function loadSampleData() {

  const sampleText = `
Refunds are allowed within 30 days of purchase.
Shipping takes 5-7 business days.
Support is available 24/7 via email.
`;

  await addDocuments(sampleText);

  console.log("Sample data loaded");

}
