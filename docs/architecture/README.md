# BuzzTwig Architecture

Monorepo for Flutter mobile, web/admin clients, TypeScript services, shared packages, PostgreSQL migrations, and operations documentation.

Clients use short-lived access tokens and rotating refresh sessions. APIs authorize every resource operation. Realtime connections authenticate with verified credentials. PostgreSQL is the transactional system of record and object storage holds media.
