import { handleChatRequest } from "@/lib/api/chat";

export async function POST(req: Request) {
  return handleChatRequest(req);
}
