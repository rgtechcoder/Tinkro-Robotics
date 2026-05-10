export type CashfreeMode = "sandbox" | "production";

export interface CashfreeCheckoutOptions {
  paymentSessionId: string;
  redirectTarget?: "_modal" | "_self" | "_blank";
  returnUrl?: string;
}

export interface CashfreeCheckoutError {
  code?: string;
  message?: string;
  description?: string;
}

export interface CashfreeCheckoutResult {
  error?: CashfreeCheckoutError;
  redirect?: boolean;
  paymentDetails?: {
    orderId?: string;
    paymentSessionId?: string;
    paymentStatus?: string;
  };
}

export interface CashfreeInstance {
  checkout(options: CashfreeCheckoutOptions): Promise<CashfreeCheckoutResult>;
}

export interface CashfreeConstructor {
  new (options: { mode: CashfreeMode }): CashfreeInstance;
}

declare global {
  interface Window {
    Cashfree: CashfreeConstructor;
  }
}
