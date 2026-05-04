import {z} from "zod";

export const GraphStateSchema = z.object({
    input: z.string(),
    route: z.enum(["tool", "rag", "general"]).optional(),  
    output: z.string().optional(),
    tool_calls: z.array(z.any()).optional(),
    tool_results: z.array(z.any()).optional(),
    position: z.object({
        x: z.number(),
        y: z.number(),
    }),
});