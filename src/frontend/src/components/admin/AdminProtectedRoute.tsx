import { useAdminAuth } from "@/context/AdminAuthContext";
import { Navigate } from "@tanstack/react-router";
import type { ReactNode } from "react";

interface AdminProtectedRouteProps {
  children: ReactNode;
}

export function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const { adminUser, adminRole, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.09 0.03 250) 0%, oklch(0.07 0.02 243) 100%)",
        }}
      >
        <div className="flex flex-col items-center gap-4">
          {/* Pulsing logo */}
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center animate-pulse bg-white overflow-hidden"
            style={{
              boxShadow:
                "0 0 16px oklch(0.45 0.12 243 / 0.35), 0 0 0 1px oklch(0.20 0.03 243 / 0.6)",
            }}
          >
            <img
              src="/tinkro%20favicon.png"
              alt="Tinkro"
              className="h-full w-full object-contain p-1.5"
            />
          </div>
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full"
                style={{
                  background: "oklch(0.71 0.17 48)",
                  animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                  opacity: 0.7,
                }}
              />
            ))}
          </div>
          <p className="text-sm" style={{ color: "oklch(0.50 0.02 243)" }}>
            Verifying admin access…
          </p>
        </div>
      </div>
    );
  }

  // Redirect if no authenticated admin user OR if authenticated user lacks admin role.
  if (!adminUser || !adminRole) {
    return <Navigate to="/admin/login" />;
  }

  return <>{children}</>;
}
