import { h as createLucideIcon, Q as useAdminAuth, R as useRouter, r as reactExports, j as jsxRuntimeExports, m as motion } from "./index-O-oxzsBJ.js";
import { u as useForm } from "./index.esm-BlSMmrQ4.js";
import { T as TriangleAlert } from "./triangle-alert-EKsd4dsT.js";
import { E as ExternalLink } from "./external-link-0xBpMtII.js";
import { E as Eye } from "./eye-CghO3a5D.js";
import { L as LoaderCircle } from "./loader-circle-DqdZu0w_.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",
      key: "ct8e1f"
    }
  ],
  ["path", { d: "M14.084 14.158a3 3 0 0 1-4.242-4.242", key: "151rxh" }],
  [
    "path",
    {
      d: "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",
      key: "13bj9a"
    }
  ],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }]
];
const EyeOff = createLucideIcon("eye-off", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const ShieldCheck = createLucideIcon("shield-check", __iconNode);
const SETUP_STEPS = [
  "Go to Firebase Console (console.firebase.google.com)",
  "Open your project → Project Settings → General",
  "Copy your Web App config values",
  "Create a file: src/frontend/.env",
  "Add the VITE_FIREBASE_* values (see FIREBASE_SETUP.md)"
];
function AdminLoginPage() {
  const { login, seedError } = useAdminAuth();
  const router = useRouter();
  const [showPass, setShowPass] = reactExports.useState(false);
  const [serverError, setServerError] = reactExports.useState(null);
  const [isSubmitting, setIsSubmitting] = reactExports.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: { email: "admin@tinkro.in", password: "" }
  });
  async function onSubmit(data) {
    setServerError(null);
    setIsSubmitting(true);
    try {
      await login(data.email, data.password);
      router.navigate({ to: "/admin/dashboard" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Sign in failed";
      if (msg === "Not authorized as admin") {
        setServerError(
          "Access denied. Your account does not have admin privileges."
        );
      } else if (msg.startsWith("Admin account exists but Firestore records") || msg.startsWith("Could not create default admin account")) {
        setServerError(
          "Admin account setup error. Please contact your system administrator."
        );
      } else {
        setServerError(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  }
  const isNotConfigured = !!seedError && seedError.includes("Firebase is not configured");
  const displayError = serverError ?? (!isNotConfigured ? seedError : null);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen flex items-center justify-center px-4 py-8",
      style: {
        background: "linear-gradient(135deg, oklch(0.09 0.03 250) 0%, oklch(0.07 0.02 243) 60%, oklch(0.10 0.04 280) 100%)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 overflow-hidden pointer-events-none", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10",
              style: { background: "oklch(0.45 0.12 243)" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-8",
              style: { background: "oklch(0.71 0.17 48)" }
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 24 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.5, ease: "easeOut" },
            className: "relative w-full max-w-md",
            "data-ocid": "admin-login-card",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "rounded-2xl p-8 md:p-10",
                style: {
                  background: "oklch(0.13 0.04 243 / 0.85)",
                  border: "1px solid oklch(0.25 0.05 243 / 0.5)",
                  backdropFilter: "blur(20px)",
                  boxShadow: "0 24px 80px oklch(0.05 0.02 243 / 0.8), 0 0 0 1px oklch(0.30 0.06 243 / 0.2)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center mb-8", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold text-white mb-4",
                        style: {
                          background: "linear-gradient(135deg, oklch(0.45 0.12 243), oklch(0.7 0.13 195))",
                          boxShadow: "0 0 24px oklch(0.45 0.12 243 / 0.4)"
                        },
                        children: "T"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 16, style: { color: "oklch(0.71 0.17 48)" } }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-bold text-white", children: "Admin Portal" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "text-sm mt-1.5 text-center",
                        style: { color: "oklch(0.50 0.02 243)" },
                        children: "Sign in to manage Tinkro Robotics"
                      }
                    )
                  ] }),
                  isNotConfigured ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    motion.div,
                    {
                      initial: { opacity: 0, y: -8 },
                      animate: { opacity: 1, y: 0 },
                      transition: { duration: 0.4 },
                      className: "rounded-xl p-5 mb-5",
                      style: {
                        background: "oklch(0.71 0.17 48 / 0.08)",
                        border: "1px solid oklch(0.71 0.17 48 / 0.35)"
                      },
                      "data-ocid": "firebase-setup-panel",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            TriangleAlert,
                            {
                              size: 16,
                              style: { color: "oklch(0.71 0.17 48)" }
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "h2",
                            {
                              className: "text-sm font-bold",
                              style: { color: "oklch(0.85 0.14 60)" },
                              children: "Firebase Setup Required"
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "p",
                          {
                            className: "text-xs mb-4 leading-relaxed",
                            style: { color: "oklch(0.70 0.06 60)" },
                            children: "To use the admin panel, you need to connect your Firebase project. Follow the steps below to get started."
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "space-y-2 mb-5", children: SETUP_STEPS.map((step, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2.5 text-xs", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5",
                              style: {
                                background: "oklch(0.71 0.17 48 / 0.2)",
                                color: "oklch(0.85 0.14 60)"
                              },
                              children: idx + 1
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "oklch(0.72 0.04 243)" }, children: step })
                        ] }, step)) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "a",
                          {
                            href: "https://console.firebase.google.com",
                            target: "_blank",
                            rel: "noopener noreferrer",
                            className: "flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 hover:opacity-90",
                            style: {
                              background: "linear-gradient(135deg, oklch(0.71 0.17 48), oklch(0.76 0.16 72))",
                              color: "white",
                              boxShadow: "0 0 16px oklch(0.71 0.17 48 / 0.3)"
                            },
                            "data-ocid": "firebase-console-link",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 13 }),
                              "Create Firebase Project"
                            ]
                          }
                        )
                      ]
                    }
                  ) : (
                    /* Seed error banner — only shown when there's a setup issue, not a login error */
                    seedError && !serverError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      motion.div,
                      {
                        initial: { opacity: 0, y: -6 },
                        animate: { opacity: 1, y: 0 },
                        className: "rounded-xl px-4 py-3 text-sm mb-5 flex items-start gap-2.5",
                        style: {
                          background: "oklch(0.60 0.18 72 / 0.12)",
                          border: "1px solid oklch(0.60 0.18 72 / 0.3)",
                          color: "oklch(0.85 0.12 72)"
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 15, className: "mt-0.5 shrink-0" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Admin setup in progress — you can still sign in if your account already exists." })
                        ]
                      }
                    )
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "form",
                    {
                      onSubmit: handleSubmit(onSubmit),
                      className: "space-y-5",
                      "data-ocid": "admin-login-form",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "label",
                            {
                              htmlFor: "admin-email",
                              className: "block text-xs font-semibold mb-1.5 uppercase tracking-widest",
                              style: { color: "oklch(0.60 0.03 243)" },
                              children: "Admin Email"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "input",
                            {
                              id: "admin-email",
                              type: "email",
                              autoComplete: "email",
                              "data-ocid": "admin-email-input",
                              placeholder: "admin@tinkro.in",
                              className: "w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/25 outline-none transition-all duration-200 focus:ring-2 focus:ring-orange-400/40",
                              style: {
                                background: "oklch(0.16 0.04 243 / 0.8)",
                                border: errors.email ? "1px solid oklch(0.65 0.22 25)" : "1px solid oklch(0.25 0.05 243 / 0.6)"
                              },
                              ...register("email", {
                                required: "Email is required",
                                pattern: {
                                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                  message: "Enter a valid email"
                                }
                              })
                            }
                          ),
                          errors.email && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1.5 text-xs text-red-400", children: errors.email.message })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "label",
                            {
                              htmlFor: "admin-password",
                              className: "block text-xs font-semibold mb-1.5 uppercase tracking-widest",
                              style: { color: "oklch(0.60 0.03 243)" },
                              children: "Password"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "input",
                              {
                                id: "admin-password",
                                type: showPass ? "text" : "password",
                                autoComplete: "current-password",
                                "data-ocid": "admin-password-input",
                                placeholder: "••••••••",
                                className: "w-full px-4 py-3 pr-11 rounded-xl text-sm text-white placeholder-white/25 outline-none transition-all duration-200 focus:ring-2",
                                style: {
                                  background: "oklch(0.16 0.04 243 / 0.8)",
                                  border: errors.password ? "1px solid oklch(0.65 0.22 25)" : "1px solid oklch(0.25 0.05 243 / 0.6)"
                                },
                                ...register("password", {
                                  required: "Password is required",
                                  minLength: { value: 6, message: "Minimum 6 characters" }
                                })
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "button",
                              {
                                type: "button",
                                onClick: () => setShowPass((p) => !p),
                                className: "absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded text-white/30 hover:text-white/60 transition-colors",
                                "aria-label": showPass ? "Hide password" : "Show password",
                                children: showPass ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { size: 16 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 16 })
                              }
                            )
                          ] }),
                          errors.password && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1.5 text-xs text-red-400", children: errors.password.message })
                        ] }),
                        displayError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          motion.div,
                          {
                            initial: { opacity: 0, y: -6 },
                            animate: { opacity: 1, y: 0 },
                            className: "rounded-xl px-4 py-3 text-sm text-red-300 flex items-start gap-2.5",
                            style: {
                              background: "oklch(0.55 0.22 25 / 0.15)",
                              border: "1px solid oklch(0.55 0.22 25 / 0.3)"
                            },
                            "data-ocid": "admin-login-error",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 15, className: "mt-0.5 shrink-0" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: displayError })
                            ]
                          },
                          displayError
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "submit",
                            disabled: isSubmitting,
                            "data-ocid": "admin-login-submit",
                            className: "w-full py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed",
                            style: {
                              background: isSubmitting ? "oklch(0.55 0.10 48)" : "linear-gradient(135deg, oklch(0.71 0.17 48), oklch(0.76 0.16 72))",
                              boxShadow: isSubmitting ? "none" : "0 0 20px oklch(0.71 0.17 48 / 0.35)"
                            },
                            children: isSubmitting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 16, className: "animate-spin" }),
                              " Signing in…"
                            ] }) : "Sign In to Admin"
                          }
                        )
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-center text-xs mt-6",
                      style: { color: "oklch(0.40 0.02 243)" },
                      children: "Admin access only. Unauthorized access is prohibited."
                    }
                  )
                ]
              }
            )
          }
        )
      ]
    }
  );
}
export {
  AdminLoginPage as default
};
