"use client";

import { useEffect, useRef, useState } from "react";

type ChatMsg = { id: string; role: string; text: string; createdAt: string };

export function Chat({ orderId }: { orderId: string }) {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  async function load() {
    const res = await fetch(`/api/chat?orderId=${encodeURIComponent(orderId)}`);
    if (res.ok) {
      const data = (await res.json()) as { messages: ChatMsg[] };
      setMessages(data.messages || []);
    }
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 4000);
    return () => clearInterval(interval);
  }, [orderId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(event: React.FormEvent) {
    event.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, text: text.trim() }),
    });
    setText("");
    await load();
    setSending(false);
  }

  return (
    <div style={{ border: "1px solid var(--line)", borderRadius: 8, background: "#fff", padding: 14 }}>
      <p style={{ fontWeight: 700, marginBottom: 8, fontSize: 13 }}>Chat sécurisé — {orderId}</p>
      <div style={{ maxHeight: 260, overflowY: "auto", marginBottom: 10 }}>
        {messages.length === 0 ? (
          <p className="muted" style={{ fontSize: 12 }}>Aucun message. Écrivez pour recevoir votre code.</p>
        ) : (
          messages.map((m) => (
            <div key={m.id} style={{ marginBottom: 8, textAlign: m.role === "admin" ? "left" : "right" }}>
              <span style={{ fontSize: 10, color: "var(--muted)", fontWeight: 700 }}>
                {m.role === "admin" ? "Vendeur" : "Vous"} · {new Date(m.createdAt).toLocaleTimeString("fr-FR")}
              </span>
              <p style={{ fontSize: 13, marginTop: 2, background: m.role === "admin" ? "#f0f2f2" : "#fff7e6", padding: "6px 10px", borderRadius: 6, display: "inline-block" }}>
                {m.text}
              </p>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={send} style={{ display: "flex", gap: 8 }}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Votre message…"
          style={{ flex: 1, height: 34, border: "1px solid #888c8c", borderRadius: 4, padding: "0 10px", fontSize: 13 }}
        />
        <button type="submit" className="btn btn-primary" disabled={sending}>
          {sending ? "…" : "Envoyer"}
        </button>
      </form>
    </div>
  );
}
