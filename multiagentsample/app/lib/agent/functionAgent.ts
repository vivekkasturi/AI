import { ChatGroq } from "@langchain/groq";
import { weatherTool } from "../tools/weatherTool";

export async function functionAgent(message: string) {
  console.log("🧠 functionAgent IN:", message);

  const llm = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.1-8b-instant",
  });

  // 🔥 Bind tool to LLM
  const llmWithTools = llm.bindTools([weatherTool]);

  // Step 1: Ask LLM
  const response = await llmWithTools.invoke(message);

  console.log("📦 LLM response:", response);

  // Step 2: Check if tool was called
  if (response.tool_calls?.length) {
    const toolCall = response.tool_calls[0];

    console.log("🛠 Tool selected:", toolCall.name);
    console.log("📥 Tool input:", toolCall.args);

    // Step 3: Execute tool
    const result = await weatherTool.invoke(toolCall.args);

    // Step 4: Final response
    return `🌦️ Weather in ${result.location} is ${result.temperature}K with ${result.description}.`;
  }

  // fallback
  return response.content || "No response";
}