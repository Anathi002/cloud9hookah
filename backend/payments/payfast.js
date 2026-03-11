import crypto from "crypto";

function encodeValue(value) {
  return encodeURIComponent(String(value ?? "").trim()).replace(/%20/g, "+");
}

function parameterString(data, includeSignature = false) {
  const sortedKeys = Object.keys(data)
    .filter((key) => (includeSignature ? true : key !== "signature"))
    .filter((key) => data[key] !== undefined && data[key] !== null && data[key] !== "")
    .sort();

  return sortedKeys.map((key) => `${key}=${encodeValue(data[key])}`).join("&");
}

export function createPayfastSignature(payload, passphrase) {
  const base = parameterString(payload, false);
  const toHash = passphrase ? `${base}&passphrase=${encodeValue(passphrase)}` : base;
  return crypto.createHash("md5").update(toHash).digest("hex");
}

export function buildPayfastCheckoutPayload({
  orderNumber,
  amount,
  itemName,
  customer,
  returnUrl,
  cancelUrl,
  notifyUrl,
}) {
  const merchantId = process.env.PAYFAST_MERCHANT_ID;
  const merchantKey = process.env.PAYFAST_MERCHANT_KEY;
  const passphrase = process.env.PAYFAST_PASSPHRASE || "";

  if (!merchantId || !merchantKey) {
    throw new Error("Missing PAYFAST_MERCHANT_ID or PAYFAST_MERCHANT_KEY");
  }

  const payload = {
    merchant_id: merchantId,
    merchant_key: merchantKey,
    return_url: returnUrl,
    cancel_url: cancelUrl,
    notify_url: notifyUrl,
    m_payment_id: orderNumber,
    amount: Number(amount).toFixed(2),
    item_name: itemName,
    name_first: customer?.name || "Customer",
    email_address: customer?.email || "",
    custom_str1: customer?.phone || "",
    custom_str2: customer?.address || "",
  };

  payload.signature = createPayfastSignature(payload, passphrase);

  const processUrl =
    process.env.PAYFAST_PROCESS_URL ||
    (String(process.env.PAYFAST_SANDBOX || "true").toLowerCase() === "true"
      ? "https://sandbox.payfast.co.za/eng/process"
      : "https://www.payfast.co.za/eng/process");

  return { processUrl, payload };
}

export function parsePayfastAmount(pfData) {
  const raw = pfData.amount_gross ?? pfData.amount_fee ?? pfData.amount;
  return Number(raw || 0);
}

export function validateMerchant(pfData) {
  const expectedMerchantId = process.env.PAYFAST_MERCHANT_ID;
  if (!expectedMerchantId) return true;
  return String(pfData.merchant_id || "") === String(expectedMerchantId);
}
