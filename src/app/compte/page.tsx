"use client";

import { useEffect, useState } from "react";
import { Chat } from "@/components/chat";

export default function AccountPage() {
  const [token, setToken] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [orders, setOrders] = useState<{ id: string; createdAt: string; total: number; items: { name: string; qty: number }[] }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [chatOrder, setChatOrder] = useState<string | null>(null);

  async function login(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    const res = await fetch("/api/account/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const data = (await res.json()) as { ok?: boolean; error?: string };
    if (!res.ok || !data.ok) {
      setError(data.error || "Code invalide.");
      return;
    }
    setLoggedIn(true);
    loadOrders();
  }

  async function loadOrders() {
    const res = await fetch("/api/account/me");
    if (res.ok) {
      const data = (await res.json()) as { account: { orders: string[] } | null };
      // orders list stored as ids; fetch details not available client-side without admin; show ids
      if (data.account?.orders) {
        setOrders(data.account.orders.map((id) => ({ id, createdAt: "", total: 0, items: [] })));
      }
    }
  }

  useEffect(() => {
    fetch("/api/account/me").then((res) => {
      if (res.ok) {
        setLoggedIn(true);
        loadOrders();
      }
    });
  }, []);

  if (!loggedIn) {
    return (
      <div className="container page" style={{ maxWidth: 460 }}>
        <header className="page-head">
          <p className="eyebrow">Compte</p>
          <h1>Accéder à mon compte</h1>
          <p>Entrez votre code d'accès sécurisé. Aucun mot de passe n'est requis.</p>
        </header>
        <form className="contact-form" onSubmit={login}>
          <label className="field">
            <span>Code d'accès</span>
            <input value={token} onChange={(e) => setToken(e.target.value)} required />
          </label>
          {error ? <p className="form-error">{error}</p> : null}
          <button type="submit" className="btn btn-primary">Se connecter</button>
        </form>
        <p style={{ marginTop: 16, fontSize: 12, color: "var(--muted)" }}>
          Pas encore de compte ? Il est créé automatiquement lors de votre première commande.
        </p>
      </div>
    );
  }

  return (
    <div className="container page">
      <header className="page-head">
        <p className="eyebrow">Compte</p>
        <h1>Mes commandes</h1>
        <p>Retrouvez vos références et discutez avec le vendeur.</p>
      </header>
      <section className="form-section">
        <h2>Références de commande</h2>
        {orders.length === 0 ? (
          <p className="muted">Aucune commande liée à ce compte.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {orders.map((o) => (
              <li key={o.id} style={{ padding: "8px 0", borderBottom: "1px solid var(--line)" }}>
                <button type="button" className="text-link" onClick={() => setChatOrder(o.id)}>
                  {o.id}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
      {chatOrder ? <Chat orderId={chatOrder} /> : null}
      <div style={{ marginTop: 16 }}>
        <button type="button" className="btn btn-outline" onClick={async () => { await fetch("/api/account/logout", { method: "POST" }); setLoggedIn(false); setOrders([]); }}>
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
