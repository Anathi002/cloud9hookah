import axios from "axios";

function randOrderCode(orderId) {
  return `ORD-${String(orderId).padStart(4, "0")}`;
}

function formatCurrency(value) {
  return `R${Number(value || 0).toFixed(2)}`;
}

function normalizePhoneNumber(rawValue) {
  const digits = String(rawValue || "").replace(/\D/g, "");
  if (!digits) return "";

  if (digits.startsWith("27")) return digits;
  if (digits.startsWith("0") && digits.length === 10) return `27${digits.slice(1)}`;
  return digits;
}

function resolveNotifyNumber() {
  const configured =
    process.env.BUSINESS_NOTIFICATION_NUMBER ||
    process.env.WHATSAPP_NOTIFY_TO ||
    "0749428500";

  return normalizePhoneNumber(configured);
}

function formatRequestedWindow(booking) {
  const datePart = String(booking.requestedDate || booking.requested_date || "").trim();
  const timePart = String(booking.requestedTime || booking.requested_time || "").trim();
  if (!datePart && !timePart) return null;
  if (!datePart) return `Preferred Time: ${timePart}`;
  if (!timePart) return `Preferred Date: ${datePart}`;
  return `Preferred Booking: ${datePart} ${timePart}`;
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

export function formatWhatsAppOrderMessage(order) {
  const orderNumber = order.order_number || randOrderCode(order.id);
  const itemLines = (order.items || [])
    .map((item) => `- ${item.product_name} x${item.quantity} (${formatCurrency(item.price)})`)
    .join("\n");
  const noteLine = order.notes ? `Notes: ${order.notes}` : null;
  const emailLine = order.customer_email ? `Email: ${order.customer_email}` : null;

  return [
    "New Paid Order",
    "",
    `Order Number: ${orderNumber}`,
    `Customer Name: ${order.customer_name}`,
    `Phone: ${order.customer_phone}`,
    emailLine,
    `Address: ${order.customer_address}`,
    noteLine,
    "",
    "Items:",
    itemLines,
    "",
    `Total: ${formatCurrency(order.total_amount)}`,
    "",
    "Payment Status: PAID",
    `Payfast Reference: ${order.payfast_reference}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export function formatWhatsAppBookingMessage(booking) {
  const bookingReference =
    booking.bookingReference ||
    (booking.id ? `BK-${String(booking.id).padStart(5, "0")}` : "BK-UNKNOWN");
  const requestedWindow = formatRequestedWindow(booking);
  const suburbLine = booking.suburb ? `Suburb: ${booking.suburb}` : null;
  const notesLine = booking.notes ? `Notes: ${booking.notes}` : null;
  const emailLine = booking.email ? `Email: ${booking.email}` : null;

  return [
    "New Booking Request",
    "",
    `Reference: ${bookingReference}`,
    requestedWindow,
    `Customer Name: ${booking.full_name}`,
    `Phone: ${booking.phone}`,
    emailLine,
    `Address: ${booking.address}`,
    suburbLine,
    notesLine,
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

async function sendWhatsAppText(bodyText) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const notifyNumber = resolveNotifyNumber();
  const rawApiVersion = String(process.env.WHATSAPP_GRAPH_API_VERSION || "v21.0").trim();
  const graphApiVersion = rawApiVersion.startsWith("v") ? rawApiVersion : `v${rawApiVersion}`;

  if (!token || !phoneNumberId) {
    throw new Error("Missing WhatsApp env vars (token/phone_number_id)");
  }

  if (!notifyNumber) {
    throw new Error("Missing BUSINESS_NOTIFICATION_NUMBER / WHATSAPP_NOTIFY_TO");
  }

  const url = `https://graph.facebook.com/${graphApiVersion}/${phoneNumberId}/messages`;

  const response = await axios.post(
    url,
    {
      messaging_product: "whatsapp",
      to: notifyNumber,
      type: "text",
      text: { body: bodyText },
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      timeout: 15000,
    }
  );

  return response.data;
}

export async function sendWhatsAppOrderNotification(order) {
  const bodyText = formatWhatsAppOrderMessage(order);
  return sendWhatsAppText(bodyText);
}

export async function sendWhatsAppBookingNotification(booking) {
  const bodyText = formatWhatsAppBookingMessage(booking);
  return sendWhatsAppText(bodyText);
}
