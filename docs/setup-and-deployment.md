# Setup And Deployment Guide

## 1. Prerequisites
- Node.js 20+
- PostgreSQL 14+
- Payfast merchant account (sandbox and/or live)
- WhatsApp Business Cloud API app/token

## 2. Environment Variables
1. Copy `.env.example` to `.env` in project root.
2. Copy `backend/.env.example` to `backend/.env` (or reuse root env in deployment).
3. Fill:
- `PAYFAST_MERCHANT_ID`
- `PAYFAST_MERCHANT_KEY`
- `PAYFAST_PASSPHRASE`
- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`
- `BUSINESS_NOTIFICATION_NUMBER`
- `DATABASE_URL`
- `CHECKOUT_ENABLED` (`false` for pre-launch engagement mode, `true` for full checkout)

## 3. Backend Local Run
```bash
cd backend
npm install
npm run migrate
npm run dev
```
Health check: `GET http://localhost:4000/health`

## 4. Frontend Local Run
```bash
# from project root
npm install
npm run dev
```
Set `VITE_API_BASE_URL=http://localhost:4000`.
Set `VITE_CHECKOUT_ENABLED=false` for pre-launch mode (booking only).

## 5. Payfast Callback URLs
Configure in Payfast merchant dashboard:
- Return URL: `https://<backend-domain>/payment-success`
- Cancel URL: `https://<backend-domain>/payment-cancel`
- Notify URL: `https://<backend-domain>/payfast-itn`

## 6. Deploy Frontend (Vercel)
- Import repo in Vercel.
- Build command: `npm run build`
- Output directory: `dist`
- Set env var: `VITE_API_BASE_URL=https://<backend-domain>`

## 7. Deploy Backend (Render/Railway)
- Root dir: `backend`
- Start command: `npm start`
- Add env vars from `backend/.env.example`
- Ensure public HTTPS URL is available for Payfast ITN

## 8. Production Switch
Pre-launch engagement mode:
- `CHECKOUT_ENABLED=false` (backend)
- `VITE_CHECKOUT_ENABLED=false` (frontend)
- Run migrations so booking/engagement tables exist

Full checkout launch mode:
- Set `CHECKOUT_ENABLED=true`
- Set `VITE_CHECKOUT_ENABLED=true`
- Set `PAYFAST_SANDBOX=false`
- Use live merchant credentials
- Ensure `PAYFAST_PROCESS_URL` points to live process URL (or leave unset for default)
- Verify webhook endpoint is reachable publicly over HTTPS
