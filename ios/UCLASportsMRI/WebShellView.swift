import SwiftUI
import WebKit

private enum WebApp {
    static let baseURL = "https://ucla-knee-mri.firebaseapp.com"

    static var initialURL: URL {
        appURL(for: debugLaunchPath ?? (appReviewDemoEnabled ? "/login" : "/"))
    }

    static var appReviewDemoEnabled: Bool {
        #if DEBUG
        return true
        #else
        return Bundle.main.appStoreReceiptURL?.lastPathComponent == "sandboxReceipt"
        #endif
    }

    static var debugLaunchPath: String? {
        #if DEBUG
        let args = ProcessInfo.processInfo.arguments
        guard let index = args.firstIndex(of: "--ucla-sports-mri-path"),
              args.indices.contains(index + 1) else {
            return nil
        }
        return sanitizedLaunchPath(args[index + 1])
        #else
        return nil
        #endif
    }

    static var debugScreenshotDemoEnabled: Bool {
        #if DEBUG
        return ProcessInfo.processInfo.arguments.contains("--ucla-sports-mri-screenshot-demo")
        #else
        return false
        #endif
    }

    static func sanitizedLaunchPath(_ value: String) -> String? {
        let path = value.trimmingCharacters(in: .whitespacesAndNewlines)
        guard path.hasPrefix("/"), !path.hasPrefix("//"), !path.contains("://") else {
            return nil
        }
        return path
    }

    static func appURL(for path: String) -> URL {
        var components = URLComponents(string: baseURL)!
        let route = URLComponents(string: path)
        components.path = route?.path.isEmpty == false ? route!.path : "/"
        var queryItems = route?.queryItems ?? []
        setQueryItem(name: "source", value: "ios-app", in: &queryItems)
        if appReviewDemoEnabled {
            setQueryItem(name: "reviewerDemo", value: "1", in: &queryItems)
        }
        components.queryItems = queryItems
        components.fragment = route?.fragment
        return components.url!
    }

    static func setQueryItem(name: String, value: String, in queryItems: inout [URLQueryItem]) {
        if let index = queryItems.firstIndex(where: { $0.name == name }) {
            queryItems[index].value = value
            return
        }
        queryItems.append(URLQueryItem(name: name, value: value))
    }

    static var nativeShellScript: String {
        var script = #"""
    window.UCLASportsMRIiOS = true;
    """#
        if debugScreenshotDemoEnabled {
            script += #"""

    window.sessionStorage.setItem("appReviewDemoAuth", "1");
    """#
        }
        return script
    }

    static var installUiScript: String {
        var script = #"""
    (function () {
      function shouldHideInstallUI(element) {
        var text = (element.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
        return text === "install app" ||
          text.indexOf("use this like an app") !== -1 ||
          text.indexOf("add ucla sports mri to your home screen") !== -1;
      }

      function hideInstallUI() {
        document.querySelectorAll("button, section").forEach(function (element) {
          if (shouldHideInstallUI(element)) {
            element.style.display = "none";
          }
        });
      }

      hideInstallUI();
      document.addEventListener("DOMContentLoaded", hideInstallUI);
      new MutationObserver(hideInstallUI).observe(document.documentElement, {
        childList: true,
        subtree: true
      });
    })();
    """#
        if debugScreenshotDemoEnabled {
            script += #"""

    (function () {
      function screenshotFocusValue() {
        try {
          return new URLSearchParams(window.location.search).get("screenshotFocus");
        } catch (error) {
          return "";
        }
      }

      function focusMriScreenshotAnchor() {
        var focus = screenshotFocusValue();
        if (focus !== "mri" && focus !== "mri-deep") return false;
        var target = document.querySelector('[data-screenshot-anchor="mri-viewer"]');
        if (!target) {
          if (window.innerWidth < 700) {
            var top = focus === "mri-deep"
              ? Math.max(1320, Math.round(window.innerHeight * 1.65))
              : Math.max(900, Math.round(window.innerHeight * 1.15));
            window.scrollTo({ top: top, behavior: "instant" });
            return true;
          }
          return false;
        }
        target.scrollIntoView({ block: "center", inline: "nearest" });
        return true;
      }

      var attempts = 0;
      var timer = window.setInterval(function () {
        attempts += 1;
        var focused = focusMriScreenshotAnchor();
        if (focused || attempts >= 12) window.clearInterval(timer);
      }, 450);
      window.addEventListener("load", function () {
        window.setTimeout(focusMriScreenshotAnchor, 700);
      });
    })();
    """#
        }
        return script
    }

    static let allowedHosts: Set<String> = [
        "ucla-knee-mri.firebaseapp.com",
        "ucla-knee-mri.web.app",
        "accounts.google.com",
        "appleid.apple.com",
        "www.google.com",
    ]
    static let allowedHostSuffixes = [
        ".firebaseapp.com",
        ".web.app",
        ".google.com",
        ".gstatic.com",
        ".googleusercontent.com",
        ".apple.com",
    ]

    static func shouldLoadInShell(_ url: URL) -> Bool {
        guard let scheme = url.scheme?.lowercased(), ["http", "https"].contains(scheme) else {
            return true
        }
        guard let host = url.host?.lowercased() else {
            return false
        }
        if allowedHosts.contains(host) {
            return true
        }
        return allowedHostSuffixes.contains { host.hasSuffix($0) }
    }
}

struct WebShellView: View {
    @State private var isLoading = true
    @State private var loadError: String?
    @State private var reloadToken = 0

    var body: some View {
        ZStack {
            WebAppView(
                url: WebApp.initialURL,
                reloadToken: reloadToken,
                isLoading: $isLoading,
                loadError: $loadError
            )
            .ignoresSafeArea(.keyboard)

            if isLoading {
                ProgressView()
                    .controlSize(.large)
                    .padding(18)
                    .background(.regularMaterial, in: RoundedRectangle(cornerRadius: 14))
                    .accessibilityLabel("Loading UCLA Sports MRI")
            }

            if let loadError {
                VStack(spacing: 12) {
                    Image(systemName: "wifi.exclamationmark")
                        .font(.system(size: 34, weight: .semibold))
                        .foregroundStyle(Color(red: 0.0, green: 0.33, blue: 0.53))
                    Text("Unable to load UCLA Sports MRI")
                        .font(.headline)
                    Text(loadError)
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                        .multilineTextAlignment(.center)
                    Button("Try Again") {
                        self.loadError = nil
                        self.isLoading = true
                        self.reloadToken += 1
                    }
                    .buttonStyle(.borderedProminent)
                    .tint(Color(red: 0.0, green: 0.33, blue: 0.53))
                }
                .padding(22)
                .frame(maxWidth: 340)
                .background(.regularMaterial, in: RoundedRectangle(cornerRadius: 18))
                .padding()
            }
        }
        .background(Color(red: 0.96, green: 0.96, blue: 0.96))
    }
}

struct WebAppView: UIViewRepresentable {
    let url: URL
    let reloadToken: Int
    @Binding var isLoading: Bool
    @Binding var loadError: String?

    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }

    func makeUIView(context: Context) -> WKWebView {
        let configuration = WKWebViewConfiguration()
        configuration.defaultWebpagePreferences.allowsContentJavaScript = true
        configuration.allowsInlineMediaPlayback = true
        configuration.websiteDataStore = .default()
        configuration.applicationNameForUserAgent = "UCLASportsMRIiOS"
        configuration.userContentController.addUserScript(
            WKUserScript(
                source: WebApp.nativeShellScript,
                injectionTime: .atDocumentStart,
                forMainFrameOnly: false
            )
        )
        configuration.userContentController.addUserScript(
            WKUserScript(
                source: WebApp.installUiScript,
                injectionTime: .atDocumentEnd,
                forMainFrameOnly: false
            )
        )

        let webView = WKWebView(frame: .zero, configuration: configuration)
        webView.navigationDelegate = context.coordinator
        webView.uiDelegate = context.coordinator
        webView.allowsBackForwardNavigationGestures = true
        webView.scrollView.contentInsetAdjustmentBehavior = .automatic
        webView.scrollView.backgroundColor = UIColor(red: 0.96, green: 0.96, blue: 0.96, alpha: 1)
        webView.backgroundColor = webView.scrollView.backgroundColor
        context.coordinator.loadInitialURL(in: webView, url: url)
        return webView
    }

    func updateUIView(_ webView: WKWebView, context: Context) {
        if context.coordinator.reloadToken != reloadToken {
            context.coordinator.reloadToken = reloadToken
            context.coordinator.loadInitialURL(in: webView, url: url)
            return
        }
        if loadError == nil, webView.url == nil, !webView.isLoading {
            context.coordinator.loadInitialURL(in: webView, url: url)
        }
    }

    final class Coordinator: NSObject, WKNavigationDelegate, WKUIDelegate {
        private let parent: WebAppView
        var reloadToken: Int

        init(_ parent: WebAppView) {
            self.parent = parent
            self.reloadToken = parent.reloadToken
        }

        func loadInitialURL(in webView: WKWebView, url: URL) {
            webView.load(URLRequest(url: url, cachePolicy: .reloadIgnoringLocalCacheData, timeoutInterval: 30))
        }

        func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
            parent.isLoading = true
            parent.loadError = nil
        }

        func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
            parent.isLoading = false
            parent.loadError = nil
        }

        func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
            parent.isLoading = false
            parent.loadError = error.localizedDescription
        }

        func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
            parent.isLoading = false
            parent.loadError = error.localizedDescription
        }

        func webView(
            _ webView: WKWebView,
            decidePolicyFor navigationAction: WKNavigationAction,
            decisionHandler: @escaping (WKNavigationActionPolicy) -> Void
        ) {
            guard let url = navigationAction.request.url else {
                decisionHandler(.allow)
                return
            }

            if let scheme = url.scheme, ["mailto", "tel"].contains(scheme) {
                UIApplication.shared.open(url)
                decisionHandler(.cancel)
                return
            }

            if navigationAction.targetFrame == nil {
                if WebApp.shouldLoadInShell(url) {
                    webView.load(URLRequest(url: url))
                } else {
                    UIApplication.shared.open(url)
                }
                decisionHandler(.cancel)
                return
            }

            if !WebApp.shouldLoadInShell(url) {
                UIApplication.shared.open(url)
                decisionHandler(.cancel)
                return
            }

            decisionHandler(.allow)
        }

        func webView(
            _ webView: WKWebView,
            createWebViewWith configuration: WKWebViewConfiguration,
            for navigationAction: WKNavigationAction,
            windowFeatures: WKWindowFeatures
        ) -> WKWebView? {
            if navigationAction.targetFrame == nil, let url = navigationAction.request.url {
                webView.load(URLRequest(url: url))
            }
            return nil
        }
    }
}
