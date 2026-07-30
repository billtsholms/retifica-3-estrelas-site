import { MessageCircle } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export function MobileWhatsAppBar() {
  return (
    <div className="mobile-whatsapp-bar">
      <a
        className="button button--primary"
        href={getWhatsAppUrl("botao-flutuante")}
        target="_blank"
        rel="noreferrer"
      >
        <MessageCircle size={19} aria-hidden="true" />
        Solicitar avaliação no WhatsApp
      </a>
    </div>
  );
}
