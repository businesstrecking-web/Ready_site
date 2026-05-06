import { Link } from "@tanstack/react-router";

export function FinalCTA({
  title = "Подберём решения под ваш бизнес",
  text = "Расскажите о задаче — соберём подходящие решения и предложим формат внедрения.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section className="surface-dark relative overflow-hidden">
      <div className="hero-glow" aria-hidden />
      <div className="container-page relative py-20 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-surface-dark-foreground md:text-5xl">{title}</h2>
          <p className="mt-4 text-base text-surface-dark-foreground/70 md:text-lg">{text}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/contacts"
              className="rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Оставить заявку
            </Link>
            <Link
              to="/catalog"
              className="rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-medium text-surface-dark-foreground backdrop-blur transition-colors hover:bg-white/10"
            >
              Смотреть каталог
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
