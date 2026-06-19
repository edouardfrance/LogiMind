export const metadata = {
  title: "LogiMind — Édouard de Boysson",
  description:
    "Maison d'édition d'Édouard de Boysson. Memento Thérapies, Sens oubliés de la médecine, Fondation Culture, Électroculture, et cadres d'analyse pour le conseil SAP (DEBOYSSON Matrix).",
};

const sectionStyle: React.CSSProperties = {
  padding: "1.25rem 1.5rem",
  border: "1px solid #e6e6e6",
  borderRadius: 8,
  marginBottom: 12,
  background: "#fff",
};

const h2Style: React.CSSProperties = {
  margin: "0 0 0.4rem",
  fontSize: "1.05rem",
  fontWeight: 600,
};

const pStyle: React.CSSProperties = {
  margin: 0,
  color: "#444",
  lineHeight: 1.5,
};

const linkStyle: React.CSSProperties = {
  color: "#0a6",
  textDecoration: "none",
  fontWeight: 500,
};

export default function Home() {
  return (
    <main
      style={{
        padding: "2rem 1.5rem 4rem",
        maxWidth: 780,
        margin: "0 auto",
        color: "#1a1a1a",
      }}
    >
      <header style={{ marginBottom: "2rem" }}>
        <p
          style={{
            margin: 0,
            letterSpacing: "0.25em",
            fontSize: "0.75rem",
            textTransform: "uppercase",
            color: "#888",
          }}
        >
          LogiMind
        </p>
        <h1 style={{ margin: "0.25rem 0 0.5rem", fontSize: "2rem", fontWeight: 600 }}>
          Édouard de Boysson
        </h1>
        <p style={{ margin: 0, color: "#555", fontStyle: "italic" }}>
          Auteur, chercheur-encyclopédiste, consultant senior SAP.
        </p>
      </header>

      <p style={{ color: "#333", lineHeight: 1.6, marginBottom: "1.5rem" }}>
        LogiMind est une marque éditoriale qui rassemble plusieurs collections de
        livres consacrés à la connaissance pratique : psychothérapies, sensorialité
        oubliée, classiques du domaine public, agriculture vivante, et cadres
        d'analyse pour la conduite de projets SI.
      </p>

      <section style={sectionStyle}>
        <h2 style={h2Style}>Memento Thérapies</h2>
        <p style={pStyle}>
          Encyclopédie raisonnée des psychothérapies, en plusieurs tomes. Tomes 1
          à 3 publiés en français et en anglais ; tomes 4 à 9 en préparation.
        </p>
        <p style={{ ...pStyle, marginTop: 8 }}>
          <a
            href="https://www.amazon.fr/s?k=Memento+th%C3%A9rapies+Edouard+de+Boysson&i=stripbooks"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            Tomes disponibles sur Amazon
          </a>
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>Les Sens oubliés de la médecine</h2>
        <p style={pStyle}>
          Quatre volumes coordonnés (savant FR / EN, vulgarisation FR / EN) sur les
          sens perceptifs négligés par la médecine moderne, et leurs analogues
          biomimétiques. À paraître.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>Fondation Culture</h2>
        <p style={pStyle}>
          Republication critique d'œuvres entrées dans le domaine public en 2026,
          enrichies d'un appareil savant — préface, notes, postface, bibliographie
          raisonnée — d'inspiration Pléiade. Cadence cible : un titre tous les
          trois jours.
        </p>
        <p style={{ ...pStyle, marginTop: 8 }}>
          <a
            href="https://www.amazon.fr/s?k=Fondation+Culture+Edouard+de+Boysson&i=stripbooks"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            Titres parus sur Amazon
          </a>
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>Électroculture</h2>
        <p style={pStyle}>
          Tomes 1 et 2 publiés sur l'histoire et la pratique de l'électroculture,
          des pionniers du XIXᵉ siècle aux dispositifs contemporains.
        </p>
        <p style={{ ...pStyle, marginTop: 8 }}>
          <a
            href="https://www.amazon.fr/s?k=%C3%A9lectroculture+Edouard+de+Boysson&i=stripbooks"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            Tomes disponibles sur Amazon
          </a>
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>DEBOYSSON Matrix — cadre xRICEF / xRACI</h2>
        <p style={pStyle}>
          Cadre étendu pour la conduite des projets SAP : nomenclature étendue
          RICEFW (treize lettres), matrice de responsabilités à dix-sept rôles
          incluant les agents non humains. Livre à paraître.
        </p>
      </section>

      <hr style={{ border: 0, borderTop: "1px solid #eee", margin: "2rem 0" }} />

      <footer style={{ color: "#777", fontSize: "0.85rem", lineHeight: 1.6 }}>
        <p style={{ margin: 0 }}>
          Contact :{" "}
          <a href="mailto:edouard@de-boysson.com" style={{ color: "#0a6" }}>
            edouard@de-boysson.com
          </a>
          .
        </p>
        <p style={{ margin: "0.25rem 0 0" }}>
          Zone privée auteur :{" "}
          <a href="/daril" style={{ color: "#0a6" }}>
            /daril
          </a>
          .
        </p>
      </footer>
    </main>
  );
}
