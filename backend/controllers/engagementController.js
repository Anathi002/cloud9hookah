import { pool } from "../db/pool.js";
import {
  formatEmailBookingMessage,
  sendBusinessEmail,
} from "../services/emailService.js";

function isNonEmpty(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function toSafeNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function normalizeItems(items) {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => ({
      productName: String(item.product_name || item.productName || item.name || "").trim(),
      quantity: Math.max(1, Math.trunc(toSafeNumber(item.quantity, 1))),
      hours: Math.max(0, Math.trunc(toSafeNumber(item.hours, 0))),
      totalNow: Math.max(0, toSafeNumber(item.totalNow ?? item.total ?? item.price ?? 0, 0)),
    }))
    .filter((item) => item.productName.length > 0);
}

function cleanIp(req) {
  const forwardedFor = String(req.headers["x-forwarded-for"] || "")
    .split(",")[0]
    .trim();
  return forwardedFor || req.ip || null;
}

function normalizeBookingDate(value) {
  const raw = String(value || "").trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(raw) ? raw : null;
}

function normalizeBookingTime(value) {
  const raw = String(value || "").trim();
  const match = /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/.exec(raw);
  if (!match) return null;
  return `${match[1]}:${match[2]}`;
}

function formatLeadCaptureMessage(lead) {
  return [
    "New Lead Capture",
    "",
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    lead.phone ? `Phone: ${lead.phone}` : null,
    lead.interest ? `Interest: ${lead.interest}` : null,
    lead.source ? `Source: ${lead.source}` : null,
    lead.page ? `Page: ${lead.page}` : null,
    lead.notes ? `Notes: ${lead.notes}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

function formatReviewMessage(review) {
  return [
    "New Website Review",
    "",
    `Name: ${review.name}`,
    `Rating: ${review.rating}/5`,
    review.productRented ? `Product: ${review.productRented}` : null,
    "",
    "Review:",
    review.message,
  ]
    .filter(Boolean)
    .join("\n");
}

export async function createBookingRequest(req, res, next) {
  try {
    const { customer = {}, items = [], totalAmount = 0, source = "prelaunch-website" } = req.body || {};

    if (!isNonEmpty(customer.name) || !isNonEmpty(customer.phone) || !isNonEmpty(customer.address)) {
      return res.status(400).json({ error: "Customer name, phone, and address are required" });
    }

    const normalizedItems = normalizeItems(items);
    if (normalizedItems.length === 0) {
      return res.status(400).json({ error: "At least one item is required for booking request" });
    }

    const requestedDate = normalizeBookingDate(customer.bookingDate || customer.requestedDate);
    const requestedTime = normalizeBookingTime(customer.bookingTime || customer.requestedTime);
    if (!requestedDate || !requestedTime) {
      return res.status(400).json({ error: "Preferred booking date and time are required" });
    }

    const resolvedTotal =
      Math.max(0, toSafeNumber(totalAmount, 0)) ||
      normalizedItems.reduce((sum, item) => sum + item.totalNow, 0);

    const insertParams = [
      String(customer.name).trim(),
      String(customer.phone).trim(),
      String(customer.email || "").trim() || null,
      String(customer.address).trim(),
      String(customer.suburb || "").trim() || null,
      String(customer.notes || "").trim() || null,
      JSON.stringify(normalizedItems),
      resolvedTotal,
      String(source || "prelaunch-website").trim().slice(0, 120),
      requestedDate,
      requestedTime,
    ];

    let insertResult;
    try {
      insertResult = await pool.query(
        `INSERT INTO booking_requests
          (full_name, phone, email, address, suburb, notes, cart_snapshot, total_amount, source, requested_date, requested_time)
         VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8, $9, $10, $11)
         RETURNING id, created_at, full_name, phone, email, address, suburb, notes, total_amount, source, requested_date, requested_time`,
        insertParams
      );
    } catch (err) {
      // Backward compatibility if new schedule columns are not migrated yet.
      if (err?.code !== "42703") throw err;
      insertResult = await pool.query(
        `INSERT INTO booking_requests
          (full_name, phone, email, address, suburb, notes, cart_snapshot, total_amount, source)
         VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8, $9)
         RETURNING id, created_at, full_name, phone, email, address, suburb, notes, total_amount, source`,
        insertParams.slice(0, 9)
      );
    }

    const row = insertResult.rows[0];
    const bookingReference = `BK-${String(row.id).padStart(5, "0")}`;
    const bookingPayload = {
      ...row,
      items: normalizedItems,
      bookingReference,
      requestedDate: row.requested_date || requestedDate,
      requestedTime: row.requested_time || requestedTime,
    };

    void sendBusinessEmail({
      subject: `Cloud 9 Booking ${bookingReference}`,
      text: formatEmailBookingMessage(bookingPayload),
    })
      .then(() => {
        console.log("Booking email notification sent:", bookingReference);
      })
      .catch((reason) => {
        console.error("Booking email notification failed:", {
          message: reason?.message || String(reason),
          code: reason?.code || null,
          command: reason?.command || null,
          responseCode: reason?.responseCode || null,
        });
      });

    return res.status(201).json({
      ok: true,
      bookingId: row.id,
      bookingReference,
      createdAt: row.created_at,
      requestedDate: bookingPayload.requestedDate,
      requestedTime: bookingPayload.requestedTime,
      message: "Booking request captured. Team will contact customer.",
    });
  } catch (err) {
    return next(err);
  }
}

export async function captureLead(req, res, next) {
  try {
    const { name, email, phone, interest, notes, source, page } = req.body || {};

    const cleanName = String(name || "").trim();
    const cleanEmail = String(email || "").trim().toLowerCase();
    const cleanPhone = String(phone || "").trim();
    const cleanInterest = String(interest || "").trim();
    const cleanNotes = String(notes || "").trim();
    const cleanSource = String(source || "website-lead").trim();
    const cleanPage = String(page || "").trim() || null;

    if (!cleanName || !cleanEmail) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    const metaJson = {
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone || null,
      interest: cleanInterest || null,
      notes: cleanNotes || null,
      source: cleanSource,
      page: cleanPage,
    };

    await pool.query(
      `INSERT INTO engagement_events
        (session_id, event_name, page, referrer, user_agent, ip_address, meta)
       VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb)`,
      [
        null,
        "lead_captured",
        cleanPage,
        req.get("referer") || null,
        req.get("user-agent") || null,
        cleanIp(req),
        JSON.stringify(metaJson),
      ]
    );

    void sendBusinessEmail({
      subject: `Cloud 9 Lead ${cleanName}`,
      text: formatLeadCaptureMessage({
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        interest: cleanInterest,
        notes: cleanNotes,
        source: cleanSource,
        page: cleanPage,
      }),
    }).catch((reason) => {
      console.error("Lead capture email notification failed:", {
        message: reason?.message || String(reason),
        code: reason?.code || null,
        responseCode: reason?.responseCode || null,
      });
    });

    return res.status(202).json({
      ok: true,
      message: "Lead captured successfully",
    });
  } catch (err) {
    return next(err);
  }
}

export async function submitReview(req, res, next) {
  try {
    const { name, rating, message, productRented, source = "website" } = req.body || {};
    const cleanName = String(name || "").trim();
    const cleanMessage = String(message || "").trim();
    const cleanProduct = String(productRented || "").trim() || null;
    const cleanSource = String(source || "website").trim().slice(0, 80);
    const cleanRating = Math.trunc(toSafeNumber(rating, 0));

    if (!cleanName || !cleanMessage || cleanRating < 1 || cleanRating > 5) {
      return res.status(400).json({ error: "Name, rating from 1 to 5, and review message are required" });
    }

    const result = await pool.query(
      `INSERT INTO customer_reviews
        (customer_name, rating, message, product_rented, source, status)
       VALUES ($1, $2, $3, $4, $5, 'PENDING')
       RETURNING id, created_at`,
      [cleanName, cleanRating, cleanMessage, cleanProduct, cleanSource]
    );

    void sendBusinessEmail({
      subject: `Cloud 9 Review ${cleanRating}/5`,
      text: formatReviewMessage({
        name: cleanName,
        rating: cleanRating,
        message: cleanMessage,
        productRented: cleanProduct,
      }),
    }).catch((reason) => {
      console.error("Review email notification failed:", {
        message: reason?.message || String(reason),
        code: reason?.code || null,
        responseCode: reason?.responseCode || null,
      });
    });

    return res.status(201).json({
      ok: true,
      reviewId: result.rows[0].id,
      createdAt: result.rows[0].created_at,
      message: "Review received and pending approval",
    });
  } catch (err) {
    return next(err);
  }
}

export async function trackEngagementEvent(req, res, next) {
  try {
    const { sessionId, eventName, page, meta } = req.body || {};
    const cleanEventName = String(eventName || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_.-]/g, "_")
      .slice(0, 64);

    if (!cleanEventName) {
      return res.status(400).json({ error: "eventName is required" });
    }

    const metaJson = meta && typeof meta === "object" ? meta : {};

    await pool.query(
      `INSERT INTO engagement_events
        (session_id, event_name, page, referrer, user_agent, ip_address, meta)
       VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb)`,
      [
        String(sessionId || "").trim() || null,
        cleanEventName,
        String(page || "").trim() || null,
        req.get("referer") || null,
        req.get("user-agent") || null,
        cleanIp(req),
        JSON.stringify(metaJson),
      ]
    );

    return res.status(202).json({ ok: true });
  } catch (err) {
    return next(err);
  }
}
