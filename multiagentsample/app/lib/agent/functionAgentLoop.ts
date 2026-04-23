import { ChatGroq } from "@langchain/groq";
import { weatherTool } from "../tools/weatherTool"

export default async function agentLoop(message: string) {
  const llm = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.1-8b-instant",
  });

  const tools = [weatherTool];

  const toolsMap = Object.fromEntries(
    tools.map(tool => [tool.name, tool])
  );

  const llmWithTools = llm.bindTools(tools);

  let currentInput = message;

  for (let i = 0; i < 5; i++) { // max steps
    console.log(`🔁 Iteration ${i + 1}`);

    const response = await llmWithTools.invoke(currentInput);

    // 🔥 If LLM gives final answer
    if (!response.tool_calls?.length) {
      return response.content;
    }

    // 🔥 If LLM wants to call tool
    const toolCall = response.tool_calls[0];

    const tool = toolsMap[toolCall.name];

    if (!tool) {
      return `❌ Tool ${toolCall.name} not found`;
    }

    const result = await tool.invoke(toolCall.args);

    console.log("🛠 Tool result:", result);

    // 🔥 Feed result BACK to LLM
    currentInput = `
    Tool ${toolCall.name} returned:
    ${JSON.stringify(result)}

    Continue the task.
    `;
  }

  return "❌ Max iterations reached";
}