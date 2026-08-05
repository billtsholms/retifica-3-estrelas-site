import { siteConfig } from "@/data/site";

const baseMessage =
  "Olá vim pelo google e gostaria de solicitar um orçamento.";

export function getWhatsAppUrl(_source: string) {
  return `https://wa.me/${siteConfig.whatsapp.number}?text=${encodeURIComponent(baseMessage)}`;
}
