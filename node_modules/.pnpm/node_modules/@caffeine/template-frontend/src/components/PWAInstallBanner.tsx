import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "tinkro-pwa-banner-dismissed";

export function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(DISMISS_KEY) === "true") return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      setVisible(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem(DISMISS_KEY, "true");
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md"
          data-ocid="pwa-install-banner"
        >
          <div
            className="flex items-center gap-3 rounded-2xl border border-white/10 p-4 shadow-2xl"
            style={{
              background:
                "linear-gradient(135deg, rgba(10,22,40,0.97) 0%, rgba(14,31,61,0.97) 100%)",
              backdropFilter: "blur(20px)",
            }}
          >
            {/* Icon */}
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0a1628]">
              <svg
                viewBox="0 0 44 44"
                width="44"
                height="44"
                aria-hidden="true"
                focusable="false"
              >
                <rect width="44" height="44" rx="10" fill="#0a1628" />
                <rect
                  x="11"
                  y="13"
                  width="22"
                  height="6"
                  rx="2"
                  fill="#F47B20"
                />
                <rect
                  x="19"
                  y="19"
                  width="6"
                  height="14"
                  rx="2"
                  fill="#F47B20"
                />
              </svg>
            </div>

            {/* Text */}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white">
                Install Tinkro App
              </p>
              <p className="text-xs text-white/50">
                Faster access, offline support
              </p>
            </div>

            {/* Install button */}
            <button
              type="button"
              onClick={handleInstall}
              data-ocid="pwa-install-btn"
              className="shrink-0 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #F47B20 0%, #e06010 100%)",
                boxShadow: "0 0 16px rgba(244,123,32,0.4)",
              }}
            >
              Install
            </button>

            {/* Dismiss */}
            <button
              type="button"
              onClick={handleDismiss}
              data-ocid="pwa-dismiss-btn"
              aria-label="Dismiss install banner"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white/40 transition-colors hover:bg-white/10 hover:text-white"
            >
              <svg
                viewBox="0 0 16 16"
                width="14"
                height="14"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M4.293 4.293a1 1 0 011.414 0L8 6.586l2.293-2.293a1 1 0 111.414 1.414L9.414 8l2.293 2.293a1 1 0 01-1.414 1.414L8 9.414l-2.293 2.293a1 1 0 01-1.414-1.414L6.586 8 4.293 5.707a1 1 0 010-1.414z" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
