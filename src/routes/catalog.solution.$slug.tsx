import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { SolutionCard } from "@/components/site/Cards";
import { FinalCTA } from "@/components/site/CTA";
import { solutions, categories } from "@/data/content";

export const Route = createFileRoute("/catalog/solution/$slug")({
  loader: ({ params }) => {
    const solution = solutions.find((s) => s.slug === params.slug);
    if (!solution) throw notFound();
    return { solution };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.solution.title} — решение | Сборка` },
          { name: "description", content: loaderData.solution.summary },
          { property: "og:title", content: `${loaderData.solution.title} — Сборка` },
          { property: "og:description", content: loaderData.solution.summary },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="container-page py-24 text-center">
      <h1 className="text-4xl font-bold">Решение не найдено</h1>
      <Link to="/catalog" className="mt-6 inline-flex text-primary">
        К каталогу
      </Link>
    </div>
  ),
  errorComponent: ({ error }) => <div className="container-page py-24">{error.message}</div>,
  component: SolutionPage,
});

function SolutionPage() {
  const { solution } = Route.useLoaderData();
  const category = categories.find((c) => c.slug === solution.categorySlug);
  const related = solutions
    .filter((s) => s.categorySlug === solution.categorySlug && s.slug !== solution.slug)
    .slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow={category ? `Направление · ${category.title}` : "Решение"}
        title={solution.title}
        description={solution.summary}
      >
        <div className="flex flex-wrap gap-3">
          <Link
            to="/contacts"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
          >
            Обсудить внедрение <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/catalog"
            className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium text-surface-dark-foreground hover:bg-white/10"
          >
            К каталогу
          </Link>
        </div>
      </PageHero>

      <div className="container-page pt-8 text-sm text-muted-foreground">
        <Link to="/catalog" className="hover:text-foreground">
          Каталог
        </Link>{" "}
        / {solution.title}
      </div>

      <section className="container-page py-16">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="card-soft p-7">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Какую задачу решает
            </div>
            <p className="mt-3 text-base">{solution.problem}</p>
          </div>
          <div className="card-soft p-7">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Кому подходит
            </div>
            <p className="mt-3 text-base">{solution.audience}</p>
          </div>
          <div className="card-soft p-7">
            <div className="text-xs font-semibold uppercase tracking-wider text-success">
              Результат
            </div>
            <p className="mt-3 text-base">{solution.result}</p>
          </div>
        </div>
      </section>

      <section className="container-page py-8">
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="card-soft card-static p-7">
            <h2 className="text-xl font-bold">Когда стоит внедрять</h2>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>Задача повторяется, но каждый раз решается по-разному.</li>
              <li>Результат зависит от конкретного человека, а не от системы.</li>
              <li>Команда тратит время на уточнения, согласования и переделки.</li>
            </ul>
          </div>
          <div className="card-soft card-static p-7">
            <h2 className="text-xl font-bold">Как проходит внедрение</h2>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>Уточняем контекст и критерий результата.</li>
              <li>Адаптируем материалы под процессы компании.</li>
              <li>Фиксируем правила использования и первые контрольные точки.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="container-page py-8">
        <h2 className="text-2xl font-bold md:text-3xl">Что входит в решение</h2>
        <ul className="mt-6 grid gap-3 md:grid-cols-2">
          {solution.contents.map((c: string) => (
            <li key={c} className="card-soft flex items-center gap-3 p-5 text-sm">
              <Check className="h-4 w-4 text-success" />
              {c}
            </li>
          ))}
        </ul>
      </section>

      {related.length > 0 && (
        <section className="container-page py-16">
          <h2 className="mb-8 text-2xl font-bold md:text-3xl">Связанные решения</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((s) => (
              <SolutionCard key={s.slug} solution={s} />
            ))}
          </div>
        </section>
      )}

      <FinalCTA
        title={`Внедрить «${solution.title}»`}
        text="Расскажите о контексте — предложим формат внедрения и сроки."
      />
    </>
  );
}
