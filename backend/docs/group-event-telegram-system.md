# Group Event (Hameneshini) + Telegram Integration

## 1) Event DB schema

```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  event_type VARCHAR(50),
  city VARCHAR(100),
  is_active BOOLEAN NOT NULL DEFAULT true,
  capacity INT NOT NULL DEFAULT 20 CHECK (capacity > 0),
  reserved_count INT NOT NULL DEFAULT 0 CHECK (reserved_count >= 0),
  price INT NOT NULL DEFAULT 0 CHECK (price >= 0),
  start_date TIMESTAMP NOT NULL
);
```

## 2) Reservation schema

```sql
CREATE TABLE event_reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  seats INT NOT NULL DEFAULT 1 CHECK (seats > 0),
  payment_status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending | paid | failed
  payment_reference VARCHAR(120),
  paid_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_event_reservations_event_user UNIQUE (event_id, user_id)
);
```

## 3) TelegramGroup schema

```sql
CREATE TABLE telegram_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL UNIQUE REFERENCES events(id) ON DELETE CASCADE,
  group_id VARCHAR(64) NOT NULL,
  invite_link VARCHAR(500) NOT NULL
);
```

- `groupId` => Telegram Chat ID
- `inviteLink` => Join URL that user receives **only after successful booking + payment**

## 4) APIs

### GET `/events`
Returns active upcoming events with capacity/pricing information.

### POST `/events/reserve`
- **Auth required** (`Bearer token`)
- Request body:

```json
{
  "eventId": "uuid",
  "seats": 1,
  "paymentReference": "TRX-123456"
}
```

- Reservation rules:
  - Payment required for paid events (`price > 0` needs `paymentReference`)
  - Overbooking prevention via DB transaction + row lock (`pessimistic_write` on event row)
  - One booking per user per event (`UNIQUE(event_id, user_id)`)
  - Telegram group must exist for event

## 5) Booking success response (includes Telegram link)

```json
{
  "reservation": {
    "id": "uuid",
    "eventId": "uuid",
    "userId": "uuid",
    "seats": 1,
    "paymentStatus": "paid",
    "paymentReference": "TRX-123456",
    "paidAt": "2026-02-12T10:00:00.000Z",
    "createdAt": "2026-02-12T10:00:00.000Z"
  },
  "event": {
    "id": "uuid",
    "title": "Hamneshini #12"
  },
  "remaining": 18,
  "telegramInviteLink": "https://t.me/+abc123"
}
```

## 6) Frontend example (button redirect)

```tsx
const reservation = await reserveEvent(eventId, 1, paymentReference);

router.push(
  `/payment-success?telegramLink=${encodeURIComponent(reservation.telegramInviteLink)}`,
);
```

```tsx
<a href={telegramLink} target="_blank" rel="noopener noreferrer">
  ورود به گروه تلگرام
</a>
```

> Website does not host chat. It only redirects to Telegram group after successful reservation/payment.
