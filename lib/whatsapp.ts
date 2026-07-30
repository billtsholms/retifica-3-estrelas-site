import { siteConfig } from "@/data/site";

const baseMessage = `Olá! Gostaria de solicitar uma avaliação para o motor do meu veículo.

Veículo:
Ano:
Motorização:
Combustível:
Cidade:
Problema apresentado:
O veículo está funcionando ou está parado?`;

export function getWhatsAppUrl(source: string) {
  const message = `${baseMessage}

Origem do contato: ${source}`;

  return `https://wa.me/${siteConfig.whatsapp.number}?text=${encodeURIComponent(message)}`;
}
