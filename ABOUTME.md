# About This Project

## What It Does

Vendor Shortlist Builder automates the tedious first step of vendor evaluation. Instead of opening 10 browser tabs and manually comparing pricing pages, you describe what you need, set your priorities, and the AI does the research — visiting real vendor pages, extracting evidence, and scoring each option against your specific requirements.

The result is a ranked comparison table with direct evidence quotes from vendor docs, showing which vendors actually meet your needs vs. which are just hype.

## Design Decisions

**Async pipeline with polling** — vendor research takes 20–60 seconds (6 web fetches + 7 LLM calls). Instead of holding the HTTP connection open (which would time out), the server starts research in the background and returns an ID immediately. The React client polls every 3 seconds for completion. This is a production-grade pattern used by systems like Stripe webhooks and GitHub Actions.

**Tailwind via CDN** — no PostCSS build step in the client. The CDN script + `tailwind.config` in the HTML head gives full Tailwind utility access with zero configuration. Works well for Vite + React because Vite handles JSX but we don't need Tailwind's PostCSS pipeline.

**Weighted requirements** — a simple 1-3 weight per requirement dramatically improves result quality. A "must-have" requirement (weight 3) getting a "none" match should tank a vendor's score even if everything else fits. The LLM understands this and reflects it in the score.

**Evidence quotes** — every match/mismatch is backed by a direct quote from the scraped page (or the model's training knowledge with a source URL). This makes the tool trustworthy — you can click through and verify.

## Features Beyond the Basics

- **Vendor exclusions** — skip vendors you already know don't work
- **Dual view** — Card view for deep dives, Table view for quick scanning
- **Markdown export** — download the full shortlist as `.md` for docs/Notion
- **Live data badge** — shows which vendors had pages successfully scraped
- **Top Pick badge** — highlights the #1 ranked vendor at a glance
