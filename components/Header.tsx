"use client";

import {
  Clock3,
  MapPin,
  Menu,
  MessageCircle,
  PhoneCall,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { navigation, siteConfig } from "@/data/site";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 18);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sections = navigation
      .map((item) => document.getElementById(item.href.slice(1)))
      .filter((section): section is HTMLElement => section !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-28% 0px -58% 0px", threshold: [0, 0.25, 0.6] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${siteConfig.address.street}, ${siteConfig.address.city}`,
  )}`;

  return (
    <header className={`site-header${scrolled ? " site-header--scrolled" : ""}`}>
      <div className="header-top">
        <div className="container header-top-layout">
          <div className="header-top-spacer" aria-hidden="true" />
          <div className="header-top-panel">
            <ul className="header-top-list">
              <li>
                <a href={getWhatsAppUrl("topo-contato")} target="_blank" rel="noreferrer">
                  <MessageCircle size={15} aria-hidden="true" />
                  {siteConfig.whatsapp.display}
                </a>
              </li>
              <li>
                <Clock3 size={15} aria-hidden="true" />
                Horário: confirme pelo WhatsApp
              </li>
              <li>
                <a href={mapsUrl} target="_blank" rel="noreferrer">
                  <MapPin size={15} aria-hidden="true" />
                  {siteConfig.address.street}
                </a>
              </li>
            </ul>
            <a
              className="header-top-cta"
              href={getWhatsAppUrl("topo")}
              target="_blank"
              rel="noreferrer"
            >
              <Menu size={19} aria-hidden="true" />
              Fale conosco
            </a>
          </div>
        </div>
      </div>

      <div className="header-main">
        <div className="container header-main-inner">
          <a
            className="header-logo"
            href="#inicio"
            aria-label="Retífica Três Estrelas — início"
          >
            <Image
              src="/brand/logo-v2.png"
              alt="Retífica Três Estrelas"
              width={600}
              height={600}
              priority
              unoptimized
            />
          </a>

          <a
            className="header-call"
            href={`tel:+${siteConfig.whatsapp.number}`}
            aria-label={`Ligar para ${siteConfig.whatsapp.display}`}
          >
            <PhoneCall size={40} strokeWidth={1.8} aria-hidden="true" />
            <span>
              <small>Ligue agora!</small>
              <strong>{siteConfig.whatsapp.display}</strong>
            </span>
          </a>

          <nav className="desktop-nav" aria-label="Navegação principal">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                aria-current={
                  activeSection === item.href.slice(1) ? "location" : undefined
                }
              >
                {item.label}
              </a>
            ))}
          </nav>

          <button
            className="menu-button"
            type="button"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            aria-controls="menu-mobile"
            onClick={() => setOpen((current) => !current)}
          >
            {open ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </div>

      {open ? (
        <nav className="mobile-menu" id="menu-mobile" aria-label="Navegação mobile">
          <div className="container mobile-menu-inner">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                aria-current={
                  activeSection === item.href.slice(1) ? "location" : undefined
                }
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a
              className="button button--primary button--whatsapp"
              href={getWhatsAppUrl("cabecalho-mobile")}
              target="_blank"
              rel="noreferrer"
            >
              <span className="button-whatsapp__icon" aria-hidden="true">
                <PhoneCall size={17} strokeWidth={2.25} />
              </span>
              <span>Fale conosco</span>
            </a>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
