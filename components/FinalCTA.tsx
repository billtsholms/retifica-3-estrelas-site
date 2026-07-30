import { Check, MessageCircle } from "lucide-react";
import Image from "next/image";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export function FinalCTA() {
  return (
    <section className="final-cta" aria-labelledby="final-cta-title">
      <div className="container final-cta-shell">
        <div className="final-cta-copy">
          <span className="final-cta-eyebrow">Pronto para cuidar do seu motor?</span>
          <h2 id="final-cta-title">Seu veículo merece uma retífica à altura.</h2>
          <p>
            Confiança, tecnologia e experiência para entregar o melhor resultado.
          </p>
          <div className="final-cta-points" aria-label="Tipos de atendimento">
            <span>
              <Check size={15} aria-hidden="true" /> Veículos leves
            </span>
            <span>
              <Check size={15} aria-hidden="true" /> Utilitários e pesados
            </span>
            <span>
              <Check size={15} aria-hidden="true" /> Especialização em diesel
            </span>
          </div>
          <a
            className="button button--primary"
            href={getWhatsAppUrl("chamada-final")}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={19} aria-hidden="true" />
            Fale conosco
          </a>
        </div>
        <div className="final-cta-image">
          <Image
            src="/fachada/fachada-2.webp"
            alt="Fachada da Retífica Três Estrelas"
            fill
            sizes="(max-width: 680px) 100vw, 62vw"
            unoptimized
          />
        </div>
      </div>
    </section>
  );
}
