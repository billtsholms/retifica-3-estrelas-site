import assert from "node:assert/strict";
import test from "node:test";
import { writeFile, cp, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the production landing page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(
    html,
    /Retífica de motores com padrão premium desde 1990\./,
  );
  assert.match(html, /Veículos atendidos/);
  assert.match(html, /Serviços especializados/);
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /5517991904957/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/);

  // Write static index.html into dist/client and RETIFICA-HOSTINGER-PRONTO
  const projectRoot = process.cwd();
  const distClient = resolve(projectRoot, "dist", "client");
  const hostingerExportDir = resolve(projectRoot, "RETIFICA-HOSTINGER-PRONTO");

  console.log("Saving index.html to:", hostingerExportDir);
  await rm(hostingerExportDir, { recursive: true, force: true }).catch(() => {});
  await mkdir(hostingerExportDir, { recursive: true });

  await cp(distClient, hostingerExportDir, { recursive: true });
  await cp(resolve(projectRoot, "hostinger"), hostingerExportDir, { recursive: true });
  await writeFile(resolve(hostingerExportDir, "index.html"), html, "utf-8");
  await writeFile(resolve(distClient, "index.html"), html, "utf-8");
  console.log("Hostinger static package exported successfully!");
});

test("renders SEO metadata routes", async () => {
  const [robots, sitemap, manifest] = await Promise.all([
    render("/robots.txt"),
    render("/sitemap.xml"),
    render("/manifest.webmanifest"),
  ]);

  assert.equal(robots.status, 200);
  assert.equal(sitemap.status, 200);
  assert.equal(manifest.status, 200);
});
