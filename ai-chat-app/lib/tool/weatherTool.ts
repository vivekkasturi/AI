import { tool } from "@langchain/core/tools";
import { z } from "zod";

export const weatherTool = tool(
  async ({ location }: { location: string }) => {
    console.log("🌤️ Fetching weather for:", location);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.OPENWEATHER_API_KEY}`
      );

      const data = await res.json();
console.log("🌤️ Weather API response:", data);
      return {
        location,
        temperature: data.main?.temp,
        description: data.weather?.[0]?.description,
      };
    } catch (error) {
      console.error("❌ Weather API error:", error);
      return {
        location,
        error: "Failed to fetch weather",
      };
    }
  },
  {
    name: "get_weather",
    description: "Get current weather for a given city",
    schema: z.object({
      location: z.string().describe("City name"),
    }),
  }
);