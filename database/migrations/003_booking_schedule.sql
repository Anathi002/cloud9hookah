ALTER TABLE booking_requests
  ADD COLUMN IF NOT EXISTS requested_date DATE,
  ADD COLUMN IF NOT EXISTS requested_time TIME;

CREATE INDEX IF NOT EXISTS idx_booking_requests_requested_date
  ON booking_requests(requested_date);

