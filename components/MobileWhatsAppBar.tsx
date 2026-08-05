import { getWhatsAppUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

export function MobileWhatsAppBar() {
  return (
    <div className="mobile-whatsapp-bar">
      <a
        className="mobile-whatsapp-button"
        href={getWhatsAppUrl("botao-flutuante")}
        data-whatsapp-source="botao-flutuante-mobile"
        target="_blank"
        rel="noreferrer"
        aria-label="Falar com a Retífica Três Estrelas pelo WhatsApp"
      >
        <WhatsAppIcon className="mobile-whatsapp-button__icon" />
      </a>
    </div>
  );
}
