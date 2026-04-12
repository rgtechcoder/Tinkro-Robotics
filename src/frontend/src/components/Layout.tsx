import type { ReactNode } from "react";
import { createContext, useContext, useEffect } from "react";
import { useRouter, useRouterState } from "@tanstack/react-router";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { PWAInstallBanner } from "./PWAInstallBanner";
import { ToastContainer, useToast } from "./Toast";

interface ToastContextValue {
  addToast: (message: string, type?: "success" | "error" | "info") => void;
}

const ToastContext = createContext<ToastContextValue>({ addToast: () => {} });

export function useToastContext() {
  return useContext(ToastContext);
}

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {

  const { toasts, addToast, dismiss } = useToast();
  // Use router state to get current location
  const location = useRouterState({ select: (s) => s.location });

  // Scroll to top on every route change (by location)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname, location.search]);

  return (
    <ToastContext.Provider value={{ addToast }}>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <ToastContainer toasts={toasts} onDismiss={dismiss} />
        <PWAInstallBanner />
      </div>
    </ToastContext.Provider>
  );
}
