"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { gallery } from "@/data/site";
import { SectionHeading } from "./SectionHeading";

export function FacilityGallery() {
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section className="section section--soft" id="estrutura">
      <div className="container">
        <SectionHeading
          eyebrow="Estrutura completa para entregar o melhor"
          title="Estrutura e equipamentos"
        />
        <div className="gallery-grid">
          {gallery.map((item, index) => (
            <button
              className="gallery-button"
              type="button"
              key={item.image}
              onClick={() => setSelected(index)}
              aria-label={`Ampliar imagem: ${item.alt}`}
            >
              <Image
                src={item.image}
                alt={item.alt}
                fill
                sizes="(max-width: 680px) 50vw, (max-width: 900px) 33vw, 20vw"
                unoptimized
              />
            </button>
          ))}
        </div>
        <p className="gallery-caption">
          Oficina ampla e equipada com máquinas de precisão, ferramentas
          especializadas e equipe técnica preparada para diferentes tipos de motores.
        </p>
      </div>

      {selected !== null ? (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Visualização ampliada da estrutura"
          onClick={() => setSelected(null)}
        >
          <button
            className="lightbox-close"
            type="button"
            aria-label="Fechar imagem ampliada"
            onClick={() => setSelected(null)}
          >
            <X size={24} aria-hidden="true" />
          </button>
          <figure className="lightbox-figure" onClick={(event) => event.stopPropagation()}>
            <Image
              src={gallery[selected].image}
              alt={gallery[selected].alt}
              fill
              sizes="90vw"
              unoptimized
            />
          </figure>
        </div>
      ) : null}
    </section>
  );
}
