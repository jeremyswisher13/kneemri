import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
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
    console.error("[ErrorBoundary] Uncaught render error:", error);
    console.error("[ErrorBoundary] Component stack:", info.componentStack);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
          <div className="w-full max-w-md text-center">
            {/* UCLA branding bar */}
            <div className="mx-auto mb-6 h-1.5 w-24 rounded-full bg-ucla-blue" />

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Something went wrong
            </h1>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              An unexpected error occurred. Your progress has been saved. Please
              reload the page to continue.
            </p>

            <button
              onClick={this.handleReload}
              className="inline-flex items-center gap-2 rounded-lg bg-ucla-blue px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-ucla-blue/50 focus:ring-offset-2"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182"
                />
              </svg>
              Reload
            </button>

            <p className="mt-8 text-xs text-gray-300">
              UCLA Sports MRI Courses
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
