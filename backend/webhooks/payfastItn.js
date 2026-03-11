import axios from "axios";

import { createPayfastSignature, validateMerchant } from "../payments/payfast.js";

function getValidationUrl() {
  const sandbox = String(process.env.PAYFAST_SANDBOX || "true").toLowerCase() === "true";
  return sandbox
    ? "https://sandbox.payfast.co.za/eng/query/validate"
    : "https://www.payfast.co.za/eng/query/validate";
}

function buildValidationString(pfData) {
  const sortedKeys = Object.keys(pfData)
    .filter((key) => key !== "signature")
    .filter((key) => pfData[key] !== undefined && pfData[key] !== null && pfData[key] !== "")
    .sort();

  return sortedKeys
    .map((key) => `${key}=${encodeURIComponent(String(pfData[key]).trim()).replace(/%20/g, "+")}`)
    .join("&");
}

export async function verifyPayfastItn(pfData) {
  const passphrase = process.env.PAYFAST_PASSPHRASE || "";

  // Step 1: ensure ITN belongs to this merchant.
  if (!validateMerchant(pfData)) {
    return { isValid: false, reason: "Merchant mismatch" };
  }

  // Step 2: verify local signature hash.
  const localSignature = createPayfastSignature(pfData, passphrase);
  if (String(localSignature) !== String(pfData.signature || "")) {
    return { isValid: false, reason: "Invalid signature" };
  }

  // Step 3: verify payload with Payfast validation endpoint.
  const validationBody = buildValidationString(pfData);
  const validationUrl = getValidationUrl();

  const response = await axios.post(validationUrl, validationBody, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    timeout: 15000,
  });

  if (String(response.data || "").trim() !== "VALID") {
    return { isValid: false, reason: "Payfast validation failed" };
  }

  return { isValid: true };
}
