"use client";

import { useEffect, useState, useCallback } from "react";

const H = "a6f319ec2f3dfdf6b9b4926d532fa049b0da7f02557519898d3c0a376b66a247";
const KEY = "daril_session_v1";

type QcmOption = { label: string; text: string };
type QcmItem = {
  id: string;
  categorie: string;
  vignette: string;
  critere_explicite?: string;
  options: QcmOption[];
  cle_attendue: string;
  axe_attendu?: string;
  difficulte_visee?: number;
  phase_cible?: string;
};

async function sha256(s: string): Promise<string> {
  const buf = new TextEncoder().encode(s);
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function shuffle<T>(a: T[]): T[] {
  const arr = a.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function Page() {
  const [authed, setAuthed] = useState(false);
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");
  const [items, setItems] = useState<QcmItem[]>([]);
  const [order, setOrder] = useState<number[]>([]);
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    document.title = "DARIL — Tests QCM HyperFormation";
    const m = document.querySelector('meta[name="robots"]');
    if (m) m.setAttribute("content", "noindex,nofollow,noarchive");
    else {
      const t = document.createElement("meta");
      t.name = "robots";
      t.content = "noindex,nofollow,noarchive";
      document.head.appendChild(t);
    }
    const s = sessionStorage.getItem(KEY);
    if (s === H) {
      setAuthed(true);
      loadBank();
    }
  }, []);

  const loadBank = useCallback(async () => {
    const r = await fetch("/daril/qcm_v1.json", { cache: "no-store" });
    const j = await r.json();
    const arr: QcmItem[] = j.items || [];
    setItems(arr);
    setOrder(shuffle(arr.map((_, k) => k)));
    setI(0);
    setScore(0);
    setChosen(null);
    setAnswered(false);
  }, []);

  const gate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    const h = await sha256(u.trim().toLowerCase() + ":" + p);
    if (h === H) {
      sessionStorage.setItem(KEY, h);
      setAuthed(true);
      await loadBank();
    } else setErr("Identifiants invalides.");
  };

  const logout = () => {
    sessionStorage.removeItem(KEY);
    setAuthed(false);
    setU("");
    setP("");
  };

  if (!authed) {
    return (
      <main style={S.main}>
        <h1 style={S.h1}>DARIL — Tests QCM</h1>
        <div style={S.sub}>HyperFormation v0.4 §4.4 — banque calibrée DARIL + Édouard de Boysson</div>
        <section style={S.card}>
          <form onSubmit={gate} autoComplete="off">
            <label style={S.lab}>Utilisateur</label>
            <input style={S.inp} type="text" autoComplete="username" value={u} onChange={(e) => setU(e.target.value)} required />
            <div style={{ height: 10 }} />
            <label style={S.lab}>Mot de passe</label>
            <input style={S.inp} type="password" autoComplete="current-password" value={p} onChange={(e) => setP(e.target.value)} required />
            <div style={{ height: 14 }} />
            <div style={S.row}>
              <button style={S.btn} type="submit">Accéder</button>
              <span style={S.prog}>Session locale, aucun envoi serveur.</span>
            </div>
            <div style={{ ...S.err, minHeight: "1em" }}>{err}</div>
          </form>
        </section>
      </main>
    );
  }

  const finished = i >= order.length;
  const it = !finished ? items[order[i]] : null;

  return (
    <main style={S.main}>
      <h1 style={S.h1}>DARIL — Tests QCM</h1>
      <div style={S.sub}>HyperFormation v0.4 §4.4</div>
      <section style={S.card}>
        <div style={{ ...S.row, justifyContent: "space-between" }}>
          <div style={S.prog}>{Math.min(i + 1, order.length)}/{order.length} — Score : {score}</div>
          <div style={S.row}>
            <button style={S.ghost} onClick={loadBank} type="button">Recommencer</button>
            <button style={S.ghost} onClick={logout} type="button">Quitter</button>
          </div>
        </div>
      </section>

      {finished ? (
        <section style={S.card}>
          <div style={S.cat}>Session terminée</div>
          <div style={S.score}>Score final : <b>{score}</b> / {items.length}</div>
          <div style={S.prog}>Banque parcourue dans l'ordre aléatoire. Recommencer pour relancer.</div>
        </section>
      ) : it ? (
        <section style={S.card}>
          <div style={S.cat}>
            {it.categorie}
            <span style={S.tag}>id {it.id}</span>
            {it.phase_cible ? <span style={S.tag}>{it.phase_cible}</span> : null}
          </div>
          <div style={S.vign}>{it.vignette}</div>
          <div style={S.crit}>Critère : {it.critere_explicite || ""}</div>
          <div>
            {it.options.map((o) => {
              const isChosen = chosen === o.label;
              const isCorrect = answered && o.label === it.cle_attendue;
              const isWrong = answered && isChosen && o.label !== it.cle_attendue;
              const style = {
                ...S.opt,
                ...(isChosen ? S.optSel : {}),
                ...(isCorrect ? S.optOk : {}),
                ...(isWrong ? S.optKo : {}),
              };
              return (
                <label key={o.label} style={style} onClick={() => { if (!answered) setChosen(o.label); }}>
                  <input type="radio" name="opt" checked={chosen === o.label} onChange={() => {}} disabled={answered} style={{ marginRight: 10, verticalAlign: "middle" }} />
                  <b>{o.label})</b> {o.text}
                </label>
              );
            })}
          </div>
          <div style={{ ...S.foot, marginTop: 14 }}>
            {!answered ? (
              <button
                style={{ ...S.btn, opacity: chosen ? 1 : 0.5, cursor: chosen ? "pointer" : "not-allowed" }}
                type="button"
                disabled={!chosen}
                onClick={() => {
                  setAnswered(true);
                  if (chosen === it.cle_attendue) setScore((s) => s + 1);
                }}
              >
                Valider
              </button>
            ) : (
              <button
                style={S.ghost}
                type="button"
                onClick={() => {
                  setI((k) => k + 1);
                  setChosen(null);
                  setAnswered(false);
                }}
              >
                Suivant →
              </button>
            )}
            <div style={S.prog}>Difficulté visée {it.difficulte_visee ?? "-"}</div>
          </div>
          {answered ? (
            <div style={{ ...S.fbk, ...(chosen === it.cle_attendue ? S.fbkOk : S.fbkKo) }}>
              <b>{chosen === it.cle_attendue ? "Correct." : "Incorrect."}</b> Clé attendue : <b>{it.cle_attendue}</b>. Axe : {it.axe_attendu || "-"}
            </div>
          ) : null}
        </section>
      ) : null}
    </main>
  );
}

const S = {
  main: { maxWidth: 780, margin: "0 auto", padding: "28px 20px 80px", background: "#0f1115", color: "#e6e8eb", minHeight: "100vh", font: "15px/1.5 ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" } as React.CSSProperties,
  h1: { fontSize: "1.35rem", margin: "0 0 4px", fontWeight: 600 } as React.CSSProperties,
  sub: { color: "#8a8f98", fontSize: ".85rem", marginBottom: 24 } as React.CSSProperties,
  card: { background: "#161922", border: "1px solid #22252b", borderRadius: 10, padding: 20, margin: "14px 0" } as React.CSSProperties,
  lab: { display: "block", fontSize: ".85rem", color: "#8a8f98", marginBottom: 6 } as React.CSSProperties,
  inp: { width: "100%", padding: "10px 12px", border: "1px solid #22252b", borderRadius: 8, background: "#0b0d12", color: "#e6e8eb", font: "inherit" } as React.CSSProperties,
  btn: { background: "#7ab8ff", color: "#0b0d12", border: 0, borderRadius: 8, padding: "10px 16px", font: "inherit", fontWeight: 600, cursor: "pointer" } as React.CSSProperties,
  ghost: { background: "transparent", color: "#e6e8eb", border: "1px solid #22252b", borderRadius: 8, padding: "10px 16px", font: "inherit", fontWeight: 600, cursor: "pointer" } as React.CSSProperties,
  row: { display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" } as React.CSSProperties,
  err: { color: "#ff7a85", fontSize: ".85rem", marginTop: 10 } as React.CSSProperties,
  cat: { color: "#7ab8ff", fontSize: ".78rem", textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 8 } as React.CSSProperties,
  vign: { fontSize: "1.05rem", margin: "8px 0 4px" } as React.CSSProperties,
  crit: { color: "#8a8f98", fontSize: ".85rem", fontStyle: "italic", marginBottom: 14 } as React.CSSProperties,
  opt: { display: "block", background: "#0b0d12", border: "1px solid #22252b", borderRadius: 8, padding: "10px 12px", margin: "6px 0", cursor: "pointer" } as React.CSSProperties,
  optSel: { borderColor: "#7ab8ff" } as React.CSSProperties,
  optOk: { borderColor: "#5cd185", background: "rgba(92,209,133,.08)" } as React.CSSProperties,
  optKo: { borderColor: "#ff7a85", background: "rgba(255,122,133,.06)" } as React.CSSProperties,
  foot: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" } as React.CSSProperties,
  prog: { color: "#8a8f98", fontSize: ".85rem" } as React.CSSProperties,
  fbk: { marginTop: 14, padding: "10px 12px", borderRadius: 8, background: "#0b0d12", border: "1px solid #22252b", fontSize: ".9rem" } as React.CSSProperties,
  fbkOk: { borderColor: "#5cd185" } as React.CSSProperties,
  fbkKo: { borderColor: "#ff7a85" } as React.CSSProperties,
  score: { fontSize: "1.2rem", margin: "10px 0" } as React.CSSProperties,
  tag: { display: "inline-block", padding: "2px 8px", borderRadius: 999, background: "#1c2230", fontSize: ".72rem", color: "#8a8f98", marginLeft: 6 } as React.CSSProperties,
};
