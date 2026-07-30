import { MessageCircle } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export function WhatsAppButton() {
  return (
    <a
      className="whatsapp-float"
      href={getWhatsAppUrl("botao-flutuante")}
      target="_blank"
      rel="noreferrer"
      aria-label="Falar com a Retífica Três Estrelas pelo WhatsApp"
    >
      <MessageCircle size={27} aria-hidden="true" />
    </a>
  );
}
