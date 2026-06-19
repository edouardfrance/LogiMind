export default function EnLayout({ children }: { children: React.ReactNode }) {
  // Marque la sous-arborescence /en comme anglophone (le <html> racine reste fr).
  return <div lang="en">{children}</div>;
}
