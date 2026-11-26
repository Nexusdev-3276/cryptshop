"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [secret, setSecret] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret }),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) throw new Error(data.error || "Connexion refusée.");
      router.push("/admin");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Erreur.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container page" style={{ maxWidth: 420 }}>
      <header className="page-head">
        <p className="eyebrow">Administration</p>
        <h1>Connexion admin</h1>
        <p>Entrez le secret administrateur. Aucun mot de passe stocké : la vérification est faite côté serveur.</p>
      </header>
      <form className="contact-form" onSubmit={submit}>
        <label className="field">
          <span>Secret admin</span>
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            required
            autoComplete="current-password"
          />
        </label>
        {error ? <p className="form-error">{error}</p> : null}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Vérification…" : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
