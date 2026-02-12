# Ravi Telegram Group Bot (Production-Grade Blueprint)

This bot is designed as **Ravi's Telegram social layer** and follows the hard constraints:

- Works in **groups only**
- Never reads private chats
- Read-only message analysis (no replies, no edits)
- Anonymized sender identity via salted hash
- Group-centric backend sync

---

## 1) Folder structure

```txt
telegram-bot/
├── .env.example
├── requirements.txt
└── app/
    ├── main.py
    ├── config.py
    ├── handlers/
    │   └── group_events.py
    ├── models/
    │   └── payloads.py
    ├── security/
    │   ├── anonymizer.py
    │   └── signature.py
    └── services/
        ├── backend_client.py
        └── invite_link_service.py
```

---

## 2) Webhook setup (Telegram → Bot)

1. Put your environment values in `.env` (copy from `.env.example`).
2. Start bot service (for example behind Nginx TLS).
3. `on_startup` in `main.py` calls `set_webhook` with:
   - `url`: `${WEBHOOK_BASE_URL}${WEBHOOK_PATH}`
   - `secret_token`: validates request source
   - `allowed_updates`: `message`, `my_chat_member`
4. Telegram sends updates only to webhook endpoint.

Run locally:

```bash
cd telegram-bot
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m app.main
```

---

## 3) Group join handler

`my_chat_member` event is handled by `handle_bot_added_to_group`:

- accepts only `group` / `supergroup`
- deduplicates repeated join updates in Redis
- sends `/telegram/group/register` payload to backend

It captures:

- `telegramGroupId`
- `title`
- `memberCount` (nullable in webhook-only mode)
- registration timestamp

---

## 4) Message listener (read-only)

`handle_group_message` does:

- filters only group messages
- optionally skips forwarded messages
- deduplicates messages by `(chat_id, message_id)` via Redis
- computes:
  - `id`
  - `telegramGroupId`
  - `senderHash` (SHA-256 with bot salt)
  - `messageLength`
  - `messageType`
  - `createdAt`
- posts to `/telegram/message/sync`

No direct user profile is stored. No private chat handling exists.

---

## 5) Invite link creation

Use `InviteLinkService.create_invite(telegram_group_id, user_id)` from your internal admin flow:

- creates single-use invite (`member_limit=1`)
- adds expiry (`INVITE_LINK_EXPIRE_MINUTES`)
- reports metadata to `/telegram/invite/create`

When member enters group and invite is known, call:

- `InviteLinkService.mark_invite_used(...)`
- syncs `/telegram/invite/used`

> Matching stays in website/backend. Bot only executes invite operations.

---

## 6) Secure backend calls

`BackendClient` sends:

- `x-api-key`
- `x-ravi-signature: sha256=<hmac>` over raw body
- optional `x-idempotency-key` (message id)

Backend should verify signature and key, then enforce idempotency.

---

## 7) Example payloads

### POST `/telegram/group/register`

```json
{
  "telegramGroupId": "-100233445566",
  "title": "Ravi Product Builders",
  "memberCount": null,
  "registeredAt": "2026-02-12T11:40:00Z"
}
```

### POST `/telegram/message/sync`

```json
{
  "id": "-100233445566:9123",
  "telegramGroupId": "-100233445566",
  "senderHash": "4ce46546f39d9e5d486f341ad587e5f31205e2dc6f04d3da4d5b8b9e85ed7b6d",
  "messageLength": 84,
  "messageType": "text",
  "createdAt": "2026-02-12T11:44:21Z"
}
```

### POST `/telegram/invite/create`

```json
{
  "telegramGroupId": "-100233445566",
  "userId": "usr_1731",
  "expiresAt": "2026-02-12T12:00:00Z",
  "singleUse": true
}
```

### POST `/telegram/invite/used`

```json
{
  "telegramGroupId": "-100233445566",
  "userId": "usr_1731",
  "inviteLink": "https://t.me/+xxxx",
  "usedAt": "2026-02-12T11:53:10Z"
}
```

---

## 8) Edge cases and production notes

- Bot removed from group (`my_chat_member` left/kicked): mark group inactive in backend.
- Bot is not admin: invite creation fails; surface alert to operations.
- Telegram duplicate update delivery: prevented with Redis keys and backend idempotency key.
- Backend temporary outage: retry with queue worker (recommended: Redis stream / RabbitMQ).
- Rate-limit inbound webhook path at reverse proxy (Nginx/Cloudflare) and app level.
- Keep `BOT_SALT` and HMAC secret in secret manager; rotate periodically.

---

## 9) Persian / RTL considerations

- Use UTF-8 everywhere.
- Do not normalize Persian text destructively before analytics (preserve `ی`, `ک`, emojis).
- For NLP, apply Persian-aware tokenization (Hazm/Parsivar in async batch service).
- If later rendering group insights in dashboard, set CSS direction to `rtl` and locale to `fa-IR`.

---

## 10) Backend contract reminder

Expected endpoints:

- `POST /telegram/group/register`
- `POST /telegram/message/sync`
- `POST /telegram/invite/create`
- `POST /telegram/invite/used`
- `GET /telegram/group/insights`

