import type { RichSection } from "@/types/calculator";

export function SectionBlocks({ sections }: { sections: RichSection[] }) {
  return (
    <div className="space-y-8">
      {sections.map((section) => (
        <section key={section.heading}>
          <h2 className="text-2xl font-black text-slate-950">{section.heading}</h2>
          <div className="mt-4 space-y-4 text-sm leading-8 text-slate-600 md:text-base">
            {section.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          {section.bullets?.length ? (
            <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-700 md:text-base">
              {section.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-3">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-blush-500" aria-hidden="true" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}
    </div>
  );
}
