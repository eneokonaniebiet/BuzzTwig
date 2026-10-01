# Release process

1. Merge tested changes to main.
2. Create a version tag such as v0.2.0.
3. Android CI generates the native Android project and builds a release APK.
4. Production deployment must provide DATABASE_URL, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET and CORS_ORIGINS as secret environment variables.
5. Apply database migrations before enabling new API routes.
6. Verify health endpoints, authentication, message idempotency, notification delivery, and payment webhook reconciliation.
7. Publish only after reviewing CI output.

The Android workflow currently produces a release artifact; signing credentials and Play App Signing configuration must be added before public store distribution.
