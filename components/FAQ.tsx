import { ChevronDown, MessageCircleQuestion } from "lucide-react";
import { faqs } from "@/data/site";
import { SectionHeading } from "./SectionHeading";

export function FAQ() {
  return (
    <section className="section section--soft faq-section" id="duvidas">
      <div className="container">
        <SectionHeading
          eyebrow="Informação clara antes do serviço"
          title="Dúvidas frequentes"
          description="Respostas diretas para ajudar você a entender o atendimento e solicitar uma avaliação."
          index="06"
        />

        <div className="faq-layout">
          <div className="faq-intro" aria-hidden="true">
            <MessageCircleQuestion size={52} strokeWidth={1.4} />
            <strong>Não encontrou sua dúvida?</strong>
            <span>Fale diretamente com nossa equipe pelo WhatsApp.</span>
          </div>

          <div className="faq-list">
            {faqs.map((faq) => (
              <details className="faq-item" key={faq.question}>
                <summary>
                  <span>{faq.question}</span>
                  <ChevronDown size={20} aria-hidden="true" />
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
