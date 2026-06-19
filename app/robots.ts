import type { MetadataRoute } from 'next';

// Bots de moteurs IA / LLM explicitement autorisés (référencement GEO).
// Le wildcard '*' les couvre déjà ; ces règles rendent l'autorisation explicite
// (certains crawlers privilégient un user-agent nommé) et documentent l'intention.
const AI_BOTS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'CCBot',
  'Applebot-Extended',
];

const DISALLOW = ['/admin/', '/api/', '/orders/'];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: DISALLOW },
      ...AI_BOTS.map((userAgent) => ({ userAgent, allow: '/', disallow: DISALLOW })),
    ],
    sitemap: 'https://logimind.org/sitemap.xml',
    host: 'https://logimind.org',
  };
}
