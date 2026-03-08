import { describe, it, expect, afterEach } from "vitest";
import {
  appendMessage,
  clearSession,
  getHistory,
  Message,
} from "./inMemoryStore";

describe("inMemoryStore", () => {
  const sessionId = "test-session";

  afterEach(() => {
    clearSession(sessionId);
  });

  it("returns empty history for a new session", () => {
    const history = getHistory(sessionId);
    expect(history).toEqual([]);
  });

  it("appends messages to session history", () => {
    const msg1: Message = { role: "user", content: "Hello" };
    const msg2: Message = { role: "assistant", content: "Hi there" };

    appendMessage(sessionId, msg1);
    appendMessage(sessionId, msg2);

    const history = getHistory(sessionId);
    expect(history).toEqual([msg1, msg2]);
  });

  it("clears session history", () => {
    const msg: Message = { role: "user", content: "Hello" };
    appendMessage(sessionId, msg);
    clearSession(sessionId);

    const history = getHistory(sessionId);
    expect(history).toEqual([]);
  });
});

