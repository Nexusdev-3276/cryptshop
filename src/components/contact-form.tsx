"use client";

import { useState } from "react";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) throw new Error(data.error || "Message non envoyé.");
      setSent(true);
      setForm({ name: "", email: "", message: "" });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="form-success">
        <h2>Message envoyé.</h2>
        <p>Nous répondons sous 24 h ouvrées. Merci de votre message.</p>
        <button type="button" className="btn btn-outline" onClick={() => setSent(false)}>
          Envoyer un autre message
        </button>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <label className="field">
        <span>Nom</span>
        <input
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
          required
          maxLength={80}
          autoComplete="name"
        />
      </label>
      <label className="field">
        <span>E-mail</span>
        <input
          type="email"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          required
          maxLength={120}
          autoComplete="email"
        />
      </label>
      <label className="field">
        <span>Message</span>
        <textarea
          value={form.message}
          onChange={(event) => setForm({ ...form, message: event.target.value })}
          required
          rows={6}
          maxLength={2000}
          placeholder="Commande, produit, livraison…"
        />
      </label>
      {error ? <p className="form-error">{error}</p> : null}
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "Envoi…" : "Envoyer le message"}
      </button>
    </form>
  );
}
