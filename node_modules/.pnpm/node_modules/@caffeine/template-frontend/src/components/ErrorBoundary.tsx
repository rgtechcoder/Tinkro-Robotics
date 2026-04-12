import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  handleRefresh = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "linear-gradient(135deg, #0a0f1e 0%, #0d1b3e 50%, #0a0f1e 100%)",
            padding: "2rem",
          }}
        >
          <div
            style={{
              maxWidth: "480px",
              width: "100%",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "1.5rem",
              padding: "2.5rem",
              backdropFilter: "blur(20px)",
              boxShadow:
                "0 25px 50px rgba(0,0,0,0.4), 0 0 60px rgba(251,146,60,0.06)",
              textAlign: "center",
            }}
          >
            {/* Icon */}
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, rgba(251,146,60,0.2), rgba(251,146,60,0.05))",
                border: "1px solid rgba(251,146,60,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.5rem",
                fontSize: "1.75rem",
              }}
            >
              ⚠️
            </div>

            <h2
              style={{
                color: "#fff",
                fontSize: "1.375rem",
                fontWeight: 700,
                margin: "0 0 0.75rem",
                letterSpacing: "-0.02em",
              }}
            >
              Something went wrong
            </h2>

            <p
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: "0.9rem",
                lineHeight: 1.6,
                margin: "0 0 1rem",
              }}
            >
              An unexpected error occurred while loading this page. Please try
              refreshing.
            </p>

            {this.state.error && (
              <p
                style={{
                  color: "rgba(251,146,60,0.7)",
                  fontSize: "0.78rem",
                  fontFamily: "monospace",
                  background: "rgba(251,146,60,0.06)",
                  border: "1px solid rgba(251,146,60,0.15)",
                  borderRadius: "0.5rem",
                  padding: "0.75rem 1rem",
                  margin: "0 0 1.75rem",
                  textAlign: "left",
                  wordBreak: "break-word",
                }}
              >
                {this.state.error.message}
              </p>
            )}

            <button
              type="button"
              onClick={this.handleRefresh}
              style={{
                background: "linear-gradient(135deg, #f97316, #ea580c)",
                color: "#fff",
                border: "none",
                borderRadius: "0.75rem",
                padding: "0.75rem 2rem",
                fontSize: "0.95rem",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 4px 20px rgba(249,115,22,0.35)",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.85";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
