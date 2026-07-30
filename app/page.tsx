import { Differentials } from "@/components/Differentials";
import { EngineProblems } from "@/components/EngineProblems";
import { FacilityGallery } from "@/components/FacilityGallery";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { MobileWhatsAppBar } from "@/components/MobileWhatsAppBar";
import { Services } from "@/components/Services";
import { TrustBar } from "@/components/TrustBar";
import { VehicleCategories } from "@/components/VehicleCategories";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { siteConfig } from "@/data/site";

const structuredData = {
  "@context": "https://schema.org",
  "@type": ["AutoRepair", "LocalBusiness", "Organization"],
  name: siteConfig.name,
  description:
    "Retífica de motores para carros, caminhonetes, vans, utilitários, agrícolas e caminhões, com especialização técnica em motores diesel.",
  telephone: `+${siteConfig.whatsapp.number}`,
  logo: "/brand/logo-v2.png",
  image: "/fachada/fachada-1.webp",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Av. Dr. Aniloel Nazareth, 2375",
    addressLocality: "São José do Rio Preto",
    addressRegion: "SP",
    addressCountry: "BR",
  },
  sameAs: [siteConfig.instagram.url],
  areaServed: {
    "@type": "City",
    name: "São José do Rio Preto",
  },
};

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <TrustBar />
        <EngineProblems />
        <VehicleCategories />
        <Services />
        <FacilityGallery />
        <Differentials />
        <FinalCTA />
      </main>
      <Footer />
      <WhatsAppButton />
      <MobileWhatsAppBar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  );
}
