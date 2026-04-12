# Firebase Setup Guide — Tinkro Admin Panel

The admin panel uses Firebase for authentication, database (Firestore), and file storage.
You need to connect your own Firebase project before the admin login will work.

---

## Step 1 — Create a Firebase Project

1. Open [Firebase Console](https://console.firebase.google.com)
2. Click **Add project**, enter a name (e.g. `tinkro-robotics`), and follow the prompts
3. Once created, click the **`</>`** icon to add a **Web App**
4. Register the app (any nickname is fine) — do NOT enable Firebase Hosting
5. Firebase will display your config object — copy it for Step 3

---

## Step 2 — Enable Required Firebase Services

In the Firebase Console sidebar:

- **Authentication → Sign-in method** → Enable **Email/Password**
- **Firestore Database** → Create database → choose your region → start in **production mode**
- **Storage** → Get started → choose your region

---

## Step 3 — Create the `.env` File

In `src/frontend/`, copy `.env.example` to `.env`:

```
cp src/frontend/.env.example src/frontend/.env
```

Then fill in your values from the Firebase config object:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

> **Where to find each value:**
> Firebase Console → Project Settings (gear icon) → General tab → Your apps → SDK setup and configuration

---

## Step 4 — Create the Default Admin User

Once the `.env` file is set and the app is running, the admin user is created **automatically** on first page load at `/admin`.

**Default credentials:**
- Email: `admin@tinkro.in`
- Password: `admin123`

If auto-seeding fails (e.g. Firestore security rules block writes), create the user manually:

1. Firebase Console → **Authentication → Users → Add user**
   - Email: `admin@tinkro.in` / Password: `admin123`
   - Copy the **UID** shown after creation

2. Firebase Console → **Firestore → Start collection** named `admins`
   - Document ID: *(the UID from step above)*
   - Fields:
     ```
     email    (string)  admin@tinkro.in
     role     (string)  super_admin
     name     (string)  Admin
     ```

3. Also add the same document to the `users` collection (same UID, same fields plus `role: "admin"`)

---

## Step 5 — Firestore Security Rules (Recommended)

In Firebase Console → Firestore → Rules, paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Admins collection — only authenticated admins can read/write
    match /admins/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
    // All other collections — authenticated users can read; admins can write
    match /{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

> For production, tighten these rules so only admin UIDs can write to sensitive collections.

---

## Troubleshooting

| Error | Fix |
|-------|-----|
| `auth/api-key-not-valid` | `.env` file is missing or has wrong `VITE_FIREBASE_API_KEY` |
| `auth/invalid-credential` | Wrong email/password, or user doesn't exist in Firebase Auth |
| `auth/user-not-found` | Run the app once to auto-seed, or create the user manually (Step 4) |
| Firestore permission denied | Check security rules allow the admin UID to write |
| Admin panel shows "Firebase Setup Required" | Create the `.env` file with your real credentials |
