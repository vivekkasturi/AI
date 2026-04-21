'use client'

import { KeyboardEvent, useRef, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatUI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const controller = useRef<AbortController | null>(null);

  const sessionId = "demo-session";

  const sendMessage = async () => {
    const trimmedInput = input.trim();

    if (!trimmedInput || loading) return;

    const abortController = new AbortController();
    controller.current = abortController;

    const userMessage: Message = {
      role: "user",
      content: trimmedInput,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          message: userMessage.content,
        }),
        signal: abortController.signal,
      });

      if (!response.ok) {
        let errorMessage = "API failed";

        try {
          const payload = (await response.json()) as { error?: string };
          errorMessage = payload.error ?? errorMessage;
        } catch {
          // Keep the fallback when the response is not JSON.
        }

        throw new Error(errorMessage);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          assistantMessage += decoder.decode(value, { stream: !done });

          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              role: "assistant",
              content: assistantMessage,
            };
            return updated;
          });
        }
      } else {
        assistantMessage = await response.text();

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: assistantMessage,
          };
          return updated;
        });
      }
    } catch (error) {
      console.error(error);

      if (error instanceof DOMException && error.name === "AbortError") {
        setError("Response stopped.");
        return;
      }

      setError(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      controller.current = null;
      setLoading(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "auto" }}>
      <h2>AI Chat</h2>

      <div style={{ marginBottom: 20 }}>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.role}:</strong> {msg.content}
          </div>
        ))}
      </div>

      {error ? (
        <p style={{ color: "crimson", marginBottom: 12 }}>{error}</p>
      ) : null}

      <input
        value={input}
        onChange={(event) => setInput(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask about company docs or a general question..."
        disabled={loading}
        style={{ border: "1px solid black", width: "70%", padding: 8 }}
      />

      <button onClick={() => void sendMessage()} disabled={loading || !input.trim()}>
        {loading ? "Thinking..." : "Send"}
      </button>

      <button onClick={() => controller.current?.abort()} disabled={!loading}>
        Stop
      </button>
    </div>
  );
}
