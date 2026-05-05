const memoryStore = new Map<string, any[]>();

const MAX_HISTORY = 10;

export function getHistory(sessionId:string):any{
    console.log(`Retrieving memory for session ${sessionId}. Current memory:`, memoryStore.get(sessionId));
    return memoryStore.get(sessionId) ?? [];
    
};

export function setMemory(sessionId:string, messages: any[]){
    const history = memoryStore.get(sessionId) ?? [];
    const newHistory = [...history, ...messages].slice(-MAX_HISTORY);
    memoryStore.set(sessionId, newHistory);
    console.log(`Memory updated for session ${sessionId}. Current memory:`, newHistory);
}