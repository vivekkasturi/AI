import { Annotation } from "@langchain/langgraph";

export const GraphState = Annotation.Root({
  input: Annotation<string>(),
  plan: Annotation<string>(),
  research_data: Annotation<string>(), // ✅ renamed
  output: Annotation<string>(),
  route: Annotation<string>(),
  general_data: Annotation<string>(),
});

