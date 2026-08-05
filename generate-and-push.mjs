import { spawn } from "node:child_process";
import { writeFile } from "node:fs/promises";
import { execSync } from "node:child_process";

async function run() {
  console.log("Starting dev server to render index.html...");
  const devProcess = spawn("npx", ["vinext", "dev", "--port", "3888"], {
    stdio: "pipe",
    env: { ...process.env, PORT: "3888" },
  });

  // Wait 4 seconds for server to start
  await new Promise((r) => setTimeout(r, 4000));

  try {
    const res = await fetch("http://localhost:3888");
    let html = await res.text();
    
    // Replace address in HTML
    html = html.replaceAll(
      "Av. Dr. Aniloel Nazareth, 2375",
      "R. Dionizio Zacaron, 2375 - Vila Toninho"
    );

    await writeFile("index.html", html, "utf-8");
    console.log("Rendered index.html successfully!");

    devProcess.kill();

    execSync("git add index.html && git commit -m 'deploy: index.html estatico para Hostinger' && git push origin main", {
      stdio: "inherit",
    });
    console.log("Pushed static index.html to GitHub main branch!");
  } catch (err) {
    console.error("Error rendering or pushing:", err);
    devProcess.kill();
  }
}

run();
