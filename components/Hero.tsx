import Image from "next/image";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export function Hero() {
  return (
    <section className="hero" id="inicio" aria-labelledby="hero-title">
      <h1 className="sr-only" id="hero-title">
        Retífica de motores em São José do Rio Preto com padrão premium desde
        1990.
      </h1>
      <div className="hero-banner hero-banner--desktop">
        <Image
          src="/hero/banner-home-1990-v4.webp"
          alt="Retífica de motores com padrão premium desde 1990, com atendimento em São José do Rio Preto"
          fill
          sizes="100vw"
          priority
          unoptimized
        />
        <a
          className="hero-banner-hotspot hero-banner-hotspot--primary"
          href={getWhatsAppUrl("hero-banner")}
          data-whatsapp-source="hero-banner"
          target="_blank"
          rel="noreferrer"
          aria-label="Fale conosco pelo WhatsApp"
        >
          <span className="sr-only">Fale conosco</span>
        </a>
      </div>
      <div className="hero-banner hero-banner--mobile">
        <Image
          src="/hero/banner-mobile-1990-v4.webp"
          alt="Retífica de motores com padrão premium desde 1990, especializada em motores diesel em São José do Rio Preto"
          fill
          sizes="(max-width: 900px) 100vw, 0px"
          priority
          unoptimized
        />
        <a
          className="hero-banner-hotspot hero-banner-hotspot--primary"
          href={getWhatsAppUrl("hero-banner-mobile")}
          data-whatsapp-source="hero-banner-mobile"
          target="_blank"
          rel="noreferrer"
          aria-label="Fale conosco pelo WhatsApp"
        >
          <span className="sr-only">Fale conosco</span>
        </a>
      </div>
    </section>
  );
}
