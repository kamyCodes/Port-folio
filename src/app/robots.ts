import { baseURL } from "@/resources";

export default function robots() {
  const aiAgents = [
    "GPTBot",
    "ChatGPT-User",
    "ClaudeBot",
    "Claude-Web",
    "PerplexityBot",
    "Google-Extended",
    "Applebot-Extended",
    "CCBot",
    "cohere-ai",
    "anthropic-ai",
    "Omgilibot",
    "FacebookExternalHit",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/"],
      },
      ...aiAgents.map((agent) => ({
        userAgent: agent,
        allow: "/",
      })),
    ],
    sitemap: `${baseURL}/sitemap.xml`,
  };
}

