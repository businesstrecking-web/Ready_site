import type { ReactNode } from "react";

export function Section({
  eyebrow,
  title,
  description,
  children,
  dark = false,
  id,
}: {
  eyebrow?: string;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  dark?: boolean;
  id?: string;
}) {
  return (
    <section id={id} className={`py-20 md:py-28 ${dark ? "surface-dark" : ""}`}>
      <div className="container-page">
        {(eyebrow || title || description) && (
          <div className="mb-12 max-w-2xl md:mb-16">
            {eyebrow && (
              <div
                className={`text-xs font-medium uppercase tracking-[0.18em] ${dark ? "text-primary-foreground/60" : "text-muted-foreground"}`}
              >
                {eyebrow}
              </div>
            )}
            {title && (
              <h2
                className={`mt-4 text-3xl font-bold md:text-5xl ${dark ? "text-surface-dark-foreground" : ""}`}
              >
                {title}
              </h2>
            )}
            {description && (
              <p
                className={`mt-4 text-base md:text-lg ${dark ? "text-surface-dark-foreground/70" : "text-muted-foreground"}`}
              >
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
