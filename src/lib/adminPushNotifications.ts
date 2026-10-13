import { app, db } from "@/lib/firebase";
import { deleteDoc, doc, serverTimestamp, setDoc } from "firebase/firestore";

const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY as string | undefined;

async function getTokenDocumentId(uid: string, token: string) {
  const bytes = new TextEncoder().encode(token);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  const tokenHash = Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
  return `${uid}_${tokenHash}`;
}

export async function enableAdminPushNotifications(uid: string): Promise<void> {
  if (!("Notification" in window)) {
    throw new Error("This browser does not support push notifications.");
  }
  if (!("serviceWorker" in navigator)) {
    throw new Error("Service workers are not available in this browser.");
  }
  if (!vapidKey) {
    throw new Error(
      "Push notifications need VITE_FIREBASE_VAPID_KEY in the frontend .env file before rebuilding.",
    );
  }

  const permission =
    Notification.permission === "granted"
      ? "granted"
      : await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("Allow notifications in your browser to receive order alerts.");
  }

  const messagingSdk = await import("firebase/messaging");
  if (!(await messagingSdk.isSupported())) {
    throw new Error("Firebase push notifications are not supported on this device.");
  }

  const registration = await navigator.serviceWorker.ready;
  const token = await messagingSdk.getToken(messagingSdk.getMessaging(app), {
    vapidKey,
    serviceWorkerRegistration: registration,
  });
  if (!token) {
    throw new Error("Firebase did not issue a push token. Please try again.");
  }

  await setDoc(
    doc(db, "adminNotificationTokens", await getTokenDocumentId(uid, token)),
    { uid, token, updatedAt: serverTimestamp() },
    { merge: true },
  );
}

export async function disableAdminPushNotifications(
  uid: string,
): Promise<void> {
  if (
    !vapidKey ||
    !("Notification" in window) ||
    Notification.permission !== "granted" ||
    !("serviceWorker" in navigator)
  ) {
    return;
  }

  const messagingSdk = await import("firebase/messaging");
  if (!(await messagingSdk.isSupported())) return;

  const messaging = messagingSdk.getMessaging(app);
  const token = await messagingSdk.getToken(messaging, {
    vapidKey,
    serviceWorkerRegistration: await navigator.serviceWorker.ready,
  });
  if (token) {
    await deleteDoc(
      doc(db, "adminNotificationTokens", await getTokenDocumentId(uid, token)),
    );
  }
  await messagingSdk.deleteToken(messaging);
}