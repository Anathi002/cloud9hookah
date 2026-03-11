import { pool } from "../db/pool.js";

function buildFrontendRedirect(pathOrQuery) {
  const base = process.env.FRONTEND_BASE_URL || "http://localhost:5173";
  const sep = pathOrQuery.startsWith("?") ? "" : "/";
  return `${base}${sep}${pathOrQuery}`;
}

export function paymentSuccess(req, res) {
  const orderNumber = req.query.m_payment_id || "";
  const redirectUrl = buildFrontendRedirect(`?payment=success&order_number=${encodeURIComponent(orderNumber)}`);
  return res.redirect(302, redirectUrl);
}

export async function paymentCancel(req, res, next) {
  const orderNumber = req.query.m_payment_id || "";
  if (orderNumber) {
    try {
      await pool.query(
        `UPDATE orders
         SET status = 'CANCELLED'
         WHERE order_number = $1
           AND status = 'PENDING'`,
        [orderNumber]
      );
      await pool.query(
        `UPDATE payments
         SET payment_status = 'CANCELLED'
         WHERE order_id = (SELECT id FROM orders WHERE order_number = $1)
           AND payment_status = 'PENDING'`,
        [orderNumber]
      );
    } catch (err) {
      return next(err);
    }
  }
  const redirectUrl = buildFrontendRedirect(`?payment=cancel&order_number=${encodeURIComponent(orderNumber)}`);
  return res.redirect(302, redirectUrl);
}
