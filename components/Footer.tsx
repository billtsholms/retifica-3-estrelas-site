import {
  Camera,
  ChevronRight,
  Clock3,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import Image from "next/image";
import { navigation, services, siteConfig } from "@/data/site";
import { getWhatsAppUrl } from "@/lib/whatsapp";

const footerPhotos = [
  { src: "/estrutura/interna-1.webp", alt: "Vista interna da oficina" },
  { src: "/maquinas/maquina-2.webp", alt: "Máquina de precisão da retífica" },
  { src: "/servicos/servico-3.webp", alt: "Cabeçote em processo técnico" },
  { src: "/servicos/servico-1.webp", alt: "Bloco de motor na bancada" },
  { src: "/servicos/servico-4.webp", alt: "Componentes de motor" },
  { src: "/fachada/fachada-1.webp", alt: "Fachada da Retífica Três Estrelas" },
] as const;

export function Footer() {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${siteConfig.address.street}, ${siteConfig.address.city}`,
  )}`;

  return (
    <footer className="site-footer" id="contato">
      <div className="footer-accent" aria-hidden="true" />

      <div className="container footer-main">
        <div className="footer-brand">
          <Image
            src="/brand/logo-v2.png"
            alt="Retífica Três Estrelas"
            width={600}
            height={600}
            unoptimized
          />
          <p>
            Retífica de motores em São José do Rio Preto com experiência,
            precisão e especialização técnica em motores diesel.
          </p>

          <a
            className="footer-phone"
            href={`tel:+${siteConfig.whatsapp.number}`}
            aria-label={`Ligar para ${siteConfig.whatsapp.display}`}
          >
            <span className="footer-phone-icon">
              <Phone size={28} aria-hidden="true" />
            </span>
            <span>
              <small>Atendimento direto</small>
              <strong>{siteConfig.whatsapp.display}</strong>
            </span>
          </a>

          <div className="footer-socials" aria-label="Canais de atendimento">
            <span>Siga e fale conosco</span>
            <a
              href={siteConfig.instagram.url}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram da Retífica Três Estrelas"
            >
              <Camera size={18} aria-hidden="true" />
            </a>
            <a
              href={getWhatsAppUrl("rodape")}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp da Retífica Três Estrelas"
            >
              <MessageCircle size={18} aria-hidden="true" />
            </a>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Ver localização no Google Maps"
            >
              <MapPin size={18} aria-hidden="true" />
            </a>
          </div>
        </div>

        <nav className="footer-column" aria-label="Navegação no rodapé">
          <h2>Links úteis</h2>
          <ul className="footer-link-list">
            {navigation.slice(0, 5).map((item) => (
              <li key={item.href}>
                <a href={item.href}>
                  <ChevronRight size={17} aria-hidden="true" />
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer-column">
          <h2>Serviços e atendimento</h2>
          <ul className="footer-link-list footer-service-list">
            {services.slice(0, 4).map((service) => (
              <li key={service.title}>
                <a href="#servicos">
                  <ChevronRight size={17} aria-hidden="true" />
                  {service.title}
                </a>
              </li>
            ))}
          </ul>
          <div className="footer-detail">
            <Clock3 size={18} aria-hidden="true" />
            <span>
              <small>Horário de atendimento</small>
              Confirme pelo WhatsApp
            </span>
          </div>
          <a className="footer-detail" href={mapsUrl} target="_blank" rel="noreferrer">
            <MapPin size={18} aria-hidden="true" />
            <span>
              <small>Onde estamos</small>
              {siteConfig.address.city}
            </span>
          </a>
        </div>

        <div className="footer-column footer-instagram">
          <h2>Instagram</h2>
          <a
            className="footer-instagram-handle"
            href={siteConfig.instagram.url}
            target="_blank"
            rel="noreferrer"
          >
            <Camera size={17} aria-hidden="true" />
            {siteConfig.instagram.handle}
          </a>
          <div className="footer-photo-grid">
            {footerPhotos.map((photo) => (
              <a
                key={photo.src}
                href={siteConfig.instagram.url}
                target="_blank"
                rel="noreferrer"
                aria-label="Ver a Retífica Três Estrelas no Instagram"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 680px) 28vw, 100px"
                  unoptimized
                />
                <span aria-hidden="true">
                  <Camera size={18} />
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-bottom-wrap">
        <div className="container footer-bottom">
          <span>
            © {new Date().getFullYear()} Retífica Três Estrelas. Todos os direitos
            reservados.
          </span>
          <details className="privacy-details" id="privacidade">
            <summary>Política de privacidade</summary>
            <p>
              Este site não possui formulário próprio de coleta. As informações
              enviadas pelo WhatsApp são utilizadas apenas para responder ao
              atendimento solicitado.
            </p>
          </details>
        </div>
      </div>
    </footer>
  );
}
