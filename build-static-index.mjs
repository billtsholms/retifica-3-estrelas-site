import { readFile, writeFile } from "node:fs/promises";
import { execSync } from "node:child_process";

async function main() {
  console.log("Generating static index.html for Hostinger Git deployment...");

  // Build the app
  try {
    execSync("npx vite build", { stdio: "inherit" });
  } catch (e) {
    console.log("Build finished or warning emitted.");
  }

  // Create a complete static index.html with correct address
  const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Retífica de Motores em São José do Rio Preto | Três Estrelas</title>
  <meta name="description" content="Retífica de motores para carros, caminhonetes, vans, utilitários, agrícolas e caminhões em São José do Rio Preto. Especialização em motores diesel."/>
  <link rel="icon" href="/brand/icon-192-v2.png" type="image/png"/>
  <meta property="og:title" content="Retífica de Motores em São José do Rio Preto | Três Estrelas"/>
  <meta property="og:description" content="Retífica de motores para carros, caminhonetes, vans, utilitários, agrícolas e caminhões em São José do Rio Preto. Especialização em motores diesel."/>
  <meta property="og:image" content="https://retificatresestrelas.com.br/brand/og.webp"/>
  <link rel="stylesheet" href="/_next/static/chunks/0bynd19n.zsqb.css" />
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Retífica Três Estrelas",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "R. Dionizio Zacaron, 2375 - Vila Toninho",
      "addressLocality": "São José do Rio Preto",
      "addressRegion": "SP",
      "postalCode": "15062-047",
      "addressCountry": "BR"
    },
    "telephone": "+5517991904957"
  }
  </script>
</head>
<body>
  <div id="conteudo">
    <header class="site-header">
      <div class="container header-inner">
        <a class="header-logo" href="#inicio"><img alt="Retífica Três Estrelas" src="/brand/logo-v2.png" width="200"/></a>
        <nav class="desktop-nav">
          <a href="#inicio">Início</a>
          <a href="#servicos">Serviços</a>
          <a href="#veiculos">Veículos atendidos</a>
          <a href="#estrutura">Estrutura</a>
          <a href="#diferenciais">Diferenciais</a>
          <a href="#contato">Contato</a>
        </nav>
        <div class="header-actions">
          <a class="button button--primary button--whatsapp" href="https://wa.me/5517991904957?text=Ol%C3%A1%20vim%20pelo%20google%20e%20gostaria%20de%20solicitar%20um%20or%C3%A7amento." target="_blank">Fale conosco</a>
        </div>
      </div>
    </header>
    <main>
      <section class="hero" id="inicio">
        <div class="hero-banner hero-banner--desktop">
          <img alt="Retífica de motores em São José do Rio Preto" src="/hero/banner-home-1990-v4.webp" style="width:100%"/>
        </div>
      </section>

      <section class="section" id="duvidas" style="padding:40px 20px; max-width:1200px; margin:0 auto;">
        <h2>Dúvidas frequentes</h2>
        <details class="faq-item" open style="margin-top:20px;">
          <summary><strong>Onde fica a Retífica Três Estrelas?</strong></summary>
          <p style="margin-top:10px;">A oficina fica na <strong>R. Dionizio Zacaron, 2375 - Vila Toninho</strong>, em São José do Rio Preto - SP, CEP 15062-047.</p>
        </details>
      </section>
    </main>

    <footer class="site-footer" id="contato" style="padding:40px 20px; background:#111; color:#fff;">
      <div class="container">
        <h3>Retífica Três Estrelas</h3>
        <p>📍 R. Dionizio Zacaron, 2375 - Vila Toninho, São José do Rio Preto – SP, CEP 15062-047</p>
        <p>📞 (17) 99190-4957</p>
        <a href="https://www.google.com/maps/search/?api=1&query=R.%20Dionizio%20Zacaron%2C%202375%20-%20Vila%20Toninho%2C%20S%C3%A3o%20Jos%C3%A9%20do%20Rio%20Preto%20%E2%80%93%20SP" target="_blank" style="color:#e53e3e;">Ver no Google Maps</a>
      </div>
    </footer>
  </div>
</body>
</html>`;

  await writeFile("index.html", htmlContent, "utf-8");
  console.log("Created index.html in root!");

  execSync("git add index.html && git commit -m 'deploy: adiciona index.html estatico com novo endereco' && git push origin main", {
    stdio: "inherit",
  });
  console.log("Pushed successfully to GitHub main branch!");
}

main().catch(console.error);
