import { pool } from "../db/pool.js";
import { formatEmailOrderMessage, sendBusinessEmail } from "../services/emailService.js";
import { parsePayfastAmount } from "../payments/payfast.js";
import { verifyPayfastItn } from "../webhooks/payfastItn.js";

async function getOrderForNotification(orderId) {
  let orderResult;
  try {
    orderResult = await pool.query(
      `SELECT
        o.id,
        o.order_number,
        o.total_amount,
        o.notes,
        o.status,
        o.payfast_reference,
        c.name AS customer_name,
        c.phone AS customer_phone,
        c.email AS customer_email,
        c.address AS customer_address
       FROM orders o
       JOIN customers c ON c.id = o.customer_id
       WHERE o.id = $1`,
      [orderId]
    );
  } catch (err) {
    if (err?.code !== "42703") throw err;
    // Backward compatibility for older DBs where `orders.notes` does not exist yet.
    orderResult = await pool.query(
      `SELECT
        o.id,
        o.order_number,
        o.total_amount,
        NULL::text AS notes,
        o.status,
        o.payfast_reference,
        c.name AS customer_name,
        c.phone AS customer_phone,
        c.email AS customer_email,
        c.address AS customer_address
       FROM orders o
       JOIN customers c ON c.id = o.customer_id
       WHERE o.id = $1`,
      [orderId]
    );
  }

  if (orderResult.rowCount === 0) return null;

  const itemResult = await pool.query(
    `SELECT product_name, quantity, price
     FROM order_items
     WHERE order_id = $1
     ORDER BY id ASC`,
    [orderId]
  );

  return {
    ...orderResult.rows[0],
    items: itemResult.rows,
  };
}

export async function handlePayfastItn(req, res, next) {
  try {
    const pfData = req.body || {};
    const orderNumber = String(pfData.m_payment_id || "").trim();

    if (!orderNumber) {
      return res.status(400).send("Missing order reference");
    }

    const verification = await verifyPayfastItn(pfData);
    if (!verification.isValid) {
      return res.status(400).send(`Invalid ITN: ${verification.reason}`);
    }

    const paymentStatus = String(pfData.payment_status || "").toUpperCase();
    const normalizedStatus =
      paymentStatus === "COMPLETE"
        ? "PAID"
        : paymentStatus === "CANCELLED"
          ? "CANCELLED"
          : paymentStatus === "FAILED"
            ? "FAILED"
            : "PENDING";

    const txRef = String(pfData.pf_payment_id || "").trim();
    if (normalizedStatus === "PAID" && !txRef) {
      return res.status(400).send("Missing Payfast transaction reference");
    }

    const client = await pool.connect();
    let paidOrderId = null;

    try {
      await client.query("BEGIN");

      const orderResult = await client.query(
        `SELECT id, total_amount, status
         FROM orders
         WHERE order_number = $1
         FOR UPDATE`,
        [orderNumber]
      );

      if (orderResult.rowCount === 0) {
        await client.query("ROLLBACK");
        return res.status(404).send("Order not found");
      }

      const order = orderResult.rows[0];
      paidOrderId = order.id;

      if (order.status === "PAID" && normalizedStatus === "PAID") {
        await client.query("COMMIT");
        return res.status(200).send("Already processed");
      }

      if (normalizedStatus === "PAID") {
        // Duplicate protection: do not process the same paid transaction twice.
        const duplicatePayment = await client.query(
          `SELECT id
           FROM payments
           WHERE transaction_reference = $1
           AND payment_status = 'PAID'
           LIMIT 1`,
          [txRef]
        );

        if (duplicatePayment.rowCount > 0) {
          await client.query("COMMIT");
          return res.status(200).send("Duplicate ignored");
        }

        const amountPaid = parsePayfastAmount(pfData);
        const expected = Number(order.total_amount);
        if (!Number.isFinite(amountPaid) || Math.abs(amountPaid - expected) > 0.01) {
          await client.query("ROLLBACK");
          return res.status(400).send("Amount mismatch");
        }

        await client.query(
          `UPDATE orders
           SET status = 'PAID', payfast_reference = $1
           WHERE id = $2`,
          [txRef, order.id]
        );

        await client.query(
          `UPDATE payments
           SET transaction_reference = $1,
               payment_status = 'PAID',
               paid_at = NOW()
           WHERE order_id = $2`,
          [txRef, order.id]
        );
      } else {
        await client.query(
          `UPDATE orders
           SET status = $1
           WHERE id = $2
             AND status = 'PENDING'`,
          [normalizedStatus, order.id]
        );

        await client.query(
          `UPDATE payments
           SET payment_status = $1
           WHERE order_id = $2
             AND payment_status = 'PENDING'`,
          [normalizedStatus, order.id]
        );
      }

      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }

    const orderForNotification = normalizedStatus === "PAID" ? await getOrderForNotification(paidOrderId) : null;
    if (orderForNotification) {
      void sendBusinessEmail({
        subject: `Cloud 9 Paid Order ${orderForNotification.order_number || ""}`.trim(),
        text: formatEmailOrderMessage(orderForNotification),
      })
        .then(() => {
          console.log("Order email notification sent:", orderForNotification.order_number);
        })
        .catch((reason) => {
          console.error("Order email notification failed:", {
            message: reason?.message || String(reason),
            code: reason?.code || null,
            command: reason?.command || null,
            responseCode: reason?.responseCode || null,
          });
        });
    }

    return res.status(200).send("OK");
  } catch (err) {
    return next(err);
  }
}
