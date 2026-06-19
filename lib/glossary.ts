/**
 * Glossaire des néologismes propriétaires LogiMind (TIAB / TBRN / TBCE).
 * Source : doc d'instructions Edmond (addendum bilingue 2026-05-27).
 * Sigles conservés invariants FR/EN (recommandation auteur) ; le nom complet
 * diffère selon la langue.
 */
export interface GlossaryTerm {
  acronym: string;
  slug: string;
  fr: { name: string; definition: string };
  en: { name: string; definition: string };
}

export const GLOSSARY: GlossaryTerm[] = [
  {
    acronym: 'TIAB',
    slug: 'tiab',
    fr: {
      name: "Thérapie de l'Identité Adaptative Brève",
      definition:
        "Approche brève centrée sur la plasticité de l'identité : elle vise à assouplir les représentations de soi rigidifiées pour permettre au sujet de s'adapter à de nouveaux contextes sans rupture de cohérence personnelle. Le sigle TIAB est conservé comme acronyme invariant en français comme en anglais.",
    },
    en: {
      name: 'Brief Adaptive Identity Therapy',
      definition:
        "A brief approach centred on the plasticity of identity: it aims to loosen rigidified self-representations so the person can adapt to new contexts without losing personal coherence. The acronym TIAB is preserved as an invariant; the literal English name is Brief Adaptive Identity Therapy.",
    },
  },
  {
    acronym: 'TBRN',
    slug: 'tbrn',
    fr: {
      name: 'Thérapie Brève de la Régulation Narrative',
      definition:
        "Approche brève travaillant sur le récit de soi : en réorganisant la trame narrative des expériences, elle cherche à restaurer un sentiment de continuité et d'agentivité. Le sigle TBRN est conservé comme acronyme invariant.",
    },
    en: {
      name: 'Brief Narrative Regulation Therapy',
      definition:
        "A brief approach working on self-narrative: by reorganising the narrative thread of experience, it seeks to restore a sense of continuity and agency. The acronym TBRN is preserved as an invariant.",
    },
  },
  {
    acronym: 'TBCE',
    slug: 'tbce',
    fr: {
      name: 'Thérapie Brève de la Cohérence Émotionnelle',
      definition:
        "Approche brève visant à réaligner ressentis, pensées et conduites autour d'une cohérence émotionnelle : elle traite les contradictions affectives comme leviers de changement plutôt que comme symptômes. Le sigle TBCE est conservé comme acronyme invariant.",
    },
    en: {
      name: 'Brief Emotional Coherence Therapy',
      definition:
        "A brief approach aiming to realign feelings, thoughts and behaviour around emotional coherence: it treats affective contradictions as levers for change rather than as symptoms. The acronym TBCE is preserved as an invariant.",
    },
  },
];

export function getTerm(slug: string): GlossaryTerm | undefined {
  return GLOSSARY.find((t) => t.slug === slug);
}

/** Encart « tests d'unicité » (verbatim du doc). */
export const UNIQUENESS_NOTE_FR =
  "Chaque néologisme propriétaire LogiMind est validé par un test d'unicité Google Scholar / OpenAlex / Consensus.app. Rapport interne du 26 mai 2026 disponible sur demande.";
export const UNIQUENESS_NOTE_EN =
  'Each proprietary LogiMind neologism is validated by a uniqueness test across Google Scholar, OpenAlex and Consensus.app. Internal report dated 26 May 2026 available on request.';
