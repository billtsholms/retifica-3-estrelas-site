import type { LucideIcon } from "lucide-react";
import Image from "next/image";

type ImageCardProps = {
  title: string;
  description: string;
  image: string;
  alt: string;
  icon?: LucideIcon;
  badge?: string;
};

export function ImageCard({
  title,
  description,
  image,
  alt,
  icon: Icon,
  badge,
}: ImageCardProps) {
  return (
    <article className="image-card">
      <div className="image-card-media">
        <Image
          src={image}
          alt={alt}
          fill
          sizes="(max-width: 680px) 100vw, (max-width: 900px) 50vw, 33vw"
          unoptimized
        />
        {badge ? <span className="image-card-badge">{badge}</span> : null}
      </div>
      <div className="image-card-body">
        <div className="image-card-title-row">
          {Icon ? (
            <span className="image-card-icon" aria-hidden="true">
              <Icon size={20} strokeWidth={1.7} />
            </span>
          ) : null}
          <h3>{title}</h3>
        </div>
        <p>{description}</p>
      </div>
    </article>
  );
}
