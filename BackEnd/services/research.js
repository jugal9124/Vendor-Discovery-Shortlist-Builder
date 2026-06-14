import axios from "axios";
import * as cheerio from "cheerio";

const FETCH_TIMEOUT = 10_000;
const MAX_CONTENT_CHARS = 8_000;

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (compatible; VendorResearchBot/1.0; +https://vendorshortlist.app)",
  Accept: "text/html,application/xhtml+xml,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
};

/**
 * Fetch a URL and extract meaningful text content.
 * Returns { text, success, error }
 */
export async function fetchPageContent(url) {
  try {
    const resp = await axios.get(url, {
      headers: HEADERS,
      timeout: FETCH_TIMEOUT,
      maxRedirects: 5,
      responseType: "text",
    });

    const $ = cheerio.load(resp.data);

    // Remove noise
    $("script, style, nav, footer, header, iframe, noscript, svg").remove();

    // Prefer main content areas
    const selectors = [
      "main",
      "article",
      '[class*="pricing"]',
      '[class*="content"]',
      '[id*="pricing"]',
      '[id*="content"]',
      "body",
    ];

    let text = "";
    for (const sel of selectors) {
      const el = $(sel).first();
      if (el.length) {
        text = el.text();
        break;
      }
    }

    // Clean whitespace
    text = text
      .replace(/\s+/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim()
      .slice(0, MAX_CONTENT_CHARS);

    return { text, success: true };
  } catch (err) {
    return {
      text: "",
      success: false,
      error: err.message || "Fetch failed",
    };
  }
}

/**
 * Scrape multiple vendor URLs in parallel with individual error handling.
 */
export async function scrapeVendors(vendors) {
  const results = await Promise.allSettled(
    vendors.map(async (v) => {
      const url = v.pricingUrl || v.website;
      if (!url) return { ...v, pageContent: "", scrapedSuccessfully: false };
      const { text, success } = await fetchPageContent(url);
      return { ...v, pageContent: text, scrapedSuccessfully: success };
    })
  );

  return results.map((r, i) =>
    r.status === "fulfilled"
      ? r.value
      : { ...vendors[i], pageContent: "", scrapedSuccessfully: false }
  );
}
