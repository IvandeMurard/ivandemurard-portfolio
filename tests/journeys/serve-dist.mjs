// A static server for dist/ that behaves like the site's host: a file if there is one, else the folder's index.html
// (so /atherix, /journeys and /rose-design-lab serve their redirect stubs, which keep the hash), else the single-page
// shell. `vite preview` skips the middle step: it would send /atherix to the SPA and its React redirect, which drops the hash.
//
//   node tests/journeys/serve-dist.mjs [port]
import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";

const DIST = resolve("dist");
const PORT = Number(process.argv[2] ?? process.env.PW_PORT ?? 4173);
const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp",
  ".ico": "image/x-icon", ".md": "text/markdown; charset=utf-8", ".txt": "text/plain; charset=utf-8", ".xml": "application/xml",
  ".pdf": "application/pdf", ".mp3": "audio/mpeg", ".woff2": "font/woff2", ".woff": "font/woff",
};

const isFile = (p) => existsSync(p) && statSync(p).isFile();

createServer((req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  let rel = normalize(decodeURIComponent(url.pathname)).replace(/^([/\\])+/, "");
  if (rel.startsWith("..")) { res.writeHead(403).end(); return; }
  let file = join(DIST, rel);
  if (!isFile(file)) file = join(DIST, rel, "index.html");
  if (!isFile(file)) file = join(DIST, "index.html"); // the single-page fallback
  const body = readFileSync(file);
  const range = req.headers.range && TYPES[extname(file)]?.startsWith("audio") ? /bytes=(\d*)-(\d*)/.exec(req.headers.range) : null;
  if (range) {
    const start = Number(range[1] || 0);
    const end = range[2] ? Number(range[2]) : body.length - 1;
    res.writeHead(206, { "Content-Type": TYPES[extname(file)], "Accept-Ranges": "bytes", "Content-Range": `bytes ${start}-${end}/${body.length}`, "Content-Length": end - start + 1 });
    res.end(body.subarray(start, end + 1));
    return;
  }
  res.writeHead(200, { "Content-Type": TYPES[extname(file)] ?? "application/octet-stream", "Accept-Ranges": "bytes" });
  res.end(body);
}).listen(PORT, "127.0.0.1", () => console.log(`dist served on http://127.0.0.1:${PORT}`));
