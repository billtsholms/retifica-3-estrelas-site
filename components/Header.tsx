"use client";

import { Menu, PhoneCall, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { navigation } from "@/data/site";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 18);
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(
        scrollable > 0 ? Math.min(100, (window.scrollY / scrollable) * 100) : 0,
      );
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sectionIds = navigation.map((item) => item.href.slice(1));
    const sections = sectionIds
      .map((id) => document.getElementById(id))
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

  return (
    <header className={`site-header${scrolled ? " site-header--scrolled" : ""}`}>
      <div className="container header-inner">
        <a className="header-logo" href="#inicio" aria-label="Retífica Três Estrelas — início">
          <Image
            src="/brand/logo-v2.png"
            alt="Retífica Três Estrelas"
            width={600}
            height={600}
            priority
            unoptimized
          />
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

        <div className="header-actions">
          <a
            className="button button--primary button--whatsapp"
            href={getWhatsAppUrl("cabecalho")}
            target="_blank"
            rel="noreferrer"
          >
            <span className="button-whatsapp__icon" aria-hidden="true">
              <PhoneCall size={17} strokeWidth={2.25} />
            </span>
            <span>Fale conosco</span>
          </a>
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
      <span
        className="header-progress"
        aria-hidden="true"
        style={{ width: `${scrollProgress}%` }}
      />
    </header>
  );
}
