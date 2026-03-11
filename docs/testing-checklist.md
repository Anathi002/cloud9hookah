# Testing Checklist

## Checkout + Payment
- [ ] Customer can add products and reach checkout.
- [ ] Required fields (name, phone, address) are validated.
- [ ] `POST /create-order` creates `PENDING` order + items + payment.
- [ ] Redirect lands on Payfast hosted page.
- [ ] No card fields are shown/processed by your app/backend.

## Success Flow
- [ ] Payfast redirects to `/payment-success`.
- [ ] ITN posts to `/payfast-itn`.
- [ ] ITN signature and merchant checks pass.
- [ ] Order status updates to `PAID`.
- [ ] Payment record stores transaction reference and `paid_at`.
- [ ] WhatsApp business number receives the formatted message.

## Cancel / Fail Flow
- [ ] Cancel redirect shows cancelled state.
- [ ] ITN `CANCELLED` updates order/payment status.
- [ ] ITN `FAILED` updates order/payment status.

## Duplicate Protection
- [ ] Re-sending same successful ITN does not duplicate processing.
- [ ] Same transaction reference is ignored as duplicate.

## Amount + Currency
- [ ] Only ZAR orders accepted.
- [ ] ITN amount mismatch is rejected.

## Delivery Data Capture
- [ ] Name/phone/email/address/notes persist to database.

## Manual API Smoke Tests
- [ ] `GET /health` returns `{ ok: true }`.
- [ ] `POST /create-order` invalid payload returns 400.
- [ ] `POST /payfast-itn` invalid signature returns 400.
