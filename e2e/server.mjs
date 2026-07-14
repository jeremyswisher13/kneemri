import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";

const PORT = Number(process.env.PORT || 4190);
const DIST = resolve(process.cwd(), "dist");
let workerRevision = 1;

const MIME = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".webp": "image/webp",
};

function send(res, status, body, contentType = "text/plain; charset=utf-8", headers = {}) {
  res.writeHead(status, {
    "Content-Type": contentType,
    "Content-Length": Buffer.byteLength(body),
    ...headers,
  });
  res.end(body);
}

async function existingFile(pathname) {
  const candidate = resolve(DIST, `.${pathname}`);
  if (candidate !== DIST && !candidate.startsWith(`${DIST}${sep}`)) return null;
  try {
    const info = await stat(candidate);
    return info.isFile() ? candidate : null;
  } catch {
    return null;
  }
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || `127.0.0.1:${PORT}`}`);

  if (url.pathname === "/__e2e/health") {
    send(res, 200, "ok");
    return;
  }

  if (url.pathname === "/__e2e/sw-version" && req.method === "POST") {
    workerRevision += 1;
    send(res, 200, JSON.stringify({ workerRevision }), "application/json; charset=utf-8");
    return;
  }

  let file = await existingFile(decodeURIComponent(url.pathname));
  if (!file) file = resolve(DIST, "index.html");

  try {
    let body = await readFile(file);
    if (file.endsWith(`${sep}sw.js`)) {
      body = Buffer.from(
        body
          .toString("utf8")
          .replaceAll("ucla-sports-mri-v6", `ucla-sports-mri-v6-e2e-${workerRevision}`),
      );
    }
    const noStore = file.endsWith(`${sep}sw.js`) || file.endsWith(`${sep}index.html`);
    send(res, 200, body, MIME[extname(file)] || "application/octet-stream", {
      "Cache-Control": noStore ? "no-store" : "public, max-age=3600",
      ...(file.endsWith(`${sep}sw.js`) ? { "Service-Worker-Allowed": "/" } : {}),
    });
  } catch (error) {
    send(res, 500, error instanceof Error ? error.message : "Unable to serve test build");
  }
});

server.listen(PORT, "127.0.0.1", () => {
  process.stdout.write(`E2E server listening on http://127.0.0.1:${PORT}\n`);
});
