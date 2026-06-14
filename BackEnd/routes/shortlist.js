import express from "express";
import { v4 as uuid } from "uuid";
import Shortlist from "../models/Shortlist.js";
import { scrapeVendors } from "../services/research.js";
import { identifyVendors, analyzeVendor, generateMarkdown } from "../services/ai.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = express.Router();

// POST /api/shortlist/build
router.post(
  "/build",
  asyncHandler(async (req, res) => {
    const { need, requirements, excludedVendors = [], sessionId: incomingId } = req.body;

    if (!need?.trim()) return res.status(400).json({ error: "need is required" });
    if (!requirements?.length || requirements.length < 3)
      return res.status(400).json({ error: "At least 3 requirements are needed" });

    const sessionId = incomingId || uuid().slice(0, 8);

    // Create record immediately so client can poll
    const record = await Shortlist.create({
      sessionId,
      need,
      requirements,
      excludedVendors,
      vendors: [],
      status: "processing",
    });

    // Return immediately so the UI can start polling
    res.json({ id: record._id, sessionId, status: "processing" });

    // Run research pipeline in background
    (async () => {
      try {
        // Step 1 — identify vendors
        const rawVendors = await identifyVendors(need, requirements, excludedVendors);

        // Step 2 — scrape vendor pages in parallel
        const scrapedVendors = await scrapeVendors(rawVendors);

        // Step 3 — analyze each vendor in parallel
        const analyses = await Promise.all(
          scrapedVendors.map((v) => analyzeVendor(v, requirements, need))
        );

        // Merge results
        const vendors = scrapedVendors.map((v, i) => ({
          name: v.name,
          website: v.website,
          pricingUrl: v.pricingUrl,
          priceRange: analyses[i]?.priceRange || v.priceRange,
          summary: v.summary,
          featureMatches: analyses[i]?.featureMatches || [],
          risks: analyses[i]?.risks || [],
          score: analyses[i]?.score || 0,
          scrapedSuccessfully: v.scrapedSuccessfully,
        }));

        // Sort by score descending
        vendors.sort((a, b) => b.score - a.score);

        // Step 4 — generate markdown export
        const markdownExport = await generateMarkdown(need, requirements, vendors);

        await Shortlist.findByIdAndUpdate(record._id, {
          vendors,
          markdownExport,
          status: "done",
        });

        await Shortlist.enforceLimit(sessionId, 5);
      } catch (err) {
        console.error("Research pipeline error:", err.message);
        await Shortlist.findByIdAndUpdate(record._id, {
          status: "error",
          errorMessage: err.message,
        });
      }
    })();
  })
);

// GET /api/shortlist/:id — poll for status
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const record = await Shortlist.findById(req.params.id);
    if (!record) return res.status(404).json({ error: "Shortlist not found" });
    res.json(record);
  })
);

// GET /api/shortlist/history/:sessionId
router.get(
  "/history/:sessionId",
  asyncHandler(async (req, res) => {
    const records = await Shortlist.find({ sessionId: req.params.sessionId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("-markdownExport");
    res.json(records);
  })
);

// DELETE /api/shortlist/:id
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    await Shortlist.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  })
);

export default router;
