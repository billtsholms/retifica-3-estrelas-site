import {
  AudioLines,
  CircleGauge,
  CloudFog,
  Droplets,
  Fuel,
  KeyRound,
  MessageCircle,
  Settings,
  ThermometerSun,
} from "lucide-react";
import { problems } from "@/data/site";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { SectionHeading } from "./SectionHeading";

const iconMap = {
  cloud: CloudFog,
  gauge: CircleGauge,
  oil: Fuel,
  temperature: ThermometerSun,
  sound: AudioLines,
  key: KeyRound,
  droplets: Droplets,
  cog: Settings,
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
                  <Icon size={32} strokeWidth={1.8} />
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
            Fale conosco
          </a>
        </div>
      </div>
    </section>
  );
}
