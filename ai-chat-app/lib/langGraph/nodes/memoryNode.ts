import { GraphState } from "../../../../multiagentsample/app/lib/langgraph/types";

export function memoryNode(state: GraphState){

const messages = state.messages || [];

return {
    ...state,
    messages:[...messages, { role: "user", content: state.input }]
}
};

export default memoryNode;