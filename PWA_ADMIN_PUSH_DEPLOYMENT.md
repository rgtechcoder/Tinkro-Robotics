# Admin PWA access, order alerts, and deployment

## What this enables

- Admin pages remain outside the public shop navigation and require a valid `adminusers/{uid}` role.
- Firestore rules also restrict admin data and each push token to an authorized admin; hiding the page is not the only security check.
- An admin can enable notifications separately on each browser/device using **Enable alerts** in the admin header.
- A server-side Firebase Function sends a push for every newly created order, including COD and Cashfree/online orders. The email provider is not part of that order write or dashboard subscription.
- The existing dashboard subscribes to all Firestore orders. An email delivery failure does not delete or hide an order.

## One-time Firebase setup

1. In Firebase Console, open **Project settings → Cloud Messaging → Web Push certificates** and generate/copy the public Web Push key.
2. Put that public key in `src/frontend/.env` as `VITE_FIREBASE_VAPID_KEY`. Replace the placeholder already present. This is a public browser key, not the Resend API secret.
3. Confirm Firebase Authentication has Email/Password enabled and Firestore is using the project's current admin role records.
4. Set these Firebase Functions secrets if they are not already configured. Firebase CLI prompts for each value; enter secrets directly in the terminal and never commit them:
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL`
   - `ORDER_NOTIFY_EMAIL` (one or more comma-separated admin inboxes)

Run each command only for a secret that has not already been set:

```powershell
firebase functions:secrets:set RESEND_API_KEY --project tinkro-robotics
firebase functions:secrets:set RESEND_FROM_EMAIL --project tinkro-robotics
firebase functions:secrets:set ORDER_NOTIFY_EMAIL --project tinkro-robotics
```

## Build and deploy

From the repository root, authenticate the Firebase CLI and deploy backend code/rules:

```powershell
firebase login
firebase deploy --project tinkro-robotics --only functions,firestore:rules
```

Build the frontend after setting the VAPID key:

```powershell
pnpm --dir src/frontend build
```

Publish the generated `src/frontend/dist` directory to the same web host currently serving `tinkro.in`. The repository's `firebase.json` configures Functions, Firestore, and Storage but does not configure Firebase Hosting, so the frontend publish command depends on the existing hosting provider. Do not deploy `dist` to a new host unless its domain and Firebase Auth authorized domains are configured.

## Give another person admin access

If the owner cannot currently sign in, first make sure the owner's existing Firebase Auth user has an `adminusers/{UID}` record. Create that record once through the Firebase Console/authorized administrative tooling (the client deliberately cannot create its own privilege record). Use role `superAdmin` for the owner. Then:

1. Create the colleague's Firebase Authentication account in Firebase Console (**Authentication → Users → Add user**). Do not share the owner's password.
2. Copy the new account's UID. In Firestore, create `adminusers/{UID}` with `uid` (string, same UID), `email` (same account email), `displayName` (string), `role` (`admin` or `editor`), and `createdAt` (timestamp).
3. Send that person the admin URL: `https://tinkro.in/admin/login`. Only accounts with a recognized role document can pass the route and Firestore checks. Removing their `adminusers/{UID}` document revokes access; the push function also removes their old notification tokens on its next order event.

## Enable push on the phone

1. Install/update the Tinkro PWA, open `/admin/login`, and sign in with an authorized admin account.
2. Tap **Enable alerts** and allow notifications. Repeat on each device/browser that should receive alerts.
3. Place a small test order (COD or online) and confirm the notification opens the admin orders page when tapped.

Push requires internet access, an active notification permission, a valid FCM token, and OS/browser background delivery. Android Chrome/installed PWAs are supported; on iPhone/iPad, use an installed Home Screen web app on iOS/iPadOS 16.4 or newer. Force-stopped apps, revoked permissions, battery restrictions, or offline devices can delay/drop OS notifications, so keep email enabled as a second channel and check Firebase Functions logs if delivery fails.