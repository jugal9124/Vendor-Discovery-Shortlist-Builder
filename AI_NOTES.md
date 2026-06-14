# AI Notes

## The Two-Stage AI Pipeline

### Stage 1 — Vendor Identification (`identifyVendors`)

A single GPT-4o-mini call identifies 6 vendors for the given need. It returns:
- Company name + website URL
- Pricing/docs URL (the specific page to scrape)
- Price range estimate
- 1–2 sentence summary

This leverages the model's training knowledge of the vendor landscape. No search API needed.

**Why not more vendors?** 6 is a practical limit — each vendor requires one web fetch and one LLM analysis call. More vendors = higher cost + latency.

### Stage 2 — Vendor Analysis (`analyzeVendor`)

One GPT-4o-mini call per vendor. The model receives:
- Scraped page content (up to 8,000 chars)
- The user's requirements with weights
- The vendor name and summary

It returns structured JSON:
- Per-requirement: match level (full/partial/none), evidence quote, source URL
- Risks list (3 items)
- Weighted score (0-100)

**Temperature 0.1** — factual analysis, minimal creativity. Grounded in provided content.

## Web Scraping Strategy

1. Browser-like `User-Agent` header to avoid bot blocks
2. `cheerio` extracts text from semantic HTML elements (main, article, [class*=pricing])
3. Scripts/styles/nav/footer stripped before extraction
4. Hard limit: 8,000 chars per page (fits in one LLM context slot)
5. Graceful fallback: if scrape fails, GPT uses training knowledge only

## Weighted Scoring

The `score` field (0-100) is calculated by the LLM considering:
- Number of full/partial/none matches
- The weight (1-3) of each requirement
- A High-weight full match contributes ~3x more than a Low-weight full match

This is intentional — we let the LLM compute the weighted score rather than hard-coding a formula, because it can also factor in qualitative evidence strength.

## What Was Not Blind Copy-Paste

- Custom regex-based MongoDB URI sanitization for special-character passwords
- `Shortlist.enforceLimit()` as a Mongoose static method enforcing exactly 5 per session
- Async background pipeline: endpoint returns immediately, client polls — avoids HTTP timeouts
- Cheerio selector priority list (main > article > [class*=pricing] > body) extracts pricing-relevant content
- Animated progress step cycling in Results.jsx gives real UX feedback during 20-60s wait

## Known Limitations

- JS-heavy SPAs (React/Next.js marketing sites) may return little content — LLM falls back to training data
- Some vendors actively block scrapers — the tool degrades gracefully (flag: `scrapedSuccessfully: false`)
- Price ranges are approximate — always verify on vendor's site before purchasing
