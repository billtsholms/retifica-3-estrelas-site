import {
  Box,
  Cog,
  Layers3,
  MessageCircle,
  ScanSearch,
  Settings,
  Wrench,
} from "lucide-react";
import { services } from "@/data/site";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { ImageCard } from "./ImageCard";
import { SectionHeading } from "./SectionHeading";

const iconMap = {
  settings: Settings,
  layers: Layers3,
  box: Box,
  component: Cog,
  wrench: Wrench,
  scan: ScanSearch,
};

export function Services() {
  return (
    <section className="section" id="servicos">
      <div className="container">
        <SectionHeading
          eyebrow="Soluções completas para o seu motor"
          title="Serviços especializados"
          description="Processos técnicos, equipamentos de precisão e uma equipe preparada para avaliar cada motor de forma responsável."
          index="03"
        />
        <div className="service-grid">
          {services.map((service, index) => (
            <ImageCard
              key={service.title}
              {...service}
              icon={iconMap[service.icon]}
              badge={`Solução ${String(index + 1).padStart(2, "0")}`}
            />
          ))}
        </div>
        <div className="center-action">
          <a
            className="button button--primary"
            href={getWhatsAppUrl("servicos")}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={18} aria-hidden="true" />
            Fale conosco
          </a>
        </div>
      </div>
    </section>
  );
}
