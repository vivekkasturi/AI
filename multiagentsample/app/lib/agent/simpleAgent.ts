import { weatherTool } from "../tools/weatherTool";
import { ChatGroq } from "@langchain/groq";

const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.1-8b-instant",
});

export async function simpleAgent(message: string) {
  console.log("🧠 simpleAgent IN:", message);

  const extractCityPrompt = `
  Extract the city name from the user query.
  
  Rules:
  - Return ONLY the city name
  - Do NOT return a sentence
  - Do NOT add extra words
  - Example:
    Input: "Weather in Bangalore"
    Output: Bangalore
  
  Query: ${message}
  `;

const response = await llm.invoke(extractCityPrompt);

const location = response.content.trim();

console.log("📍 Extracted location:", location);


const weatherReport = await weatherTool.invoke({ location });

    return `🌦️ Weather in ${weatherReport.location} is ${weatherReport.temperature}K with ${weatherReport.description}.`;
  }
