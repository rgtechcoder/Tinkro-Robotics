import type {
  CashfreeCheckoutOptions,
  CashfreeCheckoutResult,
  CashfreeInstance,
  CashfreeMode,
} from "../types/cashfree";
import { app } from "@/lib/firebase";
import { getFunctions, httpsCallable } from "firebase/functions";

const CASHFREE_SCRIPT_URL = "https://sdk.cashfree.com/js/v3/cashfree.js";
const rawEnv = String(import.meta.env.VITE_CASHFREE_ENV || "sandbox").toLowerCase();
const CASHFREE_ENV: CashfreeMode =
  rawEnv === "production" || rawEnv === "live" ? "production" : "sandbox";
const CASHFREE_REGION = "asia-south1";

const cashfreeFunctions = getFunctions(app, CASHFREE_REGION);

export function loadCashfree(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Cashfree) {
      resolve(true);
      return;
    }

    const existingScript = document.getElementById("cashfree-js");
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true));
      existingScript.addEventListener("error", () => resolve(false));
      return;
    }

    const script = document.createElement("script");
    script.id = "cashfree-js";
    script.src = CASHFREE_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

export function getCashfreeInstance(): CashfreeInstance {
  if (!window.Cashfree) {
    throw new Error("Cashfree SDK not loaded. Call loadCashfree() first.");
  }
  return new window.Cashfree({ mode: CASHFREE_ENV });
}

export async function openCashfreeCheckout(
  options: CashfreeCheckoutOptions,
): Promise<CashfreeCheckoutResult> {
  const cashfree = getCashfreeInstance();
  return cashfree.checkout(options);
}

export async function createCashfreeOrder(payload: {
  amount: number;
  currency: string;
  customer: {
    id: string;
    name: string;
    email?: string;
    phone: string;
  };
  orderNote?: string;
  orderMeta?: Record<string, string>;
}): Promise<{ orderId: string; paymentSessionId: string }> {
  const callable = httpsCallable(cashfreeFunctions, "createCashfreeOrder");
  const result = await callable(payload);
  return result.data as { orderId: string; paymentSessionId: string };
}

export async function verifyCashfreePayment(payload: {
  orderId: string;
}): Promise<{
  orderStatus: string | null;
  orderId: string;
  cfOrderId?: string | null;
  paymentStatus?: string | null;
  paymentId?: string | null;
}> {
  const callable = httpsCallable(cashfreeFunctions, "verifyCashfreePayment");
  const result = await callable(payload);
  return result.data as {
    orderStatus: string | null;
    orderId: string;
    cfOrderId?: string | null;
    paymentStatus?: string | null;
    paymentId?: string | null;
  };
}
