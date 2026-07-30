type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  centered?: boolean;
  index?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  centered = false,
  index,
}: SectionHeadingProps) {
  return (
    <div className={`section-heading${centered ? " section-heading--center" : ""}`}>
      <div className="section-kicker">
        {index ? <span className="section-index">{index}</span> : null}
        <span className="eyebrow">{eyebrow}</span>
      </div>
      <h2 className="section-title">{title}</h2>
      {description ? <p className="section-description">{description}</p> : null}
    </div>
  );
}
