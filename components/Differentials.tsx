import {
  Award,
  BadgeCheck,
  MapPin,
  ShieldCheck,
  Truck,
  Users,
} from "lucide-react";
import { differentials } from "@/data/site";
import { SectionHeading } from "./SectionHeading";

const iconMap = {
  award: Award,
  users: Users,
  badge: BadgeCheck,
  shield: ShieldCheck,
  truck: Truck,
  map: MapPin,
};

export function Differentials() {
  return (
    <section className="section" id="diferenciais">
      <div className="container">
        <SectionHeading
          eyebrow="Por que escolher a Três Estrelas?"
          title="Diferenciais que fazem a diferença"
        />
        <div className="differentials-grid">
          {differentials.map((item) => {
            const Icon = iconMap[item.icon];
            return (
              <div className="differential-item" key={item.title}>
                <Icon size={34} strokeWidth={1.45} aria-hidden="true" />
                <strong>{item.title}</strong>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
