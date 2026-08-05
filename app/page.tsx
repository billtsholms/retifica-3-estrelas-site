import { Differentials } from "@/components/Differentials";
import { CookieConsent } from "@/components/CookieConsent";
import { EngineProblems } from "@/components/EngineProblems";
import { FAQ } from "@/components/FAQ";
import { FacilityGallery } from "@/components/FacilityGallery";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { MobileWhatsAppBar } from "@/components/MobileWhatsAppBar";
import { MotionEnhancements } from "@/components/MotionEnhancements";
import { Services } from "@/components/Services";
import { TrustBar } from "@/components/TrustBar";
import { TrackingManager } from "@/components/TrackingManager";
import { VehicleCategories } from "@/components/VehicleCategories";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { faqs, siteConfig } from "@/data/site";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["AutoRepair", "LocalBusiness", "Organization"],
      "@id": `${siteConfig.url}/#empresa`,
      url: siteConfig.url,
      name: siteConfig.name,
      description:
        "Retífica de motores para carros, caminhonetes, vans, utilitários, agrícolas e caminhões, com especialização técnica em motores diesel.",
      telephone: `+${siteConfig.whatsapp.number}`,
      logo: `${siteConfig.url}/brand/logo-v2.png`,
      image: `${siteConfig.url}/fachada/fachada-1.webp`,
      address: {
        "@type": "PostalAddress",
        streetAddress: siteConfig.address.street,
        addressLocality: "São José do Rio Preto",
        addressRegion: "SP",
        postalCode: siteConfig.address.cep,
        addressCountry: "BR",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: `+${siteConfig.whatsapp.number}`,
        contactType: "customer service",
        availableLanguage: "Portuguese",
      },
      sameAs: [siteConfig.instagram.url],
      areaServed: {
        "@type": "City",
        name: "São José do Rio Preto",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  ],
};

export default function Home() {
  return (
    <>
      <TrackingManager />
      <MotionEnhancements />
      <Header />
      <main>
        <Hero />
        <TrustBar />
        <EngineProblems />
        <VehicleCategories />
        <Services />
        <FacilityGallery />
        <Differentials />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <WhatsAppButton />
      <MobileWhatsAppBar />
      <CookieConsent />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  );
}
