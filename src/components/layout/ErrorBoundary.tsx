/**
 * ============================================================
 * ERROR BOUNDARY — Fail-Safe Rendering System
 * ============================================================
 * Intercepts runtime faults gracefully to prevent the mobile
 * viewport from ever crashing to a blank white screen.
 * Wrapped around every major portal view.
 * ============================================================
 */

import { Component, type ReactNode, type ErrorInfo } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Link } from "react-router";

interface Props {
  children: ReactNode;
  portalName?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (import.meta.env.DEV) console.error(`[ErrorBoundary] ${this.props.portalName ?? "Unknown Portal"}:`, error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <GlassCard variant="glow" animate={false} className="p-8 text-center">
              {/* Error Icon */}
              <div className="mx-auto w-16 h-16 rounded-full bg-[#C6FF34]/10 flex items-center justify-center mb-6">
                <AlertTriangle className="w-8 h-8 text-[#C6FF34]" />
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold text-white mb-2">
                Something Went Wrong
              </h2>
              <p className="text-sm text-white/50 mb-6">
                {this.props.portalName
                  ? `The ${this.props.portalName} portal encountered an unexpected issue.`
                  : "An unexpected error occurred."}
              </p>

              {/* Error Details (collapsible) */}
              {this.state.error && (
                <details className="mb-6 text-left">
                  <summary className="text-xs text-white/40 cursor-pointer hover:text-white/60 transition-colors">
                    Technical Details
                  </summary>
                  <div className="mt-2 p-3 rounded-lg bg-black/40 border border-white/5 overflow-auto">
                    <p className="text-xs text-red-400/80 font-mono break-all">
                      {this.state.error.message}
                    </p>
                    {this.state.errorInfo && (
                      <pre className="mt-2 text-[10px] text-white/30 font-mono whitespace-pre-wrap">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                </details>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={this.handleReset}
                  className="btn-lime flex items-center justify-center gap-2 flex-1"
                >
                  <RefreshCw className="w-4 h-4" />
                  Retry
                </button>
                <Link
                  to="/"
                  className="btn-ghost flex items-center justify-center gap-2 flex-1"
                >
                  <Home className="w-4 h-4" />
                  Home
                </Link>
              </div>

              {/* Footer */}
              <p className="mt-6 text-[10px] text-white/30">
                Africa&apos;s Workforce Intelligence Ecosystem
              </p>
            </GlassCard>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/** HOC wrapper for easy portal wrapping */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  portalName: string,
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary portalName={portalName}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
