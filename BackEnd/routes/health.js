import express from "express";
import mongoose from "mongoose";

const router = express.Router();
const START = Date.now();

router.get("/", async (req, res) => {
  const dbState = mongoose.connection.readyState;
  const db = ["disconnected", "connected", "connecting", "disconnecting"][dbState] ?? "unknown";

  const uptime = Math.floor((Date.now() - START) / 1000);
  const ok = dbState === 1;

  res.status(ok ? 200 : 503).json({
    status: ok ? "ok" : "degraded",
    uptime_seconds: uptime,
    services: { express: "ok", mongodb: db },
    node_version: process.version,
    timestamp: new Date().toISOString(),
  });
});

export default router;
