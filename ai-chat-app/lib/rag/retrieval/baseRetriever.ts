import { SupabaseVectorStore } from "@langchain/vectorstores/supabase";

export const createBaseRetriever = (vectorStore: SupabaseVectorStore) => {
  return vectorStore.asRetriever({
    k: 6,
  });
};