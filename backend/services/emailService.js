import nodemailer from "nodemailer";

function formatCurrency(value) {
  return `R${Number(value || 0).toFixed(2)}`;
}

function formatBookingItems(items = []) {
  return items
    .map((item) => {
      const productName = String(item.product_name || item.productName || item.name || "Item").trim();
      const quantity = Math.max(1, Number(item.quantity || 1));
      const hours = Number(item.hours || 0);
      const amount = Number(item.totalNow ?? item.total_amount ?? item.price ?? 0);
      const hoursLabel = Number.isFinite(hours) && hours > 0 ? ` (${hours}h)` : "";
      return `- ${productName} x${quantity}${hoursLabel} (${formatCurrency(amount)})`;
    })
    .join("\n");
}

function getBusinessEmailRecipients() {
  const configured = process.env.BUSINESS_NOTIFICATION_EMAIL || "cloud.hubbly@gmail.com";
  return String(configured)
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

let cachedTransporter = null;

function getTransporter() {
  if (cachedTransporter) return cachedTransporter;

  const host = String(process.env.SMTP_HOST || "").trim();
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = String(process.env.SMTP_SECURE || "false").toLowerCase() === "true";
  const user = String(process.env.SMTP_USER || "").trim();
  const pass = String(process.env.SMTP_PASS || "").trim();
  const connectionTimeout = Number(process.env.SMTP_CONNECTION_TIMEOUT_MS || 10000);
  const greetingTimeout = Number(process.env.SMTP_GREETING_TIMEOUT_MS || 10000);
  const socketTimeout = Number(process.env.SMTP_SOCKET_TIMEOUT_MS || 15000);

  if (!host || !user || !pass) {
    throw new Error("Missing SMTP env vars (SMTP_HOST/SMTP_USER/SMTP_PASS)");
  }

  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure,
    connectionTimeout,
    greetingTimeout,
    socketTimeout,
    auth: { user, pass },
  });

  return cachedTransporter;
}

export function formatEmailOrderMessage(order) {
  const orderNumber = order.order_number || `ORD-${String(order.id || "").padStart(4, "0")}`;
  const itemLines = (order.items || [])
    .map((item) => `- ${item.product_name} x${item.quantity} (${formatCurrency(item.price)})`)
    .join("\n");

  return [
    "New Paid Order",
    "",
    `Order Number: ${orderNumber}`,
    `Customer Name: ${order.customer_name}`,
    `Phone: ${order.customer_phone}`,
    order.customer_email ? `Email: ${order.customer_email}` : null,
    `Address: ${order.customer_address}`,
    order.notes ? `Notes: ${order.notes}` : null,
    "",
    "Items:",
    itemLines,
    "",
    `Total: ${formatCurrency(order.total_amount)}`,
    "Payment Status: PAID",
    `Payfast Reference: ${order.payfast_reference}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export function formatEmailBookingMessage(booking) {
  const bookingReference =
    booking.bookingReference ||
    (booking.id ? `BK-${String(booking.id).padStart(5, "0")}` : "BK-UNKNOWN");
  const datePart = String(booking.requestedDate || booking.requested_date || "").trim();
  const timePart = String(booking.requestedTime || booking.requested_time || "").trim();
  const preferredBooking =
    datePart && timePart
      ? `${datePart} ${timePart}`
      : datePart || timePart || null;

  return [
    "New Booking Request",
    "",
    `Reference: ${bookingReference}`,
    preferredBooking ? `Preferred Booking: ${preferredBooking}` : null,
    `Customer Name: ${booking.full_name}`,
    `Phone: ${booking.phone}`,
    booking.email ? `Email: ${booking.email}` : null,
    `Address: ${booking.address}`,
    booking.suburb ? `Suburb: ${booking.suburb}` : null,
    booking.notes ? `Notes: ${booking.notes}` : null,
    "",
    "Items:",
    formatBookingItems(booking.items || []),
    "",
    `Total Requested: ${formatCurrency(booking.total_amount)}`,
    booking.source ? `Source: ${booking.source}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

export async function sendBusinessEmail({ subject, text }) {
  const recipients = getBusinessEmailRecipients();
  if (recipients.length === 0) {
    throw new Error("Missing BUSINESS_NOTIFICATION_EMAIL recipient");
  }

  const transporter = getTransporter();
  const fromAddress = String(process.env.EMAIL_FROM || process.env.SMTP_USER || "").trim();
  if (!fromAddress) {
    throw new Error("Missing EMAIL_FROM (or SMTP_USER)");
  }

  return transporter.sendMail({
    from: fromAddress,
    to: recipients.join(", "),
    subject: String(subject || "Cloud 9 Notification").trim(),
    text: String(text || "").trim(),
  });
}

