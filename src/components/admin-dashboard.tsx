"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Order = {
  id: string;
  createdAt: string;
  country: string;
  customer: { firstName: string; lastName: string; email: string; phone: string };
  items: { name: string; qty: number; line: number }[];
  total: number;
  payment: { currency: string; amount: number; address: string | null; status?: string; expiresAt?: string };
};

type ChatMsg = { id: string; role: string; text: string; createdAt: string };

export function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [threads, setThreads] = useState<{ orderId: string; count: number; last?: ChatMsg }[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const [oRes, cRes] = await Promise.all([
      fetch("/api/admin/orders"),
      fetch("/api/admin/chats"),
    ]);
    if (oRes.ok) {
      const data = (await oRes.json()) as { orders: Order[] };
      setOrders(data.orders || []);
    }
    if (cRes.ok) {
      const data = (await cRes.json()) as { threads: { orderId: string; count: number; last?: ChatMsg }[] };
      setThreads(data.threads || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function openThread(orderId: string) {
    setSelectedOrder(orderId);
    const res = await fetch(`/api/admin/chats?orderId=${encodeURIComponent(orderId)}`);
    if (res.ok) {
      const data = (await res.json()) as { messages: ChatMsg[] };
      setMessages(data.messages || []);
    }
  }

  async function sendReply(event: React.FormEvent) {
    event.preventDefault();
    if (!selectedOrder || !reply.trim()) return;
    await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: selectedOrder, text: reply.trim() }),
    });
    setReply("");
    await openThread(selectedOrder);
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <div className="container page">
      <header className="page-head">
        <p className="eyebrow">Administration</p>
        <h1>Dashboard</h1>
        <p>Commandes, paiements et conversations. Données stockées côté serveur.</p>
      </header>

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <button type="button" className="btn btn-outline" onClick={logout}>
          Se déconnecter
        </button>
      </div>

      {loading ? <p className="muted">Chargement…</p> : null}

      <section className="form-section">
        <h2>Commandes ({orders.length})</h2>
        {orders.length === 0 ? (
          <p className="muted">Aucune commande pour le moment.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="shipping-table">
              <thead>
                <tr>
                  <th>Réf.</th>
                  <th>Date</th>
                  <th>Client</th>
                  <th>Total</th>
                  <th>Paiement</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{new Date(order.createdAt).toLocaleString("fr-FR")}</td>
                    <td>
                      {order.customer.firstName} {order.customer.lastName}
                      <br />
                      <span className="muted" style={{ fontSize: 11 }}>{order.customer.email}</span>
                    </td>
                    <td>{order.total.toFixed(2)} €</td>
                    <td>
                      {order.payment.amount} {order.payment.currency}
                    </td>
                    <td>
                      <span
                        className={
                          order.payment.status === "paid"
                            ? "chip active"
                            : order.payment.status === "expired"
                            ? "chip"
                            : "chip"
                        }
                        style={{
                          background:
                            order.payment.status === "paid"
                              ? "#e8f5e9"
                              : order.payment.status === "expired"
                              ? "#fbe9e7"
                              : "#fff3e0",
                          color:
                            order.payment.status === "paid"
                              ? "#2e7d32"
                              : order.payment.status === "expired"
                              ? "#c62828"
                              : "#e65100",
                        }}
                      >
                        {order.payment.status === "paid"
                          ? "✅ Payé"
                          : order.payment.status === "expired"
                          ? "❌ Expiré"
                          : "⏳ En attente"}
                      </span>
                    </td>
                    <td>
                      {order.payment.status === "pending" ? (
                        <button
                          type="button"
                          className="btn btn-primary"
                          style={{ fontSize: 11, padding: "4px 8px" }}
                          onClick={async () => {
                            await fetch(`/api/admin/orders/${order.id}/pay`, { method: "POST" });
                            load();
                          }}
                        >
                          Marquer payé
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="form-section">
        <h2>Conversations ({threads.length})</h2>
        <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 16 }}>
          <div style={{ borderRight: "1px solid var(--line)", paddingRight: 12 }}>
            {threads.length === 0 ? (
              <p className="muted">Aucune conversation.</p>
            ) : (
              threads.map((t) => (
                <button
                  key={t.orderId}
                  type="button"
                  className={selectedOrder === t.orderId ? "chip active" : "chip"}
                  style={{ width: "100%", marginBottom: 6, textAlign: "left" }}
                  onClick={() => openThread(t.orderId)}
                >
                  {t.orderId} · {t.count} msg
                </button>
              ))
            )}
          </div>
          <div>
            {selectedOrder ? (
              <>
                <p style={{ fontWeight: 700, marginBottom: 8 }}>{selectedOrder}</p>
                <div style={{ maxHeight: 320, overflowY: "auto", border: "1px solid var(--line)", borderRadius: 8, padding: 12, background: "#fff" }}>
                  {messages.length === 0 ? (
                    <p className="muted">Aucun message.</p>
                  ) : (
                    messages.map((m) => (
                      <div key={m.id} style={{ marginBottom: 10 }}>
                        <span style={{ fontSize: 11, color: "var(--muted)", fontWeight: 700 }}>
                          {m.role === "admin" ? "Vous" : "Client"} · {new Date(m.createdAt).toLocaleTimeString("fr-FR")}
                        </span>
                        <p style={{ fontSize: 13, marginTop: 2 }}>{m.text}</p>
                      </div>
                    ))
                  )}
                </div>
                <form onSubmit={sendReply} style={{ marginTop: 10, display: "flex", gap: 8 }}>
                  <input
                    type="text"
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Répondre…"
                    style={{ flex: 1, height: 34, border: "1px solid #888c8c", borderRadius: 4, padding: "0 10px", fontSize: 13 }}
                  />
                  <button type="submit" className="btn btn-primary">
                    Envoyer
                  </button>
                </form>
              </>
            ) : (
              <p className="muted">Sélectionnez une conversation.</p>
            )}
          </div>
        </div>
      </section>

      <p style={{ marginTop: 24 }}>
        <Link href="/boutique" className="text-link">Retour à la boutique</Link>
      </p>
    </div>
  );
}
