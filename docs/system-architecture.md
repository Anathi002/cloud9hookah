# Cloud 9 Payment Architecture

```mermaid
flowchart TD
  A[Customer on Frontend] --> B[Cart + Checkout Form]
  B --> C[POST /create-order]
  C --> D[(PostgreSQL)]
  C --> E[Return Payfast signed payload]
  E --> F[Hosted Payfast Checkout]
  F -->|Success Redirect| G[GET /payment-success]
  F -->|Cancel Redirect| H[GET /payment-cancel]
  F -->|Server-to-server ITN| I[POST /payfast-itn]
  I --> J[Verify signature + merchant + amount + Payfast validation endpoint]
  J -->|Valid + COMPLETE| K[Update order/payment to PAID]
  K --> L[Send WhatsApp Cloud API notification]
  J -->|Invalid| M[Reject ITN]
  J -->|CANCELLED/FAILED| N[Update status accordingly]
  G --> O[Frontend success state]
  H --> P[Frontend cancel state]
```

## Security Boundary
- Cardholder data is never captured in the frontend app or backend server.
- Customers enter card details only on the Payfast hosted checkout page.
- Backend stores payment references/status only.
