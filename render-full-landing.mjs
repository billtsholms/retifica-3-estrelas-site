import { writeFile } from "node:fs/promises";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

async function renderFull() {
  console.log("Rendering full landing page HTML via Cloudflare worker fetch...");

  const workerUrl = new URL("./dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("t", `${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
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
    }
  );

  let html = await response.text();

  // Replace address strings & CEP
  html = html.replaceAll(
    "Av. Dr. Aniloel Nazareth, 2375, em São José do Rio Preto, São Paulo.",
    "R. Dionizio Zacaron, 2375 - Vila Toninho, em São José do Rio Preto - SP, CEP 15077-010."
  );

  html = html.replaceAll(
    "15062-047",
    "15077-010"
  );

  html = html.replaceAll(
    "Av. Dr. Aniloel Nazareth, 2375",
    "R. Dionizio Zacaron, 2375 - Vila Toninho"
  );

  html = html.replaceAll(
    "Av.%20Dr.%20Aniloel%20Nazareth%2C%202375",
    "R.%20Dionizio%20Zacaron%2C%202375%20-%20Vila%20Toninho"
  );

  await writeFile("index.html", html, "utf-8");
  console.log(`SUCCESS! Generated full index.html (${html.length} bytes)!`);

  // Copy dist/client files to root so CSS and images work
  execSync("cp -r dist/client/* . 2>/dev/null || true");
  
  // Also copy hostinger config files (.htaccess, etc)
  execSync("cp -r hostinger/* . 2>/dev/null || true; cp hostinger/.htaccess . 2>/dev/null || true");

  console.log("Committing and force pushing full site bundle to GitHub...");
  execSync("git add . && git commit -m 'deploy: site completo com todas as secoes hero servicos diferenciais faq e novo endereco' && git push origin main --force", {
    stdio: "inherit",
  });

  console.log("FULL_SITE_PUSHED_SUCCESSFULLY!");
}

renderFull().catch((err) => {
  console.error("Error rendering full landing:", err);
  process.exit(1);
});
