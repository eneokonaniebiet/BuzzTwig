# BuzzTwig production architecture

- Flutter mobile client.
- TypeScript/Express API.
- PostgreSQL transactional source of truth.
- WebSocket/realtime fan-out service.
- Object storage for media.
- Push notification workers.
- Redis/pubsub when realtime needs horizontal scaling.

The API never trusts a client-supplied identity: authenticated identity comes from a verified access token. Room membership is checked before message reads/writes.

Messages persist before realtime broadcast and use client-generated IDs for idempotent retries. The message table stores encrypted payloads rather than plaintext. BuzzTwig must not claim Signal-level security until a vetted E2EE protocol implementation is integrated and independently reviewed.

Wallets use a ledger model. Provider webhooks must be verified, idempotent, and reconciled before balances are final.
