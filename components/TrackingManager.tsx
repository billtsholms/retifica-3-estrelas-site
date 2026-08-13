"use client";

import { useEffect } from "react";

type TrackingConfig = {
  mode: "direct" | "gtm";
  gtmId: string;
  ga4MeasurementId: string;
  googleAdsId: string;
  googleAdsConversionLabel: string;
  metaPixelId: string;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: ((...args: unknown[]) => void) & {
      callMethod?: (...args: unknown[]) => void;
      queue?: unknown[][];
      loaded?: boolean;
      version?: string;
    };
  }
}

const CONSENT_KEY = "tres-estrelas-marketing-consent";

const appendScript = (id: string, src: string) => {
  if (document.getElementById(id)) return;
  const script = document.createElement("script");
  script.id = id;
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
};

const initializeGoogleTag = (config: TrackingConfig) => {
  const ids = [config.ga4MeasurementId, config.googleAdsId].filter(Boolean);
  if (ids.length === 0) return;

  window.dataLayer = window.dataLayer ?? [];
  window.gtag =
    window.gtag ??
    ((...args: unknown[]) => {
      window.dataLayer?.push(args);
    });

  window.gtag("js", new Date());
  ids.forEach((id) => window.gtag?.("config", id));
  appendScript(
    "google-tag-script",
    `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ids[0])}`,
  );
};

const initializeGtm = (gtmId: string) => {
  if (!gtmId) return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({
    "gtm.start": Date.now(),
    event: "gtm.js",
  });
  appendScript(
    "google-tag-manager-script",
    `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`,
  );
};

const initializeMetaPixel = (pixelId: string) => {
  if (!pixelId || window.fbq) return;

  const fbq = ((...args: unknown[]) => {
    if (fbq.callMethod) {
      fbq.callMethod(...args);
      return;
    }
    fbq.queue?.push(args);
  }) as NonNullable<Window["fbq"]>;

  fbq.queue = [];
  fbq.loaded = true;
  fbq.version = "2.0";
  window.fbq = fbq;
  appendScript(
    "meta-pixel-script",
    "https://connect.facebook.net/pt_BR/fbevents.js",
  );
  window.fbq("init", pixelId);
  window.fbq("track", "PageView");
};

const getOrigin = (link: HTMLAnchorElement) =>
  link.dataset.whatsappSource ??
  link.closest<HTMLElement>("[id]")?.id ??
  "site";

export function TrackingManager() {
  useEffect(() => {
    let config: TrackingConfig | null = null;
    let initialized = false;

    const initialize = async () => {
      if (
        initialized ||
        window.localStorage.getItem(CONSENT_KEY) === "denied"
      ) {
        return;
      }

      try {
        const response = await fetch("/tracking-config.php", {
          cache: "no-store",
          headers: { Accept: "application/json" },
        });
        if (!response.ok) return;

        config = (await response.json()) as TrackingConfig;
        initialized = true;

        if (config.mode === "gtm") {
          initializeGtm(config.gtmId);
        } else {
          initializeGoogleTag(config);
          initializeMetaPixel(config.metaPixelId);
        }
      } catch {
        // The PHP endpoint is available on Hostinger. Local and Sites previews
        // intentionally continue without tracking when the endpoint is absent.
      }
    };

    const trackWhatsAppClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest<HTMLAnchorElement>('a[href*="wa.me"]');
      if (!link || window.localStorage.getItem(CONSENT_KEY) === "denied") {
        return;
      }

      const origin = getOrigin(link);
      window.dataLayer?.push({
        event: "whatsapp_click",
        origem_contato: origin,
      });
      window.gtag?.("event", "whatsapp_click", {
        origem_contato: origin,
        event_category: "contato",
      });

      if (config?.googleAdsId && config.googleAdsConversionLabel) {
        window.gtag?.("event", "conversion", {
          send_to: `${config.googleAdsId}/${config.googleAdsConversionLabel}`,
        });
      }

      window.fbq?.("trackCustom", "WhatsAppClick", {
        origem_contato: origin,
      });
    };

    const handleConsentChange = () => {
      void initialize();
    };

    void initialize();
    document.addEventListener("click", trackWhatsAppClick);
    window.addEventListener("tracking-consent-change", handleConsentChange);

    return () => {
      document.removeEventListener("click", trackWhatsAppClick);
      window.removeEventListener(
        "tracking-consent-change",
        handleConsentChange,
      );
    };
  }, []);

  return null;
}
