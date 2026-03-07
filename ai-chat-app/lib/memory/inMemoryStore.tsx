export type Message = {
  role: "user" | "assistant";
  content: string;
};

const memoryStore = new Map<string, Message[]>();

export function getHistory(sessionId: string): Message[] {
  return memoryStore.get(sessionId) ?? [];
}

export function appendMessage(sessionId: string, message: Message): void {
  const history = memoryStore.get(sessionId) ?? [];
  history.push(message);
  memoryStore.set(sessionId, history);
}

export function clearSession(sessionId: string): void {
  memoryStore.delete(sessionId);
}
