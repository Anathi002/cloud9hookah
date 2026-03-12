# Database Schema

## customers
- `id` BIGSERIAL PRIMARY KEY
- `name` TEXT NOT NULL
- `phone` TEXT NOT NULL
- `email` TEXT NULL
- `address` TEXT NOT NULL
- `created_at` TIMESTAMPTZ DEFAULT NOW()

## orders
- `id` BIGSERIAL PRIMARY KEY
- `order_number` TEXT NOT NULL UNIQUE
- `customer_id` BIGINT NOT NULL FK -> customers(id)
- `total_amount` NUMERIC(12,2) NOT NULL
- `notes` TEXT NULL
- `status` TEXT NOT NULL CHECK IN (`PENDING`, `PAID`, `FAILED`, `CANCELLED`)
- `payfast_reference` TEXT NULL
- `created_at` TIMESTAMPTZ DEFAULT NOW()

## order_items
- `id` BIGSERIAL PRIMARY KEY
- `order_id` BIGINT NOT NULL FK -> orders(id)
- `product_name` TEXT NOT NULL
- `quantity` INTEGER NOT NULL CHECK > 0
- `price` NUMERIC(12,2) NOT NULL CHECK > 0

## payments
- `id` BIGSERIAL PRIMARY KEY
- `order_id` BIGINT NOT NULL FK -> orders(id)
- `gateway` TEXT NOT NULL
- `transaction_reference` TEXT NULL
- `payment_status` TEXT NOT NULL CHECK IN (`PENDING`, `PAID`, `FAILED`, `CANCELLED`)
- `paid_at` TIMESTAMPTZ NULL
- `created_at` TIMESTAMPTZ DEFAULT NOW()

## booking_requests
- `id` BIGSERIAL PRIMARY KEY
- `full_name` TEXT NOT NULL
- `phone` TEXT NOT NULL
- `email` TEXT NULL
- `address` TEXT NOT NULL
- `suburb` TEXT NULL
- `notes` TEXT NULL
- `cart_snapshot` JSONB NOT NULL
- `total_amount` NUMERIC(12,2) NOT NULL
- `source` TEXT NULL
- `status` TEXT NOT NULL CHECK IN (`NEW`, `CONTACTED`, `CLOSED`)
- `created_at` TIMESTAMPTZ DEFAULT NOW()

## engagement_events
- `id` BIGSERIAL PRIMARY KEY
- `session_id` TEXT NULL
- `event_name` TEXT NOT NULL
- `page` TEXT NULL
- `referrer` TEXT NULL
- `user_agent` TEXT NULL
- `ip_address` TEXT NULL
- `meta` JSONB NOT NULL
- `created_at` TIMESTAMPTZ DEFAULT NOW()

## Migration file
- [001_init.sql](/c:/Users/AnathiDayise/OneDrive%20-%20Inspired%20Testing%20(Pty)%20Ltd/Desktop/cloud%209%20hookah/database/migrations/001_init.sql)
- [002_engagement_prelaunch.sql](/c:/Users/AnathiDayise/OneDrive%20-%20Inspired%20Testing%20(Pty)%20Ltd/Desktop/cloud%209%20hookah/database/migrations/002_engagement_prelaunch.sql)
