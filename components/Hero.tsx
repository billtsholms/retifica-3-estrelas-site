import Image from "next/image";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export function Hero() {
  return (
    <section className="hero" id="inicio" aria-labelledby="hero-title">
      <h1 className="sr-only" id="hero-title">
        Retífica de motores com padrão premium desde 1991.
      </h1>
      <div className="hero-banner">
        <Image
          src="/hero/banner-home.webp"
          alt="Retífica de motores com padrão premium desde 1991, com atendimento em São José do Rio Preto"
          fill
          sizes="100vw"
          priority
          unoptimized
        />
        <a
          className="hero-banner-hotspot hero-banner-hotspot--primary"
          href={getWhatsAppUrl("hero-banner")}
          target="_blank"
          rel="noreferrer"
          aria-label="Solicitar avaliação pelo WhatsApp"
        >
          <span className="sr-only">Solicitar avaliação</span>
        </a>
        <a
          className="hero-banner-hotspot hero-banner-hotspot--secondary"
          href="#servicos"
          aria-label="Conhecer os serviços"
        >
          <span className="sr-only">Conhecer serviços</span>
        </a>
      </div>
    </section>
  );
}
