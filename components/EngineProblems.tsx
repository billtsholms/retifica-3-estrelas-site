import {
  Cloud,
  Cog,
  Droplets,
  Fuel,
  Gauge,
  KeyRound,
  MessageCircle,
  ThermometerSun,
  Volume2,
} from "lucide-react";
import { problems } from "@/data/site";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { SectionHeading } from "./SectionHeading";

const iconMap = {
  cloud: Cloud,
  gauge: Gauge,
  oil: Fuel,
  temperature: ThermometerSun,
  sound: Volume2,
  key: KeyRound,
  droplets: Droplets,
  cog: Cog,
};

export function EngineProblems() {
  return (
    <section className="section" id="problemas">
      <div className="container">
        <SectionHeading
          eyebrow="Atenção aos sinais"
          title="Seu motor apresenta algum destes problemas?"
          centered
          index="01"
        />
        <div className="problem-grid">
          {problems.map((problem) => {
            const Icon = iconMap[problem.icon];
            return (
              <a
                className="problem-card"
                key={problem.title}
                href={getWhatsAppUrl("problemas")}
                target="_blank"
                rel="noreferrer"
                aria-label={`${problem.title}: falar com a Retífica Três Estrelas`}
              >
                <span className="problem-icon-wrap" aria-hidden="true">
                  <Icon size={36} strokeWidth={1.45} />
                </span>
                <strong>{problem.title}</strong>
              </a>
            );
          })}
        </div>
        <div className="center-action">
          <a
            className="button button--outline"
            href={getWhatsAppUrl("problemas")}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={18} aria-hidden="true" />
            Quero resolver meu problema
          </a>
        </div>
      </div>
    </section>
  );
}
