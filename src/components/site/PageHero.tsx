import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="surface-dark relative overflow-hidden">
      <div className="hero-glow" aria-hidden />
      <div className="container-page relative py-24 md:py-32">
        {eyebrow && (
          <div className="text-xs font-medium uppercase tracking-[0.18em] text-surface-dark-foreground/60">
            {eyebrow}
          </div>
        )}
        <h1 className="mt-4 max-w-3xl text-4xl font-bold text-surface-dark-foreground md:text-6xl">
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-2xl text-base text-surface-dark-foreground/70 md:text-lg">
            {description}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
