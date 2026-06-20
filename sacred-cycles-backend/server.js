require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const leadsRouter = require("./routes/leads");

const app = express();
const PORT = process.env.PORT || 3001;

// ── Security & parsing middleware ─────────────────────────────────────────
app.use(helmet());
app.use(express.json({ limit: "10kb" }));

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
  })
);

const subscribeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: "Too many requests. Please try again in a few minutes." },
});
app.use("/api/subscribe", subscribeLimiter);

// ── Routes ─────────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", uptime_seconds: Math.round(process.uptime()), timestamp: new Date().toISOString() });
});

app.use("/api", leadsRouter);

// ── 404 + error handling ───────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ ok: false, error: "Not found." });
});

app.use((err, req, res, next) => {
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ ok: false, error: "Origin not allowed." });
  }
  console.error("[server] Unhandled error:", err);
  res.status(500).json({ ok: false, error: "Internal server error." });
});

app.listen(PORT, () => {
  console.log(`Sacred Cycles backend running on port ${PORT}`);
});
