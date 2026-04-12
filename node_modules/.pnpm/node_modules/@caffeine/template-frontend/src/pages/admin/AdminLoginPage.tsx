import { useAdminAuth } from "@/context/AdminAuthContext";
import { useRouter } from "@tanstack/react-router";
import {
  AlertTriangle,
  ExternalLink,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface LoginForm {
  email: string;
  password: string;
}

const SETUP_STEPS = [
  "Go to Firebase Console (console.firebase.google.com)",
  "Open your project → Project Settings → General",
  "Copy your Web App config values",
  "Create a file: src/frontend/.env",
  "Add the VITE_FIREBASE_* values (see FIREBASE_SETUP.md)",
];

export default function AdminLoginPage() {
  const { login, seedError } = useAdminAuth();
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    defaultValues: { email: "admin@tinkro.in", password: "" },
  });

  async function onSubmit(data: LoginForm) {
    setServerError(null);
    setIsSubmitting(true);
    try {
      await login(data.email, data.password);
      router.navigate({ to: "/admin/dashboard" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Sign in failed";
      if (msg === "Not authorized as admin") {
        setServerError(
          "Access denied. Your account does not have admin privileges.",
        );
      } else if (
        msg.startsWith("Admin account exists but Firestore records") ||
        msg.startsWith("Could not create default admin account")
      ) {
        setServerError(
          "Admin account setup error. Please contact your system administrator.",
        );
      } else {
        setServerError(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  // Detect the "not configured" case to show a dedicated setup panel
  const isNotConfigured =
    !!seedError && seedError.includes("Firebase is not configured");

  // The combined error to show — login error takes priority, then seed error
  const displayError = serverError ?? (!isNotConfigured ? seedError : null);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.09 0.03 250) 0%, oklch(0.07 0.02 243) 60%, oklch(0.10 0.04 280) 100%)",
      }}
    >
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ background: "oklch(0.45 0.12 243)" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-8"
          style={{ background: "oklch(0.71 0.17 48)" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-md"
        data-ocid="admin-login-card"
      >
        <div
          className="rounded-2xl p-8 md:p-10"
          style={{
            background: "oklch(0.13 0.04 243 / 0.85)",
            border: "1px solid oklch(0.25 0.05 243 / 0.5)",
            backdropFilter: "blur(20px)",
            boxShadow:
              "0 24px 80px oklch(0.05 0.02 243 / 0.8), 0 0 0 1px oklch(0.30 0.06 243 / 0.2)",
          }}
        >
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold text-white mb-4"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.45 0.12 243), oklch(0.7 0.13 195))",
                boxShadow: "0 0 24px oklch(0.45 0.12 243 / 0.4)",
              }}
            >
              T
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} style={{ color: "oklch(0.71 0.17 48)" }} />
              <h1 className="text-lg font-bold text-white">Admin Portal</h1>
            </div>
            <p
              className="text-sm mt-1.5 text-center"
              style={{ color: "oklch(0.50 0.02 243)" }}
            >
              Sign in to manage Tinkro Robotics
            </p>
          </div>

          {/* Firebase not configured — show setup instructions panel */}
          {isNotConfigured ? (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="rounded-xl p-5 mb-5"
              style={{
                background: "oklch(0.71 0.17 48 / 0.08)",
                border: "1px solid oklch(0.71 0.17 48 / 0.35)",
              }}
              data-ocid="firebase-setup-panel"
            >
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle
                  size={16}
                  style={{ color: "oklch(0.71 0.17 48)" }}
                />
                <h2
                  className="text-sm font-bold"
                  style={{ color: "oklch(0.85 0.14 60)" }}
                >
                  Firebase Setup Required
                </h2>
              </div>
              <p
                className="text-xs mb-4 leading-relaxed"
                style={{ color: "oklch(0.70 0.06 60)" }}
              >
                To use the admin panel, you need to connect your Firebase
                project. Follow the steps below to get started.
              </p>
              <ol className="space-y-2 mb-5">
                {SETUP_STEPS.map((step, idx) => (
                  <li key={step} className="flex items-start gap-2.5 text-xs">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5"
                      style={{
                        background: "oklch(0.71 0.17 48 / 0.2)",
                        color: "oklch(0.85 0.14 60)",
                      }}
                    >
                      {idx + 1}
                    </span>
                    <span style={{ color: "oklch(0.72 0.04 243)" }}>
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
              <a
                href="https://console.firebase.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 hover:opacity-90"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.71 0.17 48), oklch(0.76 0.16 72))",
                  color: "white",
                  boxShadow: "0 0 16px oklch(0.71 0.17 48 / 0.3)",
                }}
                data-ocid="firebase-console-link"
              >
                <ExternalLink size={13} />
                Create Firebase Project
              </a>
            </motion.div>
          ) : (
            /* Seed error banner — only shown when there's a setup issue, not a login error */
            seedError &&
            !serverError && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl px-4 py-3 text-sm mb-5 flex items-start gap-2.5"
                style={{
                  background: "oklch(0.60 0.18 72 / 0.12)",
                  border: "1px solid oklch(0.60 0.18 72 / 0.3)",
                  color: "oklch(0.85 0.12 72)",
                }}
              >
                <AlertTriangle size={15} className="mt-0.5 shrink-0" />
                <span>
                  Admin setup in progress — you can still sign in if your
                  account already exists.
                </span>
              </motion.div>
            )
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
            data-ocid="admin-login-form"
          >
            {/* Email */}
            <div>
              <label
                htmlFor="admin-email"
                className="block text-xs font-semibold mb-1.5 uppercase tracking-widest"
                style={{ color: "oklch(0.60 0.03 243)" }}
              >
                Admin Email
              </label>
              <input
                id="admin-email"
                type="email"
                autoComplete="email"
                data-ocid="admin-email-input"
                placeholder="admin@tinkro.in"
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/25 outline-none transition-all duration-200 focus:ring-2 focus:ring-orange-400/40"
                style={{
                  background: "oklch(0.16 0.04 243 / 0.8)",
                  border: errors.email
                    ? "1px solid oklch(0.65 0.22 25)"
                    : "1px solid oklch(0.25 0.05 243 / 0.6)",
                }}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email",
                  },
                })}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-semibold mb-1.5 uppercase tracking-widest"
                style={{ color: "oklch(0.60 0.03 243)" }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  data-ocid="admin-password-input"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-11 rounded-xl text-sm text-white placeholder-white/25 outline-none transition-all duration-200 focus:ring-2"
                  style={{
                    background: "oklch(0.16 0.04 243 / 0.8)",
                    border: errors.password
                      ? "1px solid oklch(0.65 0.22 25)"
                      : "1px solid oklch(0.25 0.05 243 / 0.6)",
                  }}
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Minimum 6 characters" },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded text-white/30 hover:text-white/60 transition-colors"
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Login / server error — prominently displayed */}
            {displayError && (
              <motion.div
                key={displayError}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl px-4 py-3 text-sm text-red-300 flex items-start gap-2.5"
                style={{
                  background: "oklch(0.55 0.22 25 / 0.15)",
                  border: "1px solid oklch(0.55 0.22 25 / 0.3)",
                }}
                data-ocid="admin-login-error"
              >
                <AlertTriangle size={15} className="mt-0.5 shrink-0" />
                <span>{displayError}</span>
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              data-ocid="admin-login-submit"
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: isSubmitting
                  ? "oklch(0.55 0.10 48)"
                  : "linear-gradient(135deg, oklch(0.71 0.17 48), oklch(0.76 0.16 72))",
                boxShadow: isSubmitting
                  ? "none"
                  : "0 0 20px oklch(0.71 0.17 48 / 0.35)",
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Signing in…
                </>
              ) : (
                "Sign In to Admin"
              )}
            </button>
          </form>

          <p
            className="text-center text-xs mt-6"
            style={{ color: "oklch(0.40 0.02 243)" }}
          >
            Admin access only. Unauthorized access is prohibited.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
