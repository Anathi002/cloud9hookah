import { pool } from "../db/pool.js";
import { buildPayfastCheckoutPayload } from "../payments/payfast.js";

function isNonEmpty(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isEnabled(value, fallback = true) {
  if (value === undefined || value === null || value === "") return fallback;
  return String(value).trim().toLowerCase() === "true";
}

function generateOrderNumber() {
  const stamp = Date.now().toString().slice(-8);
  const rand = Math.floor(Math.random() * 900 + 100);
  return `ORD-${stamp}${rand}`;
}

function formatPreferredBookingWindow(customer = {}) {
  const datePart = String(customer.bookingDate || customer.requestedDate || "").trim();
  const timePart = String(customer.bookingTime || customer.requestedTime || "").trim();
  if (!datePart && !timePart) return "";
  if (!datePart) return `Preferred booking time: ${timePart}`;
  if (!timePart) return `Preferred booking date: ${datePart}`;
  return `Preferred booking: ${datePart} ${timePart}`;
}

function normalizeItems(items) {
  if (!Array.isArray(items) || items.length === 0) return [];

  return items
    .map((item) => ({
      product_name: String(item.product_name || item.name || "").trim(),
      quantity: Number(item.quantity || 1),
      price: Number(item.price || 0),
    }))
    .filter((item) => item.product_name && item.quantity > 0 && item.price > 0);
}

async function insertOrderCompat(client, { orderNumber, customerId, totalAmount, notes }) {
  try {
    return await client.query(
      `INSERT INTO orders (order_number, customer_id, total_amount, notes, status)
       VALUES ($1, $2, $3, $4, 'PENDING')
       RETURNING id`,
      [orderNumber, customerId, totalAmount, notes]
    );
  } catch (err) {
    // Backward compatibility for older DBs where `orders.notes` does not exist yet.
    if (err?.code === "42703") {
      return client.query(
        `INSERT INTO orders (order_number, customer_id, total_amount, status)
         VALUES ($1, $2, $3, 'PENDING')
         RETURNING id`,
        [orderNumber, customerId, totalAmount]
      );
    }
    throw err;
  }
}

export async function createOrder(req, res, next) {
  try {
    const checkoutEnabled = isEnabled(process.env.CHECKOUT_ENABLED, true);
    if (!checkoutEnabled) {
      return res.status(503).json({
        error: "Checkout is temporarily unavailable. Please use booking mode.",
        code: "CHECKOUT_DISABLED",
      });
    }

    const { customer, items, currency } = req.body || {};

    if (String(currency || "ZAR").toUpperCase() !== "ZAR") {
      return res.status(400).json({ error: "Currency must be ZAR" });
    }

    if (!customer || !isNonEmpty(customer.name) || !isNonEmpty(customer.phone) || !isNonEmpty(customer.address)) {
      return res.status(400).json({ error: "Customer name, phone, and address are required" });
    }

    const parsedItems = normalizeItems(items);
    if (parsedItems.length === 0) {
      return res.status(400).json({ error: "At least one valid order item is required" });
    }

    const totalAmount = parsedItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const orderNumber = generateOrderNumber();
    const preferredBookingWindow = formatPreferredBookingWindow(customer);
    const notes = [String(customer.notes || "").trim(), preferredBookingWindow].filter(Boolean).join(" | ") || null;

    const client = await pool.connect();
    try {
      // Keep order/customer/payment creation atomic.
      await client.query("BEGIN");

      const customerInsert = await client.query(
        `INSERT INTO customers (name, phone, email, address)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [
          customer.name.trim(),
          customer.phone.trim(),
          (customer.email || "").trim() || null,
          customer.address.trim(),
        ]
      );
      const customerId = customerInsert.rows[0].id;

      const orderInsert = await insertOrderCompat(client, {
        orderNumber,
        customerId,
        totalAmount,
        notes,
      });
      const orderId = orderInsert.rows[0].id;

      for (const item of parsedItems) {
        await client.query(
          `INSERT INTO order_items (order_id, product_name, quantity, price)
           VALUES ($1, $2, $3, $4)`,
          [orderId, item.product_name, item.quantity, item.price]
        );
      }

      await client.query(
        `INSERT INTO payments (order_id, gateway, payment_status)
         VALUES ($1, 'PAYFAST', 'PENDING')`,
        [orderId]
      );

      await client.query("COMMIT");

      const backendBaseUrl = process.env.BACKEND_BASE_URL || "http://localhost:4000";
      const { processUrl, payload } = buildPayfastCheckoutPayload({
        orderNumber,
        amount: totalAmount,
        itemName: `Cloud 9 Order ${orderNumber}`,
        customer,
        returnUrl: `${backendBaseUrl}/payment-success`,
        cancelUrl: `${backendBaseUrl}/payment-cancel`,
        notifyUrl: `${backendBaseUrl}/payfast-itn`,
      });

      return res.status(201).json({
        orderId,
        orderNumber,
        status: "PENDING",
        payfastUrl: processUrl,
        payload,
      });
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    return next(err);
  }
}
