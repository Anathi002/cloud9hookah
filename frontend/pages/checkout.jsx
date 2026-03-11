import React, { useMemo, useState } from "react";
import PayfastRedirectForm from "../components/PayfastRedirectForm.jsx";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

// Example checkout page for a React/Next-style app.
export default function CheckoutPage() {
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  });
  const [items, setItems] = useState([
    { product_name: "Single Pipe", quantity: 1, price: 1100.0 },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [payfastData, setPayfastData] = useState(null);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0),
    [items]
  );

  function updateField(field, value) {
    setCustomer((prev) => ({ ...prev, [field]: value }));
  }

  async function handlePayNow(e) {
    e.preventDefault();
    setError("");

    if (!customer.name.trim() || !customer.phone.trim() || !customer.address.trim()) {
      setError("Name, phone and delivery address are required.");
      return;
    }

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL.replace(/\/+$/, "")}/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer,
          items,
          currency: "ZAR",
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || "Failed to create order.");
      }

      setPayfastData({
        action: data.payfastUrl,
        payload: data.payload,
        orderNumber: data.orderNumber,
      });
    } catch (err) {
      setError(err.message || "Could not start payment.");
      setLoading(false);
    }
  }

  if (payfastData) {
    return (
      <main style={{ maxWidth: 760, margin: "0 auto", padding: 24 }}>
        <h1>Redirecting to Payfast</h1>
        <p>Order {payfastData.orderNumber} is ready. You will be redirected automatically.</p>
        <PayfastRedirectForm
          action={payfastData.action}
          payload={payfastData.payload}
          autoSubmit
        />
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: 24 }}>
      <h1>Checkout</h1>
      <p>Total: <strong>R{total.toFixed(2)}</strong></p>

      <form onSubmit={handlePayNow}>
        <label>
          Full name
          <input value={customer.name} onChange={(e) => updateField("name", e.target.value)} />
        </label>
        <label>
          Phone
          <input value={customer.phone} onChange={(e) => updateField("phone", e.target.value)} />
        </label>
        <label>
          Email
          <input value={customer.email} onChange={(e) => updateField("email", e.target.value)} />
        </label>
        <label>
          Delivery address
          <input value={customer.address} onChange={(e) => updateField("address", e.target.value)} />
        </label>
        <label>
          Notes (optional)
          <textarea value={customer.notes} onChange={(e) => updateField("notes", e.target.value)} />
        </label>

        {error && <p style={{ color: "crimson" }}>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Preparing payment..." : "Pay Now"}
        </button>
      </form>

      <p style={{ fontSize: 12, color: "#555" }}>
        Card details are entered only on Payfast hosted checkout.
      </p>
    </main>
  );
}
