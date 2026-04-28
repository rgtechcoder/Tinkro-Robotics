import { AlertCircle, CheckCircle, Info, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { ToastMessage } from "../types";

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

function ToastItem({
  toast,
  onDismiss,
}: { toast: ToastMessage; onDismiss: (id: string) => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDismiss(toast.id), 300);
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-accent shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-destructive shrink-0" />,
    info: <Info className="w-5 h-5 text-primary shrink-0" />,
  };

  const bars = {
    success: "bg-accent",
    error: "bg-destructive",
    info: "bg-primary",
  };

  return (
    <div
      className={`
        relative overflow-hidden flex items-center gap-3 px-4 py-3 rounded-xl
        glass-card shadow-elevated min-w-[280px] max-w-[360px]
        transition-all duration-300 ease-out
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
      `}
    >
      {icons[toast.type]}
      <span className="text-sm font-medium text-foreground flex-1">
        {toast.message}
      </span>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="ml-1 p-1 rounded-lg hover:bg-muted transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="w-3.5 h-3.5 text-muted-foreground" />
      </button>
      <div
        className={`absolute bottom-0 left-0 h-0.5 ${bars[toast.type]} animate-[shrink_4.5s_linear_forwards]`}
        style={{ width: "100%" }}
      />
    </div>
  );
}

export function ToastContainer({ toasts, onDismiss }: ToastProps) {
  return (
    <div
      aria-live="polite"
      className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 items-end"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (
    message: string,
    type: ToastMessage["type"] = "success",
  ) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, addToast, dismiss };
}
