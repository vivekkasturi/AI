'use client'

import { useRef, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatUI() {

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const controller = useRef<AbortController | null>(null);

  const sessionId = "demo-session";

  const sendMessage = async () => {

    if (!input.trim()) return;

    const abortController = new AbortController();
    controller.current = abortController;

    const userMessage: Message = {
      role: "user",
      content: input
    };

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

        signal: abortController.signal

      });

      if (!response.ok) {
        throw new Error("API failed");
      }

      const reader = response.body?.getReader();

      const decoder = new TextDecoder();

      let assistantMessage = "";

      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "" }
      ]);

      if (reader) {

        while (true) {

          const { done, value } = await reader.read();

          if (done) break;

          const chunk = decoder.decode(value);

          assistantMessage += chunk;

          setMessages(prev => {

            const updated = [...prev];

            updated[updated.length - 1] = {

              role: "assistant",

              content: assistantMessage

            };

            return updated;

          });

        }

      }

    }
    catch (error) {

      console.error(error);

    }
    finally {

      setLoading(false);

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

      <input

        value={input}

        onChange={e => setInput(e.target.value)}

        style={{ border: "1px solid balck", width: "70%", padding: 8 }}

      />

      <button onClick={sendMessage} disabled={loading}>

        {loading ? "Thinking..." : "Send"}

      </button>

      <button

        onClick={() => controller.current?.abort()}

        disabled={!loading}

      >

        Stop

      </button>

    </div>

  );

}

