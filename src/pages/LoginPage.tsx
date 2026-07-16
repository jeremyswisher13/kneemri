import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  completeRedirectSignIn,
  signInWithApple,
  signInWithAppleRedirect,
  signInWithGoogle,
  signInWithGoogleRedirect,
} from "@/lib/auth";
import {
  browserRedirectSignInHints,
  isStandaloneDisplayMode,
  installInstructionsForUserAgent,
} from "@/lib/pwa";
import {
  consumeReturnPath,
  localLoginUrlForLocalAuthHost,
  rememberReturnPath,
  returnPathFromLocation,
  shouldUseRedirectSignIn,
} from "@/lib/login-return";
import {
  authErrorCode,
  redirectSignInErrorMessage,
  signInErrorMessage,
  type SignInProvider,
} from "@/lib/auth-error-message";
import {
  canEnableAppReviewDemo,
  enableAppReviewDemoAuth,
  enableLocalPreviewAuth,
  isLocalPreviewHost,
} from "@/lib/local-preview-auth";
import { useCallback, useEffect, useRef, useState } from "react";
import PageLoader from "@/components/ui/PageLoader";

const providerLabels: Record<SignInProvider, string> = {
  google: "Google",
  apple: "Apple",
};

function returnDestinationLabel(returnTo: string): string {
  if (returnTo === "/" || returnTo.trim() === "") return "your course dashboard";
  if (returnTo.includes("/admin")) return "the admin dashboard";
  if (returnTo.includes("/normal-")) return "the MRI workstation";
  if (returnTo.includes("/review")) return "spaced review";
  if (returnTo.includes("/cases")) return "the case you opened";
  if (returnTo.includes("/modules")) return "the module you opened";
  if (returnTo.includes("/courses/")) return "your course";
  return "where you left off";
}

function noticeFromLocationState(state: unknown): string | null {
  if (!state || typeof state !== "object" || !("notice" in state)) return null;
  const notice = (state as { notice?: unknown }).notice;
  return typeof notice === "string" && notice.trim() ? notice : null;
}

function shouldUseRedirectFallback(err: unknown): boolean {
  const code = authErrorCode(err);
  return (
    code === "auth/popup-blocked" ||
    code === "auth/cancelled-popup-request" ||
    code === "auth/operation-not-supported-in-this-environment"
  );
}

export default function LoginPage() {
  const { user, loading, setRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = returnPathFromLocation(location.state, location.search);
  const [error, setError] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);
  const [activeProvider, setActiveProvider] = useState<SignInProvider | null>(null);
  const [fallbackProvider, setFallbackProvider] = useState<SignInProvider>("google");
  const [checkingRedirect, setCheckingRedirect] = useState(true);
  const [canonicalizingLocalHost, setCanonicalizingLocalHost] = useState(false);
  const [standaloneMode] = useState(() => isStandaloneDisplayMode());
  const localPreviewAvailable =
    typeof window !== "undefined" && isLocalPreviewHost(window.location.href);
  const appReviewDemoAvailable =
    typeof window !== "undefined" && canEnableAppReviewDemo(window.location.href, sessionStorage);
  const notice = noticeFromLocationState(location.state);
  const installInstructions =
    typeof navigator === "undefined"
      ? ""
      : installInstructionsForUserAgent(navigator.userAgent, navigator.platform, navigator.maxTouchPoints);
  const returnDestination = returnDestinationLabel(returnTo);

  useEffect(() => {
    const targetUrl =
      typeof window === "undefined"
        ? null
        : localLoginUrlForLocalAuthHost(window.location.href, returnTo);
    if (!targetUrl) return;

    setCanonicalizingLocalHost(true);
    window.location.replace(targetUrl);
  }, [returnTo]);

  // Both the redirect-completion effect and the "already signed in" effect below
  // can navigate away from /login; this guard ensures the navigation (and the
  // consumeReturnPath side effect) happens exactly once.
  const hasNavigatedRef = useRef(false);
  const navigateToReturn = useCallback(() => {
    if (hasNavigatedRef.current) return;
    hasNavigatedRef.current = true;
    navigate(consumeReturnPath(sessionStorage, returnTo), { replace: true });
  }, [navigate, returnTo]);

  useEffect(() => {
    let cancelled = false;
    async function completeRedirect() {
      try {
        const result = await completeRedirectSignIn();
        if (!result || cancelled) return;
        setRole(result.role);
        navigateToReturn();
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to finish sign-in");
        }
      } finally {
        if (!cancelled) setCheckingRedirect(false);
      }
    }
    completeRedirect();
    return () => {
      cancelled = true;
    };
  }, [navigate, returnTo, setRole, navigateToReturn]);

  useEffect(() => {
    if (!checkingRedirect && !loading && user) {
      navigateToReturn();
    }
  }, [checkingRedirect, user, loading, navigate, returnTo, navigateToReturn]);

  async function handleProviderSignIn(provider: SignInProvider) {
    setError(null);
    setSigningIn(true);
    setActiveProvider(provider);
    setFallbackProvider(provider);
    rememberReturnPath(sessionStorage, returnTo);
    try {
      if (
        typeof window !== "undefined" &&
        shouldUseRedirectSignIn(window.location.href, browserRedirectSignInHints())
      ) {
        await signInWithProviderRedirect(provider);
        return;
      }

      const { role } =
        provider === "apple"
          ? await signInWithApple()
          : await signInWithGoogle();
      // Set the role directly — avoids race with onAuthStateChanged
      setRole(role);
      navigateToReturn();
    } catch (err: unknown) {
      // In an INSTALLED standalone PWA the redirect fallback is the exact path
      // shouldUseRedirectSignIn deliberately avoids (see login-return.ts): the
      // Google + firebaseapp.com hop breaks out to Safari — a separate storage
      // context — so the credential never returns to the app and the user
      // dead-ends back at /login. A blocked/unsupported popup here must surface
      // an actionable message instead of a redirect that cannot complete.
      if (shouldUseRedirectFallback(err) && standaloneMode) {
        setError(
          "The sign-in window was blocked. Allow pop-ups for this app, or open the course in Safari to sign in.",
        );
      } else if (shouldUseRedirectFallback(err)) {
        try {
          await signInWithProviderRedirect(provider);
          return;
        } catch (redirectErr: unknown) {
          setError(redirectSignInErrorMessage(redirectErr, provider));
        }
      } else {
        setError(signInErrorMessage(err, provider));
      }
    } finally {
      setSigningIn(false);
      setActiveProvider(null);
    }
  }

  async function signInWithProviderRedirect(provider: SignInProvider) {
    if (provider === "apple") {
      await signInWithAppleRedirect();
      return;
    }
    await signInWithGoogleRedirect();
  }

  async function handleRedirectSignIn() {
    setError(null);
    setSigningIn(true);
    setActiveProvider(fallbackProvider);
    rememberReturnPath(sessionStorage, returnTo);
    try {
      await signInWithProviderRedirect(fallbackProvider);
    } catch (err: unknown) {
      setError(redirectSignInErrorMessage(err, fallbackProvider));
      setSigningIn(false);
      setActiveProvider(null);
    }
  }

  function handleLocalPreviewSignIn() {
    setError(null);
    setSigningIn(true);
    enableLocalPreviewAuth(sessionStorage);
    window.location.assign(returnTo);
  }

  function handleAppReviewDemoSignIn() {
    setError(null);
    setSigningIn(true);
    enableAppReviewDemoAuth(sessionStorage);
    window.location.assign(returnTo);
  }

  if (canonicalizingLocalHost || loading || checkingRedirect) {
    return <PageLoader fullHeight label="Preparing sign-in..." />;
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-6 sm:py-12">
      <div className="w-full max-w-lg">
        <div className="mb-6 text-center sm:mb-8">
          <img
            src="/pwa-icon-192.png"
            alt=""
            className="mx-auto mb-4 h-16 w-16 rounded-[18px] shadow-sm ring-1 ring-black/5"
          />
          <h1 className="text-2xl font-bold text-ucla-dark">UCLA Sports MRI Courses</h1>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-600">
            Sign in once, then resume the MRI workstation, cases, and review from the home-screen app.
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-lg ring-1 ring-black/5 sm:p-8">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-gray-900">Sign in</h2>
            <p className="mt-1 text-sm text-gray-500">
              After sign-in, you&apos;ll return to {returnDestination}.
            </p>
          </div>

          {notice && (
            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800" role="status">
              {notice}
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200" role="alert">
              {error}
            </div>
          )}

          <button
            onClick={() => handleProviderSignIn("google")}
            disabled={signingIn}
            className="flex min-h-12 w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 text-base font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-ucla-blue/50 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
          >
            <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            {signingIn && activeProvider === "google" ? "Signing in..." : "Sign in with Google"}
          </button>

          <button
            onClick={() => handleProviderSignIn("apple")}
            disabled={signingIn}
            className="mt-3 flex min-h-12 w-full items-center justify-center gap-3 rounded-lg bg-black px-4 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/40 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
          >
            <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M16.37 1.51c0 1.15-.42 2.17-1.25 3.04-.93.97-2 1.53-3.18 1.44-.12-1.1.45-2.25 1.21-3.05.84-.88 2.28-1.55 3.22-1.43ZM20.77 17.08c-.48 1.1-.7 1.59-1.31 2.56-.85 1.31-2.04 2.95-3.52 2.97-1.31.01-1.65-.86-3.43-.85-1.78.01-2.15.87-3.47.85-1.48-.02-2.61-1.49-3.46-2.8-2.43-3.76-2.68-8.17-1.18-10.52 1.07-1.67 2.75-2.65 4.34-2.65 1.62 0 2.64.87 3.98.87 1.3 0 2.09-.87 3.97-.87 1.42 0 2.92.77 3.98 2.1-3.49 1.91-2.92 6.88.1 8.34Z" />
            </svg>
            {signingIn && activeProvider === "apple" ? "Signing in..." : "Sign in with Apple"}
          </button>

          <p className="mt-4 text-center text-xs leading-5 text-gray-500">
            Use the same account each time so your course progress follows you across devices.
          </p>

          {standaloneMode && (
            <div className="mt-4 rounded-lg border border-ucla-blue/20 bg-ucla-light/50 px-4 py-3 text-xs leading-5 text-gray-600">
              Home-screen mode keeps sign-in in the installed app and brings you back to the page you opened.
              <span className="mt-1 block font-medium text-[#003B5C]">{installInstructions}</span>
            </div>
          )}
          {!standaloneMode && installInstructions && (
            <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-xs leading-5 text-gray-600">
              For the cleanest mobile experience, add this course to your home screen after first sign-in.
              <span className="mt-1 block font-medium text-gray-700">{installInstructions}</span>
            </div>
          )}

          {localPreviewAvailable && (
            <button
              onClick={handleLocalPreviewSignIn}
              disabled={signingIn}
              className="mt-4 min-h-11 w-full rounded-lg border border-ucla-blue/30 bg-ucla-light px-4 py-2 text-sm font-semibold text-ucla-dark transition-colors hover:bg-ucla-light/70 focus:outline-none focus:ring-2 focus:ring-ucla-blue/50 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Continue in local preview
            </button>
          )}

          {appReviewDemoAvailable && (
            <button
              onClick={handleAppReviewDemoSignIn}
              disabled={signingIn}
              className="mt-4 min-h-11 w-full rounded-lg border border-[#003B5C]/30 bg-[#F4F8FB] px-4 py-2 text-sm font-semibold text-[#003B5C] transition-colors hover:bg-[#E8F1F7] focus:outline-none focus:ring-2 focus:ring-ucla-blue/50 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Continue in App Review demo
            </button>
          )}

          {error && (
            <button
              onClick={handleRedirectSignIn}
              disabled={signingIn}
              className="mt-4 min-h-11 w-full rounded-lg border border-ucla-blue/30 bg-ucla-light px-4 py-2 text-sm font-semibold text-ucla-dark transition-colors hover:bg-ucla-light/70 focus:outline-none focus:ring-2 focus:ring-ucla-blue/50 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Continue with full-page {providerLabels[fallbackProvider]} sign-in
            </button>
          )}
        </div>
        <p className="mx-auto mt-4 max-w-sm text-center text-xs leading-5 text-gray-500">
          Educational training only. This app does not diagnose, treat, or replace clinical judgment.
        </p>
      </div>
    </div>
  );
}
