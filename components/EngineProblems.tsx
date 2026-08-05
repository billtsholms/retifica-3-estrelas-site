import { MessageCircle } from "lucide-react";
import { problems } from "@/data/site";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { SectionHeading } from "./SectionHeading";

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
          {problems.map((problem) => (
            <a
              className="problem-card"
              key={problem.title}
              href={getWhatsAppUrl("problemas")}
              data-whatsapp-source={`problema-${problem.icon}`}
              target="_blank"
              rel="noreferrer"
              aria-label={`${problem.title}: falar com a Retífica Três Estrelas`}
            >
              <span className="problem-photo" aria-hidden="true" />
              <strong>{problem.title}</strong>
            </a>
          ))}
        </div>
        <div className="center-action">
          <a
            className="button button--primary"
            href={getWhatsAppUrl("problemas")}
            data-whatsapp-source="problemas-cta"
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
