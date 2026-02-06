"use client";

import { useMemo, useState } from "react";

const starterMessages = [
  {
    id: "m1",
    role: "assistant",
    text: "I can help you summarize docs, generate UI copy, or design a workflow. What are we building?"
  }
];

type Role = "user" | "assistant" | "system";

type Message = {
  id: string;
  role: Role;
  text: string;
};

export default function CopilotPanel() {
  const [messages, setMessages] = useState<Message[]>(starterMessages);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  const apiUrl = useMemo(
    () => process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
    []
  );

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) {
      return;
    }

    const userMessage: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      text: trimmed
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsSending(true);

    try {
      const response = await fetch(`${apiUrl}/copilot/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: trimmed })
      });

      if (!response.ok) {
        throw new Error(`API responded with ${response.status}`);
      }

      const data = (await response.json()) as { text: string; provider: string };
      const assistantMessage: Message = {
        id: `a-${Date.now()}`,
        role: "assistant",
        text: data.text
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: `e-${Date.now()}`,
        role: "system",
        text: "Unable to reach the API. Make sure FastAPI is running on port 8000."
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="copilot">
      <header className="copilot-header">
        <div>
          <span className="copilot-eyebrow">Live Copilot</span>
          <h2>Message Stream</h2>
          <p>Chat with your backend agent and iterate in real time.</p>
        </div>
        <div className="copilot-meta">
          <span>API</span>
          <strong>{apiUrl}</strong>
        </div>
      </header>

      <div className="copilot-thread">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.role}`}>
            <span className="message-role">{message.role}</span>
            <p>{message.text}</p>
          </div>
        ))}
      </div>

      <div className="copilot-input">
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask your copilot for UI copy, roadmap ideas, or a product flow..."
          rows={3}
        />
        <button onClick={sendMessage} disabled={isSending}>
          {isSending ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
