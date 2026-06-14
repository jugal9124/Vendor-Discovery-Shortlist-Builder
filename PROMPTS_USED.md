# Prompts Used

## Prompt 1 — Vendor Identification

```
You are a senior procurement analyst. A user needs: "{need}"

Requirements (with weights 1-3, higher = more important):
{requirements}

Exclude these vendors: {excludedVendors}

Identify exactly 6 real vendors that serve this need. For each vendor provide:
- name: vendor company name
- website: main website URL
- pricingUrl: direct URL to their pricing or docs page (must be real, accessible URLs)
- priceRange: estimated price range (e.g. "$9–$99/mo", "Free tier + paid", "Custom enterprise")
- summary: 1–2 sentence description of what they offer

Return ONLY valid JSON array, no markdown:
[{"name":"...","website":"...","pricingUrl":"...","priceRange":"...","summary":"..."}]
```

**Design notes:**
- "exactly 6" prevents variable-length arrays that complicate UI
- "real, accessible URLs" reduces hallucinated URLs (not 100% reliable, but helps)
- JSON-only output with `response_format: {type: "json_object"}` enforces parseable output

---

## Prompt 2 — Vendor Analysis (per vendor)

```
You are a senior procurement analyst evaluating "{vendor.name}" for: "{need}"

{scrapedContent or fallback message}

Requirements to evaluate (with weights 1-3):
{requirements}

Vendor summary: {summary}
Estimated price range: {priceRange}

Return ONLY valid JSON (no markdown):
{
  "featureMatches": [
    {
      "requirement": "requirement text",
      "match": "full" | "partial" | "none",
      "evidence": "direct quote or observation (max 120 chars)",
      "evidenceUrl": "URL where this was found or empty string"
    }
  ],
  "risks": ["risk 1", "risk 2", "risk 3"],
  "score": <weighted score 0-100>,
  "priceRange": "confirmed or updated price range"
}
```

**Design notes:**
- "max 120 chars" for evidence keeps quotes scannable in the UI
- `score` is deliberately left to the model — it understands weight semantics better than a hardcoded formula
- Temperature 0.1 for factual, reproducible analysis
- Prompt structure mirrors how a human analyst would think (context → requirements → output)

---

## Prompt 3 — Markdown Export

```
Generate a clean markdown export of the shortlist...
```

This is a pure formatting prompt — low stakes, temperature doesn't matter.

---

## Model Parameters

| Setting | Value | Reason |
|---|---|---|
| Model | `gpt-4o-mini` | Cost-effective, strong structured output |
| Temperature | `0.2` (identify), `0.1` (analyze) | Lower = more factual, consistent |
| response_format | `json_object` | Prevents markdown wrapping |

---

## Example Inputs That Work Well

- "Email delivery service for India" — clear geography, specific service type
- "CI/CD platform for teams under 10 engineers" — budget scope implied
- "Observability tool under $200/month" — price constraint
- "Headless CMS for a React + Next.js app" — technical fit requirement
