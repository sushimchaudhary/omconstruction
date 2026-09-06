# Restaurant Management System — Reference Package

This is a re-packaged version of the reference source code you pasted into
chat, organized into a runnable folder structure, with secrets redacted.

## ⚠️ Security note

The `.env` block you pasted contained live-looking secrets: a database
connection string with password, JWT signing secrets, an email app
password, and AWS/S3-style keys. **None of those real values are included
in this package.** `.env.example` has placeholders only.

If those credentials are real and were ever used in a live system, treat
them as compromised (they were shared in plaintext in this conversation)
and rotate them:
- Database password
- `JWT_SECRET` / `JWT_REFRESH_SECRET`
- Email account app password
- AWS/S3 access keys
- Any third-party API keys (payment gateway secrets, etc.)

## What's included (taken directly from what you pasted)

- `prisma/schema.prisma` — full Prisma schema
- `src/controllers/authController.js` — login, forgot/reset/change password
- `src/controllers/adminController.js` — admin CRUD, profile, block toggle
- `src/middleware/auth.js`, `src/middleware/adminOrSuperUser.js`
- `src/middleware/upload.js` — multer wrapper (single/fields/array)
- `src/middleware/checkSubscription.js` (see note below)
- `src/utils/merchantCrypto.js` — AES-256-GCM helper for merchant secrets
- `src/utils/jwtUtils.js` — access/refresh token generation
- `src/utils/socket.js` — Socket.IO init + room/event helpers
- `src/utils/userUtils.js` — password hash/compare
- `src/routes/authRoutes.js`, `src/routes/adminRoutes.js`,
  `src/routes/contentRoutes.js`, `src/routes/index.js`
- `src/server.js` — Express app bootstrap
- `scripts/createSuperUser.js` — seed script (credentials via env vars,
  no hardcoded password)

## What's reconstructed (NOT in your pasted source — stubbed so imports resolve)

These files were referenced by the code you shared but their actual
implementation wasn't pasted, so I wrote minimal placeholder versions
marked with a comment at the top. Swap in your real files if you have them:

- `src/config/dbConnect.js`
- `src/utils/subscriptionUtils.js` (`getBranchSubscriptionStatus`, `ensureDefaultPlans`)
- `src/middleware/checkSubscription.js`

## What's missing entirely (referenced but never pasted)

`contentRoutes.js` depends on controllers that weren't in your source:
`organizationController`, `galleryController`, `sliderController`,
`noticeController`, `staffController`, and `middleware/authMiddleware`
(`protect`, `editorOnly`, `optionalAuth`). The route file is included
as-is for reference, but the app won't boot until those are added back.

Likewise, `src/server.js` has several route mounts commented out
(`restaurantRoutes`, `branchRoutes`, `paymentRoutes`, `aiRoutes`,
`tenantRoutes`, `dashboardRoutes`, `subscriptionRoutes`,
`merchantAccountRoutes`, `publicRoutes`) since those files weren't
provided either.

## Getting it running

```bash
npm install
cp .env.example .env   # fill in real values
npx prisma generate
npx prisma migrate dev
npm run create-superuser
npm start
```
