import {
  BadgeCheck,
  CalendarDays,
  Fuel,
  ShieldCheck,
  Truck,
} from "lucide-react";

const items = [
  { label: "Desde", value: "1990", icon: CalendarDays },
  { label: "Combustíveis", value: "Gasolina, flex e diesel", icon: Fuel },
  { label: "Especialização", value: "Especialistas em diesel", icon: BadgeCheck },
  { label: "Garantia", value: "90 dias ou 10.000 km", icon: ShieldCheck },
  { label: "Comodidade", value: "Retirada e entrega na região", icon: Truck },
] as const;

export function TrustBar() {
  return (
    <section className="container trust-shell" aria-label="Informações de confiança">
      <div className="trust-grid">
        {items.map(({ label, value, icon: Icon }) => (
          <div className="trust-item" key={value}>
            <Icon className="trust-icon" size={28} strokeWidth={1.6} aria-hidden="true" />
            <div>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          </div>
        ))}
      </div>
      <p className="trust-note">
        Garantia e logística conforme as condições do serviço, orçamento e localização.
      </p>
    </section>
  );
}
