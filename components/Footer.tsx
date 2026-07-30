import { Camera, Clock3, MapPin, MessageCircle, Phone } from "lucide-react";
import Image from "next/image";
import { siteConfig } from "@/data/site";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export function Footer() {
  return (
    <footer className="site-footer" id="contato">
      <div className="container footer-main">
        <div className="footer-brand">
          <Image
            src="/brand/logo.webp"
            alt="Retífica Três Estrelas"
            width={420}
            height={420}
            unoptimized
          />
          <p>
            Retífica de motores em São José do Rio Preto, com especialização
            técnica em motores diesel.
          </p>
        </div>

        <div className="footer-column">
          <h2>Contato</h2>
          <ul className="footer-list">
            <li>
              <a href={`tel:+${siteConfig.whatsapp.number}`}>
                <Phone size={16} aria-hidden="true" />
                {siteConfig.whatsapp.display}
              </a>
            </li>
            <li>
              <a
                href={getWhatsAppUrl("rodape")}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle size={16} aria-hidden="true" />
                Falar pelo WhatsApp
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-column">
          <h2>Endereço</h2>
          <ul className="footer-list">
            <li>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${siteConfig.address.street}, ${siteConfig.address.city}`,
                )}`}
                target="_blank"
                rel="noreferrer"
              >
                <MapPin size={17} aria-hidden="true" />
                <span>
                  {siteConfig.address.street}
                  <br />
                  {siteConfig.address.city}
                </span>
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-column">
          <h2>Atendimento</h2>
          <ul className="footer-list">
            <li>
              <Clock3 size={16} aria-hidden="true" /> Horário: confirmar com a empresa
            </li>
            <li>
              <a href={siteConfig.instagram.url} target="_blank" rel="noreferrer">
                <Camera size={16} aria-hidden="true" />
                {siteConfig.instagram.handle}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} Retífica Três Estrelas. Todos os direitos
          reservados.
        </span>
        <details className="privacy-details" id="privacidade">
          <summary>Política de privacidade</summary>
          <p>
            Este site não possui formulário próprio de coleta. Ao iniciar uma
            conversa pelo WhatsApp, as informações enviadas são tratadas no canal de
            atendimento para responder à sua solicitação.
          </p>
        </details>
      </div>
    </footer>
  );
}
