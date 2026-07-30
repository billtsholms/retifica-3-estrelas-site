import {
  ArrowRight,
  BadgeCheck,
  Fuel,
  MapPin,
  MessageCircle,
} from "lucide-react";
import Image from "next/image";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export function Hero() {
  return (
    <section className="hero" id="inicio" aria-labelledby="hero-title">
      <div className="hero-banner-desktop">
        <Image
          src="/hero/banner-home.webp"
          alt="Retífica de motores com padrão premium desde 1991, com atendimento em São José do Rio Preto"
          fill
          sizes="100vw"
          priority
          unoptimized
        />
        <a
          className="hero-banner-hotspot hero-banner-hotspot--primary"
          href={getWhatsAppUrl("hero-banner")}
          target="_blank"
          rel="noreferrer"
          aria-label="Solicitar avaliação pelo WhatsApp"
        >
          <span className="sr-only">Solicitar avaliação</span>
        </a>
        <a
          className="hero-banner-hotspot hero-banner-hotspot--secondary"
          href="#servicos"
          aria-label="Conhecer os serviços"
        >
          <span className="sr-only">Conhecer serviços</span>
        </a>
      </div>

      <div className="container hero-grid hero-grid--mobile">
        <div className="hero-copy">
          <span className="eyebrow">Desempenho que você pode confiar</span>
          <h1 id="hero-title">Retífica de motores com padrão premium desde 1991.</h1>
          <p>
            Atendimento para carros, caminhonetes, vans, utilitários, agrícolas e
            caminhões, com experiência em diferentes tipos de motores e
            especialização em motores diesel.
          </p>
          <div className="hero-proof" aria-label="Informações principais">
            <span>
              <MapPin size={16} aria-hidden="true" />
              São José do Rio Preto — SP
            </span>
            <span>
              <Fuel size={16} aria-hidden="true" />
              Gasolina, flex e diesel
            </span>
          </div>
          <div className="hero-actions">
            <a
              className="button button--primary"
              href={getWhatsAppUrl("hero")}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={18} aria-hidden="true" />
              Solicitar avaliação
            </a>
            <a className="button button--outline" href="#servicos">
              Conhecer serviços
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
          <div className="hero-assurance">
            <BadgeCheck size={18} aria-hidden="true" />
            <span>
              Avaliação técnica responsável para indicar o serviço adequado ao
              seu motor.
            </span>
          </div>
        </div>

        <div className="hero-visual" aria-label="Motor e fachada da Retífica Três Estrelas">
          <div className="hero-machine">
            <Image
              src="/servicos/servico-2.webp"
              alt="Motor em processo técnico na Retífica Três Estrelas"
              fill
              sizes="(max-width: 900px) 52vw, 34vw"
              unoptimized
            />
          </div>
          <div className="hero-facade">
            <Image
              src="/fachada/fachada-1.webp"
              alt="Fachada da Retífica Três Estrelas em São José do Rio Preto"
              fill
              sizes="(max-width: 900px) 85vw, 48vw"
              priority
              unoptimized
            />
          </div>
          <span className="hero-gold-line" aria-hidden="true" />
          <div className="hero-since-badge" aria-label="Experiência desde 1991">
            <span>Desde</span>
            <strong>1991</strong>
            <small>experiência técnica</small>
          </div>
          <div className="hero-specialty">
            <BadgeCheck size={17} aria-hidden="true" />
            Especialização em diesel
          </div>
        </div>
      </div>
    </section>
  );
}
