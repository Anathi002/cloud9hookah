# Backend API Reference

Base URL: `http://localhost:4000`

## POST /create-order
Creates customer/order/order_items/payment and returns Payfast hosted checkout payload.
If `CHECKOUT_ENABLED=false`, this returns `503` with code `CHECKOUT_DISABLED`.

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

## POST /book-now
Captures a booking request (pre-launch / no stock mode) without creating an order or payment.

### Request
```json
{
  "customer": {
    "name": "John Doe",
    "phone": "0749428500",
    "email": "john@example.com",
    "address": "Sea Point, Cape Town",
    "suburb": "Sea Point",
    "notes": "Call me after 6pm"
  },
  "items": [
    { "name": "Double Pipe", "quantity": 1, "hours": 4, "totalNow": 1880 }
  ],
  "totalAmount": 1880,
  "source": "ads-prelaunch"
}
```

### Response
```json
{
  "ok": true,
  "bookingId": 12,
  "bookingReference": "BK-00012",
  "createdAt": "2026-03-12T08:00:00.000Z",
  "message": "Booking request captured. Team will contact customer."
}
```

## POST /engagement/event
Stores non-order engagement events (e.g. page views, cart activity, checkout opens).

### Request
```json
{
  "sessionId": "sess_xxx",
  "eventName": "checkout_opened",
  "page": "checkout",
  "meta": { "cartSize": 2, "total": 1880 }
}
```

### Response
```json
{ "ok": true }
```

## GET /reports/traffic
Traffic + commerce report JSON.

## GET /reports/traffic.csv
CSV export version of the report.

## GET /health
Health check endpoint.
