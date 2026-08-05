import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Retífica Três Estrelas",
    short_name: "Três Estrelas",
    description:
      "Retífica de motores em São José do Rio Preto com especialização em motores diesel.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    lang: "pt-BR",
    icons: [
      {
        src: "/brand/icon-192-v2.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/brand/icon-512-v2.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
