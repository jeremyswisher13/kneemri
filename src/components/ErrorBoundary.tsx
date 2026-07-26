import { Component, type ErrorInfo, type ReactNode } from "react";
import { useRouteError } from "react-router-dom";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

function getErrorFallbackCopy(error: Error | null) {
  const loadingFailure =
    /chunkloaderror|loading chunk|dynamically imported module|importing a module script failed|failed to fetch module script/i.test(
      error?.message ?? "",
    );

  return loadingFailure
    ? {
        title: "This page needs a quick refresh",
        detail:
          "The app may have updated while this screen was loading, or the connection may have briefly dropped. Reload to open the current version.",
      }
    : {
        title: "We couldn't open this page",
        detail:
          "The app encountered an unexpected problem. Reload the page, or return to the course list and try again.",
      };
}

export function AppErrorFallback({
  error,
  onReload,
}: {
  error: Error | null;
  onReload: () => void;
}) {
  const copy = getErrorFallbackCopy(error);

  return (
    <main className="flex min-h-screen min-h-[100dvh] items-center justify-center bg-brand-gray px-5 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-[calc(2rem+env(safe-area-inset-top))]">
      <div
        role="alert"
        aria-labelledby="app-error-title"
        className="w-full max-w-lg text-center"
      >
        <img
          src="/pwa-icon-192.png"
          alt=""
          className="mx-auto h-16 w-16 rounded-[18px] shadow-sm ring-1 ring-black/5"
        />
        <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-brand-blue">
          Sports MRI Academy
        </p>
        <h1 id="app-error-title" className="mt-2 text-2xl font-bold text-gray-900">
          {copy.title}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-600">
          {copy.detail}
        </p>

        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onReload}
            className="min-h-11 rounded-lg bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
          >
            Reload app
          </button>
          <a
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
          >
            Return to courses
          </a>
        </div>

        <p className="mt-6 text-xs leading-5 text-gray-500">
          Any progress already recorded to your account remains saved.
        </p>
        <a
          href="/support"
          className="mt-2 inline-block text-xs font-semibold text-brand-blue hover:underline"
        >
          Get support
        </a>
      </div>
    </main>
  );
}

function routeErrorAsError(routeError: unknown) {
  if (routeError instanceof Error) return routeError;
  if (
    routeError &&
    typeof routeError === "object" &&
    "message" in routeError &&
    typeof routeError.message === "string"
  ) {
    return new Error(routeError.message);
  }
  return new Error("Unexpected route error");
}

export function RouteErrorFallback() {
  const routeError = useRouteError();
  return (
    <AppErrorFallback
      error={routeErrorAsError(routeError)}
      onReload={() => window.location.reload()}
    />
  );
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
    console.error("[ErrorBoundary] Uncaught render error:", error);
    console.error("[ErrorBoundary] Component stack:", info.componentStack);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return <AppErrorFallback error={this.state.error} onReload={this.handleReload} />;
    }

    return this.props.children;
  }
}
