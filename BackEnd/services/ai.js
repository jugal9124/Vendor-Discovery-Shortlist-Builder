import path from "path";
import dotenv from "dotenv";
dotenv.config();
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Step 1 — Identify 5–8 vendors for the given need.
 * Returns structured JSON with vendor name + URLs.
 */
export async function identifyVendors(need, requirements, excludedVendors = []) {
  const reqText = requirements.map((r, i) => `${i + 1}. ${r.text} (weight: ${r.weight}/3)`).join("\n");
  const excluded = excludedVendors.length
    ? `\nExclude these vendors: ${excludedVendors.join(", ")}`
    : "";

  const prompt = `You are a senior procurement analyst. A user needs: "${need}"

Requirements (with weights 1-3, higher = more important):
${reqText}${excluded}

Identify exactly 6 real vendors that serve this need. For each vendor provide:
- name: vendor company name
- website: main website URL
- pricingUrl: direct URL to their pricing or docs page (must be real, accessible URLs)
- priceRange: estimated price range (e.g. "$9–$99/mo", "Free tier + paid", "Custom enterprise")
- summary: 1–2 sentence description of what they offer

Return ONLY valid JSON array, no markdown:
[{"name":"...","website":"...","pricingUrl":"...","priceRange":"...","summary":"..."}]`;

  const resp = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
    response_format: { type: "json_object" },
  });

  const raw = resp.choices[0].message.content;
  const parsed = JSON.parse(raw);
  // Handle both {vendors:[...]} and [...] shapes
  return Array.isArray(parsed) ? parsed : (parsed.vendors || parsed.results || Object.values(parsed)[0]);
}

/**
 * Step 2 — Analyze each vendor against requirements using scraped page content.
 */
export async function analyzeVendor(vendor, requirements, need) {
  const reqText = requirements
    .map((r, i) => `${i + 1}. ${r.text} (weight: ${r.weight}/3)`)
    .join("\n");

  const context = vendor.pageContent
    ? `Scraped content from ${vendor.pricingUrl || vendor.website}:\n"""\n${vendor.pageContent}\n"""`
    : `No page content available. Use your knowledge about ${vendor.name}.`;

  const prompt = `You are a senior procurement analyst evaluating "${vendor.name}" for: "${need}"

${context}

Requirements to evaluate (with weights 1-3):
${reqText}

Vendor summary: ${vendor.summary}
Estimated price range: ${vendor.priceRange}

Return ONLY valid JSON (no markdown):
{
  "featureMatches": [
    {
      "requirement": "requirement text",
      "match": "full" | "partial" | "none",
      "evidence": "direct quote or observation from the page (max 120 chars)",
      "evidenceUrl": "URL where this was found or empty string"
    }
  ],
  "risks": ["risk 1", "risk 2", "risk 3"],
  "score": <weighted score 0-100 based on match quality and weights>,
  "priceRange": "confirmed or updated price range"
}`;

  const resp = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.1,
    response_format: { type: "json_object" },
  });

  return JSON.parse(resp.choices[0].message.content);
}

/**
 * Generate a clean markdown export of the full shortlist.
 */
export async function generateMarkdown(need, requirements, vendors) {
  const table = vendors
    .map(
      (v) =>
        `### ${v.name} — Score: ${v.score}/100\n` +
        `**Price:** ${v.priceRange}\n` +
        `**Summary:** ${v.summary}\n` +
        `**Risks:** ${v.risks?.join("; ") || "None identified"}\n` +
        `**Source:** ${v.pricingUrl || v.website}\n`
    )
    .join("\n---\n\n");

  return `# Vendor Shortlist: ${need}\n\n` +
    `**Requirements:**\n${requirements.map((r) => `- ${r.text} (weight ${r.weight}/3)`).join("\n")}\n\n` +
    `---\n\n## Vendors\n\n${table}\n\n` +
    `*Generated ${new Date().toISOString()}*\n`;
}
