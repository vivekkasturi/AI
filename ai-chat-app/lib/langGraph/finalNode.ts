import { GraphState } from "../../../multiagentsample/app/lib/langgraph/types";

function finalNode(state:GraphState, llm:any){
    console.log("👉 finalNode IN:", state);

    const output = state.output || "No answer generated";
    console.log("✅ finalNode OUT:", output);
    return {
        ...state,
        output: output
    }
}

export default finalNode;