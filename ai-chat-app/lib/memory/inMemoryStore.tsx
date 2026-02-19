export type Message = {
    role: "user" | "assistant",
    content: string
}

// global storage
    const memoryStore = new Map<String, Message[]>()

    export function getHistory(sessionId: string):Message[] {

  return memoryStore.get(sessionId) ?? [];

    

    }

    export function appendMessage(sessionId: string, message: Message) {

  const historyMessage = memoryStore.get(sessionId);

  if(!historyMessage){
   return []
  }

  historyMessage.push(message)
}

export function clearSession(sessionId: string){
    memoryStore.delete(sessionId);
}
        

    