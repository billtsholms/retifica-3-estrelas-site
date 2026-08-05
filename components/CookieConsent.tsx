"use client";

import { Cookie, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

const CONSENT_KEY = "tres-estrelas-marketing-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(window.localStorage.getItem(CONSENT_KEY) === null);

    const openPreferences = (event: MouseEvent) => {
      const target = event.target;
      if (
        target instanceof Element &&
        target.closest("[data-open-cookie-settings]")
      ) {
        setVisible(true);
      }
    };

    document.addEventListener("click", openPreferences);
    return () => document.removeEventListener("click", openPreferences);
  }, []);

  const savePreference = (value: "granted" | "denied") => {
    const previous = window.localStorage.getItem(CONSENT_KEY);
    window.localStorage.setItem(CONSENT_KEY, value);
    setVisible(false);

    if (previous === "granted" && value === "denied") {
      window.location.reload();
      return;
    }

    window.dispatchEvent(new Event("tracking-consent-change"));
  };

  if (!visible) return null;

  return (
    <aside
      className="cookie-consent"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
    >
      <span className="cookie-consent__icon" aria-hidden="true">
        <Cookie size={25} />
      </span>
      <div className="cookie-consent__copy">
        <strong id="cookie-consent-title">Sua privacidade importa</strong>
        <p id="cookie-consent-description">
          Usamos tecnologias de medição para entender os acessos e melhorar
          nossas campanhas. Você pode aceitar ou continuar somente com os
          recursos essenciais.
        </p>
        <a href="#privacidade">Saiba mais na Política de Privacidade</a>
      </div>
      <div className="cookie-consent__actions">
        <button
          className="button button--ghost cookie-consent__reject"
          type="button"
          onClick={() => savePreference("denied")}
        >
          Somente essenciais
        </button>
        <button
          className="button button--primary"
          type="button"
          onClick={() => savePreference("granted")}
        >
          <ShieldCheck size={18} aria-hidden="true" />
          Aceitar medição
        </button>
      </div>
    </aside>
  );
}
