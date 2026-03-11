# Backend API Reference

Base URL: `http://localhost:4000`

## POST /create-order
Creates customer/order/order_items/payment and returns Payfast hosted checkout payload.

### Request
```json
{
  "currency": "ZAR",
  "customer": {
    "name": "John Doe",
    "phone": "0749428500",
    "email": "john@example.com",
    "address": "Sea Point, Cape Town",
    "notes": "Call on arrival"
  },
  "items": [
    { "product_name": "Cloud Party Combo", "quantity": 1, "price": 3580 }
  ]
}
```

### Response
```json
{
  "orderId": 123,
  "orderNumber": "ORD-123456789",
  "status": "PENDING",
  "payfastUrl": "https://sandbox.payfast.co.za/eng/process",
  "payload": {
    "merchant_id": "...",
    "merchant_key": "...",
    "return_url": "...",
    "cancel_url": "...",
    "notify_url": "...",
    "signature": "..."
  }
}
```

## GET /payment-success
Payfast browser return URL. Redirects user to frontend success state.

## GET /payment-cancel
Payfast cancel URL. Redirects user to frontend cancel state and marks pending order as cancelled.

## POST /payfast-itn
Payfast ITN webhook endpoint.

### Behavior
- Verifies merchant + signature + Payfast validation endpoint
- Enforces duplicate protection
- Verifies paid amount for successful ITNs
- Updates order/payment status
- Sends WhatsApp Business notification when status is `PAID`

## GET /health
Health check endpoint.
