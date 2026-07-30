import { MessageCircle } from "lucide-react";
import { vehicles } from "@/data/site";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { ImageCard } from "./ImageCard";
import { SectionHeading } from "./SectionHeading";

export function VehicleCategories() {
  return (
    <section className="section section--soft" id="veiculos">
      <div className="container">
        <SectionHeading
          eyebrow="Atendemos diversos segmentos"
          title="Veículos atendidos"
          description="Experiência em motores de veículos leves, utilitários, linha diesel, agrícolas e caminhões."
          index="02"
        />
        <div className="vehicle-grid">
          {vehicles.map((vehicle, index) => (
            <ImageCard
              key={vehicle.title}
              {...vehicle}
              badge={`Segmento ${String(index + 1).padStart(2, "0")}`}
            />
          ))}
        </div>
        <div className="section-footer-action">
          <p>
            Não encontrou seu modelo? Conte qual é o veículo e o problema para nossa
            equipe avaliar.
          </p>
          <a
            className="button button--outline"
            href={getWhatsAppUrl("veiculos")}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={18} aria-hidden="true" />
            Consultar meu veículo
          </a>
        </div>
      </div>
    </section>
  );
}
