import { useState, useRef, useEffect } from "react";
import { useTranslation } from "../i18n.js";

export default function Chatbot() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi! I'm here to help you navigate CreditLens or answer small-business questions. What do you need?" },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  async function send() {
    const text = input.trim();
    if (!text || sending) return;
    const newMessages = [...messages, { role: "user", text }];
    setMessages(newMessages);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: newMessages.slice(-8).map((m) => ({ role: m.role, text: m.text })),
        }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "bot", text: "I couldn't reach the assistant. Please check the backend is running." }]);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      {open && (
        <div className="chat-panel">
          <div className="chat-header">
            <span>{t("chatTitle")}</span>
            <button
              onClick={() => setOpen(false)}
              style={{ background: "none", border: "none", color: "white", fontSize: "1.1rem" }}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>
          <div className="chat-messages" ref={scrollRef}>
            {messages.map((m, i) => (
              <div key={i} className={`chat-bubble ${m.role}`}>{m.text}</div>
            ))}
            {sending && <div className="chat-bubble bot">…</div>}
          </div>
          <div className="chat-input-row">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder={t("chatPlaceholder")}
            />
            <button className="chat-send" onClick={send} aria-label="Send message">➤</button>
          </div>
        </div>
      )}
      <button className="chat-fab" onClick={() => setOpen((o) => !o)} aria-label="Toggle assistant">
        {open ? "✕" : "💬"}
      </button>
    </>
  );
}
