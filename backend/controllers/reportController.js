import { pool } from "../db/pool.js";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function isValidDate(value) {
  return DATE_RE.test(String(value || ""));
}

function clampInt(value, fallback, min, max) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(Math.max(Math.trunc(parsed), min), max);
}

function toDateInTimeZone(date, timeZone) {
  try {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(date);
    const year = parts.find((part) => part.type === "year")?.value;
    const month = parts.find((part) => part.type === "month")?.value;
    const day = parts.find((part) => part.type === "day")?.value;
    if (year && month && day) return `${year}-${month}-${day}`;
  } catch (_err) {
    // Fall back to UTC if timezone is invalid.
  }
  return date.toISOString().slice(0, 10);
}

function addDays(dateString, deltaDays) {
  const [year, month, day] = String(dateString)
    .split("-")
    .map((value) => Number(value));
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + deltaDays);
  return date.toISOString().slice(0, 10);
}

function toMoney(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function toCount(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

async function safeQuery(sql, params) {
  try {
    return await pool.query(sql, params);
  } catch (err) {
    // Keep reports alive if migrations for new analytics tables are not run yet.
    if (err?.code === "42P01") {
      return { rows: [], rowCount: 0 };
    }
    throw err;
  }
}

function resolveReportFilters(req) {
  const timeZone = String(process.env.REPORT_TIMEZONE || "Africa/Johannesburg").trim() || "Africa/Johannesburg";
  const defaultDays = clampInt(process.env.REPORT_DEFAULT_DAYS, 30, 1, 365);
  const defaultTop = clampInt(process.env.REPORT_TOP_PRODUCTS_LIMIT, 5, 1, 20);
  const topProductsLimit = clampInt(req.query.top, defaultTop, 1, 20);

  const today = toDateInTimeZone(new Date(), timeZone);
  const defaultFrom = addDays(today, -(defaultDays - 1));

  const fromDate = String(req.query.from || defaultFrom);
  const toDate = String(req.query.to || today);

  if (!isValidDate(fromDate) || !isValidDate(toDate)) {
    return { error: "Invalid date format. Use YYYY-MM-DD for from/to." };
  }

  if (fromDate > toDate) {
    return { error: "`from` date cannot be after `to` date." };
  }

  return { fromDate, toDate, timeZone, topProductsLimit };
}

async function loadTrafficReportData({ fromDate, toDate, timeZone, topProductsLimit }) {
  const summarySql = `
    SELECT
      COUNT(*)::int AS total_orders,
      COUNT(*) FILTER (WHERE status = 'PENDING')::int AS pending_orders,
      COUNT(*) FILTER (WHERE status = 'PAID')::int AS paid_orders,
      COUNT(*) FILTER (WHERE status = 'FAILED')::int AS failed_orders,
      COUNT(*) FILTER (WHERE status = 'CANCELLED')::int AS cancelled_orders,
      COUNT(DISTINCT customer_id)::int AS unique_customers,
      COALESCE(SUM(total_amount) FILTER (WHERE status = 'PAID'), 0)::numeric AS paid_revenue
    FROM orders
    WHERE (created_at AT TIME ZONE $3)::date BETWEEN $1::date AND $2::date
  `;

  const dailySql = `
    SELECT
      TO_CHAR((created_at AT TIME ZONE $3)::date, 'YYYY-MM-DD') AS day,
      COUNT(*)::int AS total_orders,
      COUNT(*) FILTER (WHERE status = 'PAID')::int AS paid_orders,
      COALESCE(SUM(total_amount) FILTER (WHERE status = 'PAID'), 0)::numeric AS paid_revenue
    FROM orders
    WHERE (created_at AT TIME ZONE $3)::date BETWEEN $1::date AND $2::date
    GROUP BY (created_at AT TIME ZONE $3)::date
    ORDER BY (created_at AT TIME ZONE $3)::date ASC
  `;

  const topProductsSql = `
    SELECT
      oi.product_name,
      SUM(oi.quantity)::int AS quantity_sold,
      COALESCE(SUM(oi.quantity * oi.price), 0)::numeric AS paid_revenue
    FROM order_items oi
    JOIN orders o ON o.id = oi.order_id
    WHERE o.status = 'PAID'
      AND (o.created_at AT TIME ZONE $3)::date BETWEEN $1::date AND $2::date
    GROUP BY oi.product_name
    ORDER BY quantity_sold DESC, paid_revenue DESC, oi.product_name ASC
    LIMIT $4
  `;

  const bookingSummarySql = `
    SELECT
      COUNT(*)::int AS booking_requests,
      COUNT(DISTINCT COALESCE(NULLIF(LOWER(TRIM(email)), ''), NULLIF(TRIM(phone), '')))::int AS unique_leads
    FROM booking_requests
    WHERE (created_at AT TIME ZONE $3)::date BETWEEN $1::date AND $2::date
  `;

  const engagementSummarySql = `
    SELECT COUNT(*)::int AS engagement_events
    FROM engagement_events
    WHERE (created_at AT TIME ZONE $3)::date BETWEEN $1::date AND $2::date
  `;

  const bookingDailySql = `
    SELECT
      TO_CHAR((created_at AT TIME ZONE $3)::date, 'YYYY-MM-DD') AS day,
      COUNT(*)::int AS booking_requests
    FROM booking_requests
    WHERE (created_at AT TIME ZONE $3)::date BETWEEN $1::date AND $2::date
    GROUP BY (created_at AT TIME ZONE $3)::date
    ORDER BY (created_at AT TIME ZONE $3)::date ASC
  `;

  const engagementDailySql = `
    SELECT
      TO_CHAR((created_at AT TIME ZONE $3)::date, 'YYYY-MM-DD') AS day,
      COUNT(*)::int AS engagement_events
    FROM engagement_events
    WHERE (created_at AT TIME ZONE $3)::date BETWEEN $1::date AND $2::date
    GROUP BY (created_at AT TIME ZONE $3)::date
    ORDER BY (created_at AT TIME ZONE $3)::date ASC
  `;

  const engagementByEventSql = `
    SELECT event_name, COUNT(*)::int AS event_count
    FROM engagement_events
    WHERE (created_at AT TIME ZONE $3)::date BETWEEN $1::date AND $2::date
    GROUP BY event_name
    ORDER BY event_count DESC, event_name ASC
    LIMIT 12
  `;

  const [summaryResult, dailyResult, topProductsResult, bookingSummaryResult, engagementSummaryResult, bookingDailyResult, engagementDailyResult, engagementByEventResult] = await Promise.all([
    pool.query(summarySql, [fromDate, toDate, timeZone]),
    pool.query(dailySql, [fromDate, toDate, timeZone]),
    pool.query(topProductsSql, [fromDate, toDate, timeZone, topProductsLimit]),
    safeQuery(bookingSummarySql, [fromDate, toDate, timeZone]),
    safeQuery(engagementSummarySql, [fromDate, toDate, timeZone]),
    safeQuery(bookingDailySql, [fromDate, toDate, timeZone]),
    safeQuery(engagementDailySql, [fromDate, toDate, timeZone]),
    safeQuery(engagementByEventSql, [fromDate, toDate, timeZone]),
  ]);

  const summaryRow = summaryResult.rows[0] || {};
  const bookingSummaryRow = bookingSummaryResult.rows[0] || {};
  const engagementSummaryRow = engagementSummaryResult.rows[0] || {};
  const totalOrders = toCount(summaryRow.total_orders);
  const paidOrders = toCount(summaryRow.paid_orders);
  const conversionRate = totalOrders > 0 ? Number(((paidOrders / totalOrders) * 100).toFixed(2)) : 0;

  return {
    period: {
      from: fromDate,
      to: toDate,
      timeZone,
      topProductsLimit,
    },
      summary: {
        totalOrders,
        pendingOrders: toCount(summaryRow.pending_orders),
        paidOrders,
        failedOrders: toCount(summaryRow.failed_orders),
        cancelledOrders: toCount(summaryRow.cancelled_orders),
        uniqueCustomers: toCount(summaryRow.unique_customers),
        paidRevenue: toMoney(summaryRow.paid_revenue),
        conversionRatePercent: conversionRate,
        bookingRequests: toCount(bookingSummaryRow.booking_requests),
        uniqueLeads: toCount(bookingSummaryRow.unique_leads),
        engagementEvents: toCount(engagementSummaryRow.engagement_events),
      },
      dailyTrend: dailyResult.rows.map((row) => ({
        day: row.day,
        totalOrders: toCount(row.total_orders),
        paidOrders: toCount(row.paid_orders),
        paidRevenue: toMoney(row.paid_revenue),
      })),
      dailyBookings: bookingDailyResult.rows.map((row) => ({
        day: row.day,
        bookingRequests: toCount(row.booking_requests),
      })),
      dailyEngagement: engagementDailyResult.rows.map((row) => ({
        day: row.day,
        engagementEvents: toCount(row.engagement_events),
      })),
      engagementByEvent: engagementByEventResult.rows.map((row) => ({
        eventName: row.event_name,
        eventCount: toCount(row.event_count),
      })),
      topProducts: topProductsResult.rows.map((row) => ({
        productName: row.product_name,
        quantitySold: toCount(row.quantity_sold),
        paidRevenue: toMoney(row.paid_revenue),
    })),
  };
}

function csvEscape(value) {
  if (value === null || value === undefined) return "";
  const s = String(value);
  if (s.includes(",") || s.includes('"') || s.includes("\n") || s.includes("\r")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function buildTrafficCsv(report) {
  const rows = [];
  const { period, summary, dailyTrend, dailyBookings, dailyEngagement, topProducts, engagementByEvent } = report;

  rows.push([
    "section",
    "label",
    "from_date",
    "to_date",
    "time_zone",
    "top_limit",
    "total_orders",
    "pending_orders",
    "paid_orders",
    "failed_orders",
    "cancelled_orders",
    "unique_customers",
    "paid_revenue",
    "conversion_rate_percent",
    "booking_requests",
    "unique_leads",
    "engagement_events",
    "day",
    "product_name",
    "quantity_sold",
    "event_name",
    "event_count",
  ]);

  rows.push([
    "summary",
    "overall",
    period.from,
    period.to,
    period.timeZone,
    period.topProductsLimit,
    summary.totalOrders,
    summary.pendingOrders,
    summary.paidOrders,
    summary.failedOrders,
    summary.cancelledOrders,
    summary.uniqueCustomers,
    summary.paidRevenue,
    summary.conversionRatePercent,
    summary.bookingRequests,
    summary.uniqueLeads,
    summary.engagementEvents,
    "",
    "",
    "",
    "",
    "",
  ]);

  for (const row of dailyTrend) {
    rows.push([
      "daily",
      "orders",
      period.from,
      period.to,
      period.timeZone,
      period.topProductsLimit,
      row.totalOrders,
      "",
      row.paidOrders,
      "",
      "",
      "",
      row.paidRevenue,
      "",
      "",
      "",
      "",
      row.day,
      "",
      "",
      "",
      "",
    ]);
  }

  for (const row of dailyBookings || []) {
    rows.push([
      "daily_booking",
      "requests",
      period.from,
      period.to,
      period.timeZone,
      period.topProductsLimit,
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      row.bookingRequests,
      "",
      "",
      row.day,
      "",
      "",
      "",
      "",
    ]);
  }

  for (const row of dailyEngagement || []) {
    rows.push([
      "daily_engagement",
      "events",
      period.from,
      period.to,
      period.timeZone,
      period.topProductsLimit,
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      row.engagementEvents,
      row.day,
      "",
      "",
      "",
      "",
    ]);
  }

  for (const row of topProducts) {
    rows.push([
      "top_product",
      "paid",
      period.from,
      period.to,
      period.timeZone,
      period.topProductsLimit,
      "",
      "",
      "",
      "",
      "",
      "",
      row.paidRevenue,
      "",
      "",
      "",
      "",
      row.productName,
      row.quantitySold,
      "",
      "",
    ]);
  }

  for (const row of engagementByEvent || []) {
    rows.push([
      "event",
      "count",
      period.from,
      period.to,
      period.timeZone,
      period.topProductsLimit,
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      row.eventName,
      row.eventCount,
    ]);
  }

  return `\ufeff${rows.map((row) => row.map(csvEscape).join(",")).join("\n")}\n`;
}

export async function getTrafficReport(req, res, next) {
  try {
    const filters = resolveReportFilters(req);
    if (filters.error) return res.status(400).json({ error: filters.error });
    const report = await loadTrafficReportData(filters);
    return res.json(report);
  } catch (err) {
    return next(err);
  }
}

export async function exportTrafficReportCsv(req, res, next) {
  try {
    const filters = resolveReportFilters(req);
    if (filters.error) return res.status(400).json({ error: filters.error });
    const report = await loadTrafficReportData(filters);

    const fileName = `traffic-report-${report.period.from}_to_${report.period.to}.csv`;
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    return res.status(200).send(buildTrafficCsv(report));
  } catch (err) {
    return next(err);
  }
}
