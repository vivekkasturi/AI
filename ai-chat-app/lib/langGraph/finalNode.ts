import { GraphState } from "../../../multiagentsample/app/lib/langgraph/types";

function finalNode(state:GraphState, llm:any){
    console.log("👉 finalNode IN:", state);

    const history = state.messages
    ?.map(m => `${m.role}: ${m.content}`)
    .join("\n");
    const prompt = `
    You are a helpful assistant.
    
    Conversation:
    ${history}
    
    Answer the latest question:
    ${state.input}
    `;

    return llm.invoke(prompt).then((response:any) => {
        console.log("👉 finalNode OUT:", response);
        return {
            ...state,
            output: response.content,
        }

    });
}

export default finalNode;