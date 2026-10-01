# BuzzTwig security baseline

## Identity
Access tokens are short-lived. Refresh tokens are rotated and stored hashed in the database. Client-supplied user IDs are never trusted for authorization.

## Messaging
The server stores encrypted message payloads. Transport must use HTTPS/WSS in production. A vetted E2EE protocol/library must be integrated before claiming end-to-end encryption.

## Payments
Client balances are not trusted. Provider webhook signatures, idempotency keys, ledger entries, reconciliation, refunds and dispute handling are required for every real money flow.

## Abuse
Rate limiting, account/device controls, block/report flows, moderation queues and audit events must be added before public launch.

## Secrets
No secrets belong in Git. Production credentials belong in the hosting provider's secret store.
