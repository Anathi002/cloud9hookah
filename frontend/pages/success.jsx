import React from "react";

export default function SuccessPage() {
  const params = new URLSearchParams(window.location.search);
  const orderNumber = params.get("order_number") || params.get("m_payment_id") || "";

  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: 24 }}>
      <h1>Payment Successful</h1>
      <p>Thank you. Your order was paid successfully.</p>
      {orderNumber && <p><strong>Order Number:</strong> {orderNumber}</p>}
      <p>Your delivery confirmation will follow shortly.</p>
    </main>
  );
}
