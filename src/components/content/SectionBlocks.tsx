import type { ReactNode } from "react";
import type { RichSection } from "@/types/calculator";

export function SectionBlocks({
  sections,
  afterSectionIndex,
  afterSection,
}: {
  sections: RichSection[];
  afterSectionIndex?: number;
  afterSection?: ReactNode;
}) {
  return (
    <div className="space-y-8">
      {sections.map((section, index) => (
        <div key={section.heading}>
          <section>
            <h2 className="text-2xl font-semibold text-foreground">{section.heading}</h2>
            <div className="mt-4 space-y-4 text-sm leading-8 text-muted-foreground md:text-base">
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            {section.bullets?.length ? (
              <ul className="mt-5 space-y-3 text-sm leading-7 text-muted-foreground md:text-base">
                {section.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-3">
                    <span className="mt-2 h-2.5 w-2.5 rounded-xl bg-primary" aria-hidden="true" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
          {afterSection && index === afterSectionIndex ? afterSection : null}
        </div>
      ))}
    </div>
  );
}
