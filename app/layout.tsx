import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const title = "Retífica de Motores em São José do Rio Preto | Três Estrelas";
const description =
  "Retífica de motores para carros, caminhonetes, vans, utilitários, agrícolas e caminhões em São José do Rio Preto. Especialização em motores diesel.";

export async function generateMetadata(): Promise<Metadata> {
  const headerList = await headers();
  const host = headerList.get("host") ?? "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const metadataBase = new URL(`${protocol}://${host}`);

  return {
    metadataBase,
    title,
    description,
    alternates: { canonical: "/" },
    applicationName: "Retífica Três Estrelas",
    category: "automotive",
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url: "/",
      siteName: "Retífica Três Estrelas",
      title,
      description,
      images: [
        {
          url: "/brand/og.webp",
          width: 1200,
          height: 630,
          alt: "Fachada da Retífica Três Estrelas em São José do Rio Preto",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/brand/og.webp"],
    },
    icons: {
      icon: [
        { url: "/brand/icon-192.png", type: "image/png", sizes: "192x192" },
      ],
      apple: [
        { url: "/brand/icon-192.png", type: "image/png", sizes: "192x192" },
      ],
    },
    manifest: "/manifest.webmanifest",
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${manrope.variable} ${inter.variable}`}>
        <a className="skip-link" href="#conteudo">
          Ir para o conteúdo
        </a>
        <div id="conteudo">{children}</div>
      </body>
    </html>
  );
}
