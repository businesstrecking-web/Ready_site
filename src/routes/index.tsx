import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { Section } from "@/components/site/Section";
import { CategoryCard, SolutionCard, BundleCard, CaseCard } from "@/components/site/Cards";
import { FAQList } from "@/components/site/FAQ";
import { FinalCTA } from "@/components/site/CTA";
import {
  categories,
  solutions,
  bundles,
  cases,
  faq,
  trustBadges,
  howItWorks,
} from "@/data/content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Сборка — платформа готовых решений для бизнеса" },
      {
        name: "description",
        content:
          "Готовые решения для бизнеса в одном месте: отдельные инструменты и комплексные наборы под задачи компании.",
      },
      { property: "og:title", content: "Сборка — платформа готовых решений для бизнеса" },
      {
        property: "og:description",
        content:
          "Соберите систему компании из готовых решений — для систематизации, роста и управления.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="surface-dark relative overflow-hidden">
        <div className="hero-glow" aria-hidden />
        <div className="container-page relative py-24 md:py-36">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-surface-dark-foreground/80 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              Платформа готовых решений для бизнеса
            </div>
            <h1 className="mt-6 text-4xl font-bold leading-[1.05] text-surface-dark-foreground md:text-7xl">
              Готовые решения
              <br />
              для бизнеса —<br />
              <span className="text-primary-foreground/70">в одном месте</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base text-surface-dark-foreground/70 md:text-lg">
              Единое пространство, где собственники и руководители выбирают отдельные инструменты
              или комплексные наборы под задачи компании. Систематизация, рост, команда, инвестиции
              — всё в одной логике выбора.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/contacts"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Подобрать решение <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/catalog"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-medium text-surface-dark-foreground backdrop-blur transition-colors hover:bg-white/10"
              >
                Смотреть каталог
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <div className="hairline-b bg-background">
        <div className="container-page grid gap-x-8 gap-y-4 py-10 sm:grid-cols-2 lg:grid-cols-3">
          {trustBadges.map((b) => (
            <div key={b} className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <Check className="h-4 w-4 text-success" />
              {b}
            </div>
          ))}
        </div>
      </div>

      {/* Directions */}
      <Section
        eyebrow="Направления"
        title="Четыре ключевых направления"
        description="Выберите направление, в котором сейчас важно навести порядок или ускорить рост."
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => (
            <CategoryCard key={c.slug} category={c} />
          ))}
        </div>
      </Section>

      {/* How it works */}
      <Section
        eyebrow="Как это работает"
        title="От задачи — к собранной системе"
        description="Четыре шага от понимания задачи до внедрения решений в компании."
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {howItWorks.map((s) => (
            <div key={s.n} className="card-soft p-7">
              <div className="text-3xl font-bold text-primary">{s.n}</div>
              <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Bundles */}
      <Section
        eyebrow="Готовые наборы"
        title="Комплексные блоки решений"
        description="Подобранные комбинации решений под типовые задачи бизнеса."
      >
        <div className="grid gap-5 md:grid-cols-2">
          {bundles.map((b) => (
            <BundleCard key={b.slug} bundle={b} />
          ))}
        </div>
      </Section>

      {/* Solutions */}
      <Section
        eyebrow="Отдельные решения"
        title="Инструменты, которые работают сами по себе"
        description="Возьмите конкретное решение под конкретную задачу — без обязательств по полному набору."
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {solutions.slice(0, 8).map((s) => (
            <SolutionCard key={s.slug} solution={s} />
          ))}
        </div>
        <div className="mt-10">
          <Link
            to="/catalog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary"
          >
            Все решения в каталоге <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>

      {/* Cases */}
      <Section
        eyebrow="Кейсы"
        title="Что получают компании"
        description="Реальные результаты внедрения решений в бизнесах разного масштаба."
      >
        <div className="grid gap-5 md:grid-cols-3">
          {cases.slice(0, 3).map((c) => (
            <CaseCard key={c.slug} kase={c} />
          ))}
        </div>
        <div className="mt-10">
          <Link
            to="/cases"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary"
          >
            Все кейсы <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>

      {/* FAQ */}
      <Section eyebrow="Вопросы" title="Часто задаваемые вопросы">
        <FAQList items={faq} />
      </Section>

      <FinalCTA />
    </>
  );
}
