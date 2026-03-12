import express from "express";
import cors from "cors";

import engagementRoutes from "./routes/engagementRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import webhookRoutes from "./routes/webhookRoutes.js";

export const app = express();

function normalizeOrigin(origin) {
  const raw = String(origin || "").trim();
  if (!raw) return "";
  try {
    return new URL(raw).origin;
  } catch {
    return raw.replace(/\/+$/, "");
  }
}

const explicitOrigins = new Set(
  String(process.env.FRONTEND_BASE_URLS || process.env.FRONTEND_BASE_URL || "")
    .split(",")
    .map((origin) => normalizeOrigin(origin))
    .filter(Boolean)
);

function isLocalDevOrigin(origin) {
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);
}

const vercelProjectPrefixes = String(
  process.env.FRONTEND_VERCEL_PROJECTS || "cloud9hookah-live,cloud9hookah,cloud9_hookah"
)
  .split(",")
  .map((value) => value.trim().toLowerCase())
  .filter(Boolean);

function isAllowedVercelOrigin(origin) {
  try {
    const normalized = normalizeOrigin(origin);
    const url = new URL(normalized);
    const hostname = String(url.hostname || "").toLowerCase();
    if (!hostname.endsWith(".vercel.app")) return false;
    return vercelProjectPrefixes.some(
      (prefix) => hostname === `${prefix}.vercel.app` || hostname.startsWith(`${prefix}-`)
    );
  } catch {
    return false;
  }
}

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser and same-process requests.
      if (!origin) return callback(null, true);
      const normalizedOrigin = normalizeOrigin(origin);

      if (explicitOrigins.has(normalizedOrigin)) return callback(null, true);
      if (isAllowedVercelOrigin(normalizedOrigin)) return callback(null, true);

      // In local development, allow localhost/127.0.0.1 across ports (4173, 5173, etc.).
      if (process.env.NODE_ENV !== "production" && isLocalDevOrigin(normalizedOrigin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked origin: ${normalizedOrigin}`), false);
    },
  })
);

// Payfast ITN uses form-urlencoded payloads.
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "cloud9-backend" });
});

app.use(engagementRoutes);
app.use(orderRoutes);
app.use(paymentRoutes);
app.use(reportRoutes);
app.use(webhookRoutes);

app.use((err, _req, res, _next) => {
  console.error("Unhandled server error:", err);
  const isProd = String(process.env.NODE_ENV || "").toLowerCase() === "production";
  const payload = { error: "Internal server error" };
  if (!isProd) {
    payload.details = err?.message || String(err);
    payload.code = err?.code || null;
  }
  res.status(500).json(payload);
});
