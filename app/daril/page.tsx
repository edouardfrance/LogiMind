"use client";

import { useEffect, useMemo, useState } from "react";

const EXPECTED_HASH =
  "a6f319ec2f3dfdf6b9b4926d532fa049b0da7f02557519898d3c0a376b66a247";

type QcmItem = {
  id: string;
  question: string;
  axis?: string;
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
  const [sending, setSending] = useState(false);
  const [sendMsg, setSendMsg] = useState("");

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

  const cur = items[idx];
  const total = items.length;
  const answered = cur ? answers[cur.id] : undefined;
  const progress = total ? Math.round(((idx + (answered ? 1 : 0)) / total) * 100) : 0;

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

  function pick(letter: string) {
    if (!cur) return;
    setAnswers({ ...answers, [cur.id]: letter });
  }

  function next() {
    if (!answered) return;
    if (idx + 1 < total) setIdx(idx + 1);
    else setDone(true);
  }

  function prev() {
    if (idx > 0) setIdx(idx - 1);
  }

  function restart() {
    setAnswers({});
    setIdx(0);
    setDone(false);
    setSendMsg("");
  }

  function downloadJson() {
    const payload = {
      timestamp: new Date().toISOString(),
      version: "qcm_v1",
      answers,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `daril_qcm_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function sendToDaril() {
    setSending(true);
    setSendMsg("");
    const payload = {
      timestamp: new Date().toISOString(),
      version: "qcm_v1",
      answers,
    };
    // Tentative 1 : API serveur (sera branchée Resend / SMTP en ITER 3).
    try {
      const res = await fetch("/api/daril/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const j = await res.json().catch(() => ({}));
        if (j?.delivered) {
          setSendMsg("Réponses transmises à DARIL (serveur).");
          setSending(false);
          return;
        }
      }
    } catch {
      /* on bascule sur mailto */
    }
    // Tentative 2 : mailto: client (fonctionne partout, sans serveur).
    const subject = encodeURIComponent(`DARIL QCM v1 — ${payload.timestamp}`);
    const body = encodeURIComponent(
      `Réponses QCM DARIL\n\n${JSON.stringify(payload, null, 2)}\n`
    );
    window.location.href = `mailto:daril@de-boysson.com?subject=${subject}&body=${body}`;
    setSendMsg(
      "Ouverture du client mail (destinataire daril@de-boysson.com). Si rien ne s'ouvre, téléchargez le JSON."
    );
    setSending(false);
  }

  // --- Auth screen ---
  if (!auth) {
    return (
      <main style={{ padding: "2rem", maxWidth: 420, margin: "0 auto" }}>
        <h1 style={{ marginBottom: 4 }}>DARIL</h1>
        <p style={{ color: "#666", marginTop: 0 }}>Zone privée — tests QCM.</p>
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
            style={{
              padding: "10px 16px",
              background: "#222",
              color: "#fff",
              border: 0,
              cursor: "pointer",
            }}
          >
            Entrer
          </button>
          {err && <p style={{ color: "crimson", marginTop: 12 }}>{err}</p>}
        </form>
      </main>
    );
  }

  // --- Done screen ---
  if (done) {
    const tally = Object.values(answers).reduce<Record<string, number>>(
      (acc, l) => ({ ...acc, [l]: (acc[l] || 0) + 1 }),
      {}
    );
    return (
      <main style={{ padding: "2rem", maxWidth: 720, margin: "0 auto" }}>
        <h1>DARIL — Réponses enregistrées</h1>
        <p>
          {Object.keys(answers).length} item(s) sur {total} traité(s).
        </p>
        <h3>Répartition</h3>
        <ul>
          {["A", "B", "C", "D"].map((l) => (
            <li key={l}>
              <strong>{l}</strong> : {tally[l] || 0}
            </li>
          ))}
        </ul>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
          <button
            onClick={sendToDaril}
            disabled={sending}
            style={{
              padding: "10px 16px",
              background: "#0a6",
              color: "#fff",
              border: 0,
              cursor: "pointer",
            }}
          >
            {sending ? "Envoi…" : "Envoyer à DARIL"}
          </button>
          <button
            onClick={downloadJson}
            style={{
              padding: "10px 16px",
              background: "#222",
              color: "#fff",
              border: 0,
              cursor: "pointer",
            }}
          >
            Télécharger JSON
          </button>
          <button
            onClick={restart}
            style={{
              padding: "10px 16px",
              background: "#fff",
              color: "#222",
              border: "1px solid #222",
              cursor: "pointer",
            }}
          >
            Recommencer
          </button>
        </div>
        {sendMsg && <p style={{ marginTop: 12, color: "#444" }}>{sendMsg}</p>}
        <details style={{ marginTop: 24 }}>
          <summary style={{ cursor: "pointer" }}>Détail des réponses</summary>
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
        </details>
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

  // --- Question screen ---
  return (
    <main style={{ padding: "2rem", maxWidth: 720, margin: "0 auto" }}>
      <div style={{ marginBottom: 16 }}>
        <div
          style={{
            background: "#eee",
            height: 6,
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: "#0a6",
              height: "100%",
              width: `${progress}%`,
              transition: "width 200ms",
            }}
          />
        </div>
        <p style={{ color: "#666", margin: "8px 0 0" }}>
          Item {idx + 1} / {total}
          {cur?.axis ? ` — ${cur.axis}` : ""}
        </p>
      </div>
      <h2 style={{ marginTop: 8 }}>{cur.question}</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {cur.options.map((o) => {
          const selected = answered === o.letter;
          return (
            <li key={o.letter} style={{ marginBottom: 8 }}>
              <button
                onClick={() => pick(o.letter)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: 12,
                  border: selected ? "2px solid #0a6" : "1px solid #ccc",
                  background: selected ? "#f0fbf6" : "#fff",
                  cursor: "pointer",
                  fontSize: 15,
                }}
              >
                <strong>{o.letter}.</strong> {o.text}
              </button>
            </li>
          );
        })}
      </ul>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
        <button
          onClick={prev}
          disabled={idx === 0}
          style={{
            padding: "10px 16px",
            background: idx === 0 ? "#eee" : "#fff",
            color: "#222",
            border: "1px solid #ccc",
            cursor: idx === 0 ? "not-allowed" : "pointer",
          }}
        >
          ← Précédent
        </button>
        <button
          onClick={next}
          disabled={!answered}
          style={{
            padding: "10px 16px",
            background: answered ? "#0a6" : "#bbb",
            color: "#fff",
            border: 0,
            cursor: answered ? "pointer" : "not-allowed",
          }}
        >
          {idx + 1 === total ? "Terminer" : "Suivant →"}
        </button>
      </div>
    </main>
  );
}
