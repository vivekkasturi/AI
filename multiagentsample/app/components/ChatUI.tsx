'use client';

import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatUI() {

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sessionId = "demo-session";

  const sendMessage = async () => {

    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input
    };

    // Add user message
    setMessages(prev => [...prev, userMessage]);

    setInput("");

    setLoading(true);

    try {
    

      const response = await fetch("/api", {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          sessionId,
          message: userMessage.content
        }),
      });

      if (!response.ok) {
        throw new Error("API failed");
      }

      // ✅ Read full response (NO STREAMING)
      const text = await response.text();

      // Add assistant message
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: text }
      ]);

    } catch (error) {
      console.error("❌ Error:", error);

      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "Something went wrong." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "auto" }}>
      <h2>AI Chat</h2>

      <div style={{ marginBottom: 20 }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: 8 }}>
            <strong>{msg.role}:</strong> {msg.content}
          </div>
        ))}
      </div>

      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Type your message..."
        style={{
          border: "1px solid black",
          width: "70%",
          padding: 8,
          marginRight: 10
        }}
      />

      <button onClick={sendMessage} disabled={loading}>
        {loading ? "Thinking..." : "Send"}
      </button>
    </div>
  );
}