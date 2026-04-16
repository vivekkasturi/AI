import path from "path";
import dotenv from "dotenv";

dotenv.config({
  path: path.resolve(process.cwd(), ".env.local"),
});

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { getVectorStore } from "./vectorStore";

async function ingestPDF() {
  try {
    const filePath = path.resolve(
      process.cwd(),
      "app/rag/company-policy.pdf"
    );

    // ✅ THIS IS THE FIX
    const loader = new PDFLoader(filePath);
    const docs = await loader.load();

    console.log("✅ PDF loaded:", docs.length);

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 150,
      chunkOverlap: 30,
    });

    const splitDocs = await splitter.splitDocuments(docs);

    console.log("✅ Chunks:", splitDocs.length);

    const vectorStore = await getVectorStore();

    await vectorStore.addDocuments(splitDocs);

    console.log("🚀 SUCCESS: Clean PDF ingested");

  } catch (err) {
    console.error("❌ Error:", err);
  }
}

ingestPDF();