"use client";

import { useEffect, useState } from "react";

const EXPECTED_HASH =
  "a6f319ec2f3dfdf6b9b4926d532fa049b0da7f02557519898d3c0a376b66a247";

type QcmItem = {
  id: string;
  question: string;
  options: { letter: string; text: string }[];
};

async function sha256(text: string): Promise<string> {
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default function DarilPage() {
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");
  const [items, setItems] = useState<QcmItem[]>([]);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("daril_ok") === "1") {
      setAuth(true);
    }
  }, []);

  useEffect(() => {
    if (!auth) return;
    fetch("/daril/qcm_v1.json")
      .then((r) => r.json())
      .then((d: QcmItem[]) => setItems(d))
      .catch(() => setErr("Échec chargement QCM."));
  }, [auth]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const h = await sha256(`${user}:${pwd}`);
    if (h === EXPECTED_HASH) {
      sessionStorage.setItem("daril_ok", "1");
      setAuth(true);
    } else {
      setErr("Identifiants invalides.");
    }
  }

  function answer(letter: string) {
    const cur = items[idx];
    if (!cur) return;
    setAnswers({ ...answers, [cur.id]: letter });
    if (idx + 1 < items.length) {
      setIdx(idx + 1);
    } else {
      setDone(true);
    }
  }

  if (!auth) {
    return (
      <main style={{ padding: "2rem", maxWidth: 420, margin: "0 auto" }}>
        <h1>DARIL — Accès privé</h1>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 12 }}>
            <label>
              Identifiant
              <input
                type="text"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                style={{ display: "block", width: "100%", padding: 8, marginTop: 4 }}
                autoComplete="username"
              />
            </label>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>
              Mot de passe
              <input
                type="password"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                style={{ display: "block", width: "100%", padding: 8, marginTop: 4 }}
                autoComplete="current-password"
              />
            </label>
          </div>
          <button
            type="submit"
            style={{ padding: "8px 16px", background: "#222", color: "#fff", border: 0 }}
          >
            Entrer
          </button>
          {err && <p style={{ color: "crimson", marginTop: 12 }}>{err}</p>}
        </form>
      </main>
    );
  }

  if (done) {
    return (
      <main style={{ padding: "2rem", maxWidth: 720, margin: "0 auto" }}>
        <h1>DARIL — Réponses enregistrées</h1>
        <p>Merci. {Object.keys(answers).length} item(s) traité(s).</p>
        <pre
          style={{
            background: "#f4f4f4",
            padding: 12,
            overflow: "auto",
            fontSize: 13,
          }}
        >
          {JSON.stringify(answers, null, 2)}
        </pre>
      </main>
    );
  }

  if (!items.length) {
    return (
      <main style={{ padding: "2rem" }}>
        <p>Chargement…</p>
        {err && <p style={{ color: "crimson" }}>{err}</p>}
      </main>
    );
  }

  const cur = items[idx];
  return (
    <main style={{ padding: "2rem", maxWidth: 720, margin: "0 auto" }}>
      <p style={{ color: "#666" }}>
        Item {idx + 1} / {items.length}
      </p>
      <h2 style={{ marginTop: 8 }}>{cur.question}</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {cur.options.map((o) => (
          <li key={o.letter} style={{ marginBottom: 8 }}>
            <button
              onClick={() => answer(o.letter)}
              style={{
                width: "100%",
                textAlign: "left",
                padding: 12,
                border: "1px solid #ccc",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              <strong>{o.letter}.</strong> {o.text}
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
