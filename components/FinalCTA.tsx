import Image from "next/image";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export function FinalCTA() {
  return (
    <section className="final-cta" aria-labelledby="final-cta-title">
      <h2 className="sr-only" id="final-cta-title">
        Seu veículo merece uma retífica à altura
      </h2>
      <div className="container">
        <div className="final-banner">
          <Image
            src="/banner-final.jpg"
            alt="Seu veículo merece uma retífica à altura. Atendimento para veículos leves, utilitários, pesados e motores diesel."
            fill
            sizes="(max-width: 680px) calc(100vw - 28px), 1180px"
            unoptimized
          />
          <a
            className="final-banner-hotspot"
            href={getWhatsAppUrl("chamada-final")}
            target="_blank"
            rel="noreferrer"
            aria-label="Fale conosco pelo WhatsApp"
          >
            <span className="sr-only">Fale conosco</span>
          </a>
        </div>
      </div>
    </section>
  );
}
