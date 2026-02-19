import { loadSampleData } from "@/lib/rag/loadSampleData";
import { vectorStore } from "@/lib/rag/vectorStore";

export async function GET() {

    await loadSampleData();
    const results = await vectorStore.similaritySearch("What is your refund policy?", 1);

    return new Response(JSON.stringify(results), {
        headers: { "Content-Type": "application/json" },
    });
}