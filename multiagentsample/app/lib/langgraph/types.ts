export type GraphState = {
  input: string;
  messages?:{ role: "user" | "assistant"; content: string }[];
  route: "tool" | "rag" | "general";
  tool_callS?:any[];
  tool_result?:any [];
  output?: string;
}
