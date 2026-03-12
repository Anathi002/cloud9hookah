import axios from "axios";

function randOrderCode(orderId) {
  return `ORD-${String(orderId).padStart(4, "0")}`;
}

export function formatWhatsAppOrderMessage(order) {
  const orderNumber = order.order_number || randOrderCode(order.id);
  const itemLines = (order.items || [])
    .map((item) => `- ${item.product_name} x${item.quantity} (R${Number(item.price).toFixed(2)})`)
    .join("\n");
  const noteLine = order.notes ? `Notes: ${order.notes}` : null;

  return [
    "New Paid Order",
    "",
    `Order Number: ${orderNumber}`,
    `Customer Name: ${order.customer_name}`,
    `Phone: ${order.customer_phone}`,
    `Address: ${order.customer_address}`,
    noteLine,
    "",
    "Items:",
    itemLines,
    "",
    `Total: R${Number(order.total_amount).toFixed(2)}`,
    "",
    "Payment Status: PAID",
    `Payfast Reference: ${order.payfast_reference}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export async function sendWhatsAppOrderNotification(order) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const notifyNumber = process.env.BUSINESS_NOTIFICATION_NUMBER;
  const rawApiVersion = String(process.env.WHATSAPP_GRAPH_API_VERSION || "v21.0").trim();
  const graphApiVersion = rawApiVersion.startsWith("v") ? rawApiVersion : `v${rawApiVersion}`;

  if (!token || !phoneNumberId || !notifyNumber) {
    throw new Error("Missing WhatsApp env vars (token/phone_number_id/business_number)");
  }

  const url = `https://graph.facebook.com/${graphApiVersion}/${phoneNumberId}/messages`;
  const bodyText = formatWhatsAppOrderMessage(order);

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
