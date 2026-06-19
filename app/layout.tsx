export const metadata = {
  title: "LogiMind",
  description:
    "LogiMind — marque éditoriale d'Édouard de Boysson : Memento Thérapies, Sens oubliés de la médecine, Fondation Culture, Électroculture, DEBOYSSON Matrix.",
  metadataBase: new URL("https://www.logimind.org"),
  openGraph: {
    title: "LogiMind",
    description:
      "Maison d'édition d'Édouard de Boysson. Psychothérapies, sens oubliés, classiques DP commentés, électroculture, conseil SAP.",
    url: "https://www.logimind.org",
    siteName: "LogiMind",
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        style={{
          margin: 0,
          fontFamily:
            "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
          background: "#fafaf8",
        }}
      >
        {children}
      </body>
    </html>
  );
}
