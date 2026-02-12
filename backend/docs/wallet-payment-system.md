# Wallet + Payment System (Persian gateway-ready)

## 1) Wallet schema

```ts
@Entity({ name: 'wallets' })
class WalletEntity {
  id: uuid;
  userId: uuid; // unique per user
  balance: number; // integer IRR
  currency: 'IRR';
  createdAt: Date;
  updatedAt: Date;
}
```

## 2) Transaction schema

```ts
@Entity({ name: 'wallet_transactions' })
class WalletTransactionEntity {
  id: uuid;
  userId: uuid;
  eventId?: uuid;
  type: 'recharge' | 'debit';
  status: 'pending' | 'success' | 'failed';
  amount: number;
  balanceAfter?: number;
  description?: string;
  gateway?: string; // zarinpal/idpay/wallet
  gatewayAuthority?: string; // Persian gateway authority/token
  gatewayReferenceId?: string; // final ref id after callback
  callbackUrl?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}
```

## 3) APIs

### POST `/wallet/recharge`
Creates a persisted **pending** recharge transaction and returns `paymentUrl` for Persian gateways.

Request:

```json
{
  "amount": 500000,
  "gateway": "zarinpal",
  "callbackUrl": "https://app.example.com/payment/callback"
}
```

Response includes:
- `transaction` (saved in DB)
- `paymentUrl`
- informative message

> Important: balance is **not** increased in this step. It must be finalized by gateway callback flow.

### POST `/wallet/pay`
Pays for an event directly from wallet with strict balance validation and persisted debit transaction.

Request:

```json
{
  "eventId": "<event-uuid>",
  "seats": 1
}
```

Response includes:
- paid reservation
- debit transaction
- updated wallet balance

## 4) Balance validation

- Wallet row is locked (`pessimistic_write`) during payment.
- Rejects payment when `wallet.balance < event.price * seats`.
- Both reservation and wallet debit are in a single DB transaction.
- Every operation is recorded in `wallet_transactions`.

## 5) Frontend usage example

```ts
import { fetchWallet, rechargeWallet, payWithWallet, fetchWalletTransactions } from '@/lib/api';

const wallet = await fetchWallet();
console.log(wallet.balance);

const recharge = await rechargeWallet({
  amount: 750000,
  gateway: 'zarinpal',
  callbackUrl: `${window.location.origin}/payment/callback`,
});
window.location.href = recharge.paymentUrl;

await payWithWallet({ eventId: 'event-uuid', seats: 1 });

const history = await fetchWalletTransactions(20);
console.table(history);
```
