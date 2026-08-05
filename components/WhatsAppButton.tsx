import { getWhatsAppUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

export function WhatsAppButton() {
  return (
    <a
      className="whatsapp-float"
      href={getWhatsAppUrl("botao-flutuante")}
      data-whatsapp-source="botao-flutuante"
      target="_blank"
      rel="noreferrer"
      aria-label="Falar com a Retífica Três Estrelas pelo WhatsApp"
    >
      <WhatsAppIcon className="whatsapp-float__icon" />
    </a>
  );
}
