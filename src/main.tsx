import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import App from "./App";
import { UserAuthProvider } from "@/context/UserAuthContext";
import "./index.css";

BigInt.prototype.toJSON = function () {
  return this.toString();
};

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

// Single QueryClient instance — staleTime 5 min, gcTime 10 min for strong caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Register the service worker only in production. During local development
// the SW can interfere with hot reload and cause stale responses / clone
// errors — skip registration in dev and automatically unregister any
// existing workers to keep the dev experience deterministic.
if ("serviceWorker" in navigator) {
  if (import.meta.env.PROD) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch((err) => console.error('SW register failed', err));
    });

    navigator.serviceWorker.addEventListener("message", (event) => {
      if (event.data?.type !== "SW_UPDATED") return;
      if (sessionStorage.getItem("sw-reloaded")) return;
      sessionStorage.setItem("sw-reloaded", "1");
      window.location.reload();
    });
  } else {
    // In dev: remove any installed SWs to avoid caching surprises.
    navigator.serviceWorker.getRegistrations().then((regs) => regs.forEach((r) => r.unregister())).catch(() => {});
    console.info('Service worker disabled in development mode');
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <UserAuthProvider>
      <App />
    </UserAuthProvider>
  </QueryClientProvider>,
);
