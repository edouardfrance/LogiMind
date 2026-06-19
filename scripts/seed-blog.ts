/**
 * Seed initial blog posts. Idempotent par slug.
 * Usage : `npm run db:seed-blog`
 *
 * Contenu : éditorial général, sans claim médical, sécurisé pour publication.
 * À enrichir par Édouard avec sa propre voix et exemples cliniques.
 */
import { eq } from 'drizzle-orm';
import { runMigrations } from '../lib/migrate-libsql';
import { db, schema } from '../lib/db';
import { estimateReadingMinutes } from '../lib/blog';

interface SeedPost {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category?: string;
  coverUrl?: string;
}

const POSTS: SeedPost[] = [
  {
    slug: 'bienvenue-sur-logimind',
    title: 'Bienvenue sur Logimind',
    category: 'Éditorial',
    excerpt:
      "Pourquoi rassembler en un seul lieu vingt ans d'écriture, d'enseignement et de pratique clinique — et ce que vous y trouverez.",
    body: `Logimind n'est pas une vitrine. C'est une bibliothèque.

Vous y trouverez les livres d'Édouard de Boysson — psychothérapeute, formateur et chercheur — réunis pour la première fois sous une même couverture éditoriale.

## Une œuvre dispersée

Pendant deux décennies, ces textes ont vécu de manière fragmentée. Un manuscrit ici, un tome là, un dictionnaire à part, des notes de séminaire éparpillées. Lecteurs et étudiants devaient souvent assembler le puzzle eux-mêmes.

Cette plateforme rétablit l'ordre. Chaque ouvrage y est référencé avec son ISBN propre, ses différents formats — PDF, broché, relié, Kindle — et un prix unique pour chacun.

## Ce que vous pouvez attendre ici

- **Les livres**, en numérique et en physique imprimé à la demande. Pas d'attente d'éditeur, pas de tirage limité.
- **Le journal**, où nous publierons régulièrement des extraits, des entretiens, et des éclairages sur les concepts abordés dans les ouvrages.
- **Une lecture continue**, pensée pour celles et ceux qui veulent suivre l'évolution d'une pensée plutôt que consommer des fragments isolés.

> Un livre n'est pas un produit. C'est une rencontre prolongée avec une pensée.

## Pour qui ?

Pour les **thérapeutes** qui cherchent à élargir leur cadre de référence. Pour les **étudiants** en psychologie ou en sciences humaines qui veulent dépasser les manuels. Pour les **lecteurs curieux** qui s'intéressent à la façon dont l'esprit se construit, se trouble, et se répare.

Aucun pré-requis. Chaque texte se suffit à lui-même, et chaque tome ouvre un chemin vers les suivants.

## Comment commencer

Parcourez le [catalogue](/) — chaque livre est présenté avec une description, un extrait quand disponible, et le choix entre numérique, broché, et relié. Le format que vous choisissez change l'expérience de lecture, pas le texte lui-même.

Bonne lecture.`,
  },
  {
    slug: 'coaching-therapie-psychanalyse-qui-fait-quoi',
    title: 'Coaching, thérapie, psychanalyse : qui fait quoi ?',
    category: 'Repères',
    excerpt:
      "Trois pratiques souvent confondues, trois cadres de travail distincts. Un repère simple pour s'y retrouver avant de choisir un accompagnement.",
    body: `Les frontières entre coaching, psychothérapie et psychanalyse sont souvent floues dans le langage courant. Trois pratiques, trois cadres, trois objets distincts — voici les distinctions structurantes.

## Le coaching : un cadre d'objectifs

Le coach travaille avec une personne qui se déclare en bonne santé psychique et qui souhaite atteindre un but identifiable : prendre un poste, mener un projet, sortir d'une indécision, améliorer une performance.

Le cadre est court (3 à 12 séances en moyenne), structuré, orienté résultat. Le coach pose des questions, propose des outils, soutient l'action. Il ne traite pas de symptôme.

**Question centrale** : *Où voulez-vous aller ?*

## La psychothérapie : un cadre de soin

Le psychothérapeute reçoit une personne qui souffre — anxiété, dépression, traumatismes, troubles relationnels, addictions, blocages durables. Le travail vise une amélioration symptomatique et un mieux-être tangible.

Les durées sont variables (quelques mois à plusieurs années) selon l'approche : TCC, thérapies humanistes, hypnose, EMDR, systémique, psychocorporelle. Le cadre est plus souple que la psychanalyse, plus profond que le coaching.

**Question centrale** : *Qu'est-ce qui vous empêche, et comment s'en libérer ?*

## La psychanalyse : un cadre de transformation

Le psychanalyste — au sens classique du terme — propose un travail au long cours, plusieurs séances par semaine, parfois pendant des années. L'objet n'est pas tant la disparition d'un symptôme que la transformation profonde du rapport à soi et aux autres.

Le dispositif (parfois le divan, parfois en face à face) sert à libérer une parole qui se déploie sans planification.

**Question centrale** : *Qui êtes-vous, vraiment ?*

## Comment choisir ?

Le bon repère n'est ni le titre du praticien ni l'école qu'il invoque, mais l'adéquation entre :

- **La demande** : objectif vs souffrance vs questionnement existentiel
- **Le cadre proposé** : durée, fréquence, méthodes
- **La relation** : se sent-on en confiance, écouté, respecté ?

> Le meilleur accompagnement est celui qui correspond à la question que vous vous posez vraiment — pas à celle qu'on aimerait avoir.

Aucune des trois pratiques n'est supérieure aux autres. Elles répondent à des besoins différents. Confondre les trois, c'est risquer une frustration : demander un coach pour traiter un trauma, ou un analyste pour préparer un entretien d'embauche.

## En savoir plus

Les ouvrages d'Édouard de Boysson — disponibles dans [le catalogue](/) — explorent en profondeur ces distinctions et les outils propres à chaque cadre. Les tomes des *Livres Thérapies* en particulier articulent la pratique clinique avec ses fondements théoriques.

*Cet article est une introduction générale. Il n'a pas valeur de diagnostic ni de prescription. En cas de souffrance psychique, l'avis d'un professionnel reste indispensable.*`,
  },
  {
    slug: 'pourquoi-publier-en-numerique-et-en-physique',
    title: 'Pourquoi publier en numérique et en physique',
    category: 'Édition',
    excerpt:
      "Le choix du format n'est pas neutre. Voici pourquoi chaque ouvrage de Logimind est disponible en PDF, broché, relié — et ce que ça change pour le lecteur.",
    body: `Le PDF n'a pas tué le livre. Il l'a libéré.

## Le PDF : pour penser avec le texte

Le format numérique a un avantage que le papier ne peut pas rivaliser : la **recherche**. Vous lisez un passage de chapitre 8, vous voulez retrouver la note de bas de page de chapitre 3 qui en parlait : trois secondes.

Pour les étudiants, les thérapeutes en formation, les lecteurs qui travaillent un livre — le PDF est l'outil. Annotations, surlignage, copier-coller pour citation.

Sur Logimind, vous recevez le PDF par email **immédiatement** après le paiement. Le lien est valable 7 jours et permet jusqu'à 5 téléchargements — c'est votre fichier, sur tous vos appareils.

## Le broché : pour la lecture continue

Le format broché reste le plus universel. Léger, transportable, lisible partout sans batterie. Sa souplesse permet l'annotation au crayon, le coin de page corné, la lecture en mouvement.

Nos brochés sont **imprimés à la demande** chez un partenaire européen (Lulu, Books on Demand). Pas de stock dormant, pas de gaspillage. Chaque exemplaire est neuf, imprimé pour vous, expédié sous 7 à 14 jours ouvrés.

## Le relié : pour la bibliothèque

Le relié — *hardcover* en anglais — est pensé pour la durée. Couverture rigide, papier de meilleur grammage, tenue dans le temps. C'est le format qu'on offre, qu'on conserve, qu'on transmet.

Pour les ouvrages de référence — les *Tomes*, les *Dictionnaires* — le relié justifie son prix par sa solidité. Vingt ans plus tard, il sera toujours sur l'étagère.

## Et Kindle ?

Le format Kindle se vend sur Amazon, qui gère son écosystème propriétaire. Quand l'auteur le propose, vous trouverez le bouton « Acheter sur Amazon » sur la fiche du livre. Le prix Amazon peut varier de celui pratiqué ici, et la livraison est instantanée sur votre liseuse.

## Acheter intelligent

Beaucoup de lecteurs combinent : **PDF pour étudier**, **broché pour lire**, **relié pour offrir ou collectionner**.

Si vous hésitez :
- Vous découvrez l'auteur ? Commencez par le PDF (le moins cher).
- Vous lisez beaucoup le soir, en mobilité ? Broché.
- Vous voulez un objet qui dure ? Relié.

Le texte est le même. C'est l'usage qui change.

> Le bon format n'est pas le plus prestigieux. C'est celui que vous lirez.`,
  },
];

async function main() {
  console.log('🔧 Migrations…');
  await runMigrations();
  console.log('📝 Seed blog posts…');
  const now = Math.floor(Date.now() / 1000);

  for (const p of POSTS) {
    const [existing] = await db
      .select()
      .from(schema.blogPosts)
      .where(eq(schema.blogPosts.slug, p.slug))
      .limit(1);

    if (existing) {
      console.log(`  • ${p.slug} (existe, id=${existing.id})`);
      continue;
    }

    const [row] = await db
      .insert(schema.blogPosts)
      .values({
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        body: p.body,
        coverUrl: p.coverUrl ?? null,
        category: p.category ?? null,
        readingMinutes: estimateReadingMinutes(p.body),
        isPublished: 1,
        publishedAt: now,
      })
      .returning();
    console.log(`  ✓ créé ${p.slug} (id=${row.id}, ${estimateReadingMinutes(p.body)} min)`);
  }

  console.log('✅ Seed blog terminé');
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Seed blog failed:', err);
  process.exit(1);
});
