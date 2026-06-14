# Vendor Discovery + Shortlist Builder

AI-powered vendor research tool. Describe your need, set weighted requirements, and get a ranked comparison table with real evidence from vendor pricing/docs pages.

## How It Works

```
User enters need + requirements
        │
        ▼
Express API (Node.js)
        │
        ├─ Step 1: GPT-4o mini identifies 5–8 vendors + URLs
        │
        ├─ Step 2: axios + cheerio scrapes pricing/docs pages
        │
        ├─ Step 3: GPT analyzes each vendor against requirements
        │          → match level, evidence quotes, risks, score
        │
        └─ Step 4: Results ranked by weighted score → MongoDB
                   Markdown export generated
```

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS via CDN (no build step) |
| Backend | Express 4 + Node.js 20 |
| Database | MongoDB Atlas (Mongoose) |
| AI | OpenAI GPT-4o mini |
| Web scraping | axios + cheerio |
| Deployment | Docker + Docker Compose |

## Quick Start

### Docker (recommended)

```bash
git clone repo
cp .env.example .env
# Fill in MONGODB_URI and OPENAI_API_KEY
docker-compose up --build
```

- App: http://localhost:3000
- API: http://localhost:5000

### Local Dev

**Terminal 1 — BackEnd**
```bash
cd BackEnd
npm install
cp .env.example .env
# Fill in MONGODB_URI and OPENAI_API_KEY
npm run dev
```

**Terminal 2 — FrontEnd**
```bash
cd client
npm install
npm run dev
# Opens http://localhost:5173
```

## MongoDB Atlas Setup

1. Create free cluster at mongodb.com/atlas
2. Network Access → Allow `0.0.0.0/0`
3. Database Access → Create user
4. Connect → Drivers → Copy connection string into `MONGODB_URI`

No vector search index needed (this app uses standard MongoDB for history storage).

## Features

- **Weighted requirements** — mark each requirement Low/Medium/High priority
- **Vendor exclusions** — skip known vendors you don't want
- **Live web scraping** — actually fetches pricing/docs pages with axios + cheerio
- **Evidence quotes** — direct snippets from vendor pages for each requirement
- **Dual view** — flip between Card view and Comparison Table
- **Markdown export** — download full shortlist as `.md`
- **History** — last 5 shortlists saved per browser session
- **Async pipeline** — UI polls for completion, no timeout issues

## Project Structure

```
mern-vendor-shortlist/
├── client/
│   ├── index.html              # Tailwind CDN injected here
│   ├── src/
│   │   ├── api/client.js       # Axios API wrapper
│   │   ├── components/         # Navbar, VendorCard, ComparisonTable, ...
│   │   └── pages/              # Home, Results, History, Status, NotFound
│   └── Dockerfile
├── BackEnd/
│   ├── middleware/asyncHandler.js 
│   ├── routes/shortlist.js     # POST /build, GET /:id, GET /history/:sid
│   ├── routes/health.js
│   ├── services/research.js    # Web scraping with axios + cheerio
│   ├── services/ai.js          # OpenAI prompts (identify + analyze + markdown)
│   ├── models/Shortlist.js     # Mongoose schema
│   └── Dockerfile
├── docker-compose.yml
└── .env.example
```
