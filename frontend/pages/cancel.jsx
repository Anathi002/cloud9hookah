import React from "react";

export default function CancelPage() {
  const params = new URLSearchParams(window.location.search);
  const orderNumber = params.get("order_number") || params.get("m_payment_id") || "";

  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: 24 }}>
      <h1>Payment Cancelled</h1>
      <p>Your payment was cancelled before completion.</p>
      {orderNumber && <p><strong>Order Number:</strong> {orderNumber}</p>}
      <p>You can return to checkout and try again.</p>
    </main>
  );
}
