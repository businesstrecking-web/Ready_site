import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { SolutionCard, BundleCard } from "@/components/site/Cards";
import { FinalCTA } from "@/components/site/CTA";
import { categories, solutions, bundles } from "@/data/content";
import type { Stage } from "@/data/types";

export const Route = createFileRoute("/catalog/")({
  head: () => ({
    meta: [
      { title: "Каталог решений — readyHub" },
      {
        name: "description",
        content:
          "Каталог отдельных решений и готовых наборов для бизнеса. Фильтры по направлению, задаче и стадии компании.",
      },
      { property: "og:title", content: "Каталог решений — readyHub" },
      {
        property: "og:description",
        content: "Подберите решения и наборы под задачи бизнеса в одном пространстве.",
      },
    ],
  }),
  component: CatalogPage,
});

const stages: Stage[] = ["старт", "рост", "масштабирование"];
type View = "all" | "solutions" | "bundles";

const scenarios = [
  {
    title: "Собственник всё держит на себе",
    text: "Начните с ролей, регламентов и ритма управления.",
    categorySlug: "poryadok-v-biznese",
  },
  {
    title: "Продажи и продукт буксуют",
    text: "Проверьте клиента, оффер и путь до сделки.",
    categorySlug: "marketing-i-issledovaniya",
  },
  {
    title: "Команда растёт быстрее системы",
    text: "Соберите KPI, найм, адаптацию и планёрки.",
    categorySlug: "komanda-i-upravlenie",
  },
  {
    title: "Нужно готовиться к капиталу",
    text: "Упакуйте материалы, метрики и воронку инвесторов.",
    categorySlug: "investicii-i-rost",
  },
];

function CatalogPage() {
  const [view, setView] = useState<View>("all");
  const [cat, setCat] = useState<string>("all");
  const [stage, setStage] = useState<Stage | "all">("all");
  const [q, setQ] = useState("");

  const filteredSolutions = useMemo(() => {
    return solutions.filter((s) => {
      if (cat !== "all" && s.categorySlug !== cat) return false;
      if (stage !== "all" && !s.stage.includes(stage)) return false;
      if (
        q &&
        !`${s.title} ${s.summary} ${s.tags.join(" ")}`.toLowerCase().includes(q.toLowerCase())
      )
        return false;
      return true;
    });
  }, [cat, stage, q]);

  const filteredBundles = useMemo(() => {
    return bundles.filter((b) => {
      if (cat !== "all" && b.categorySlug !== cat) return false;
      if (
        q &&
        !`${b.title} ${b.audience} ${b.tasks.join(" ")}`.toLowerCase().includes(q.toLowerCase())
      )
        return false;
      return true;
    });
  }, [cat, q]);

  const hasActiveFilters = view !== "all" || cat !== "all" || stage !== "all" || q.trim() !== "";
  const visibleSolutionsCount = view === "bundles" ? 0 : filteredSolutions.length;
  const visibleBundlesCount = view === "solutions" ? 0 : filteredBundles.length;

  const resetFilters = () => {
    setView("all");
    setCat("all");
    setStage("all");
    setQ("");
  };

  return (
    <>
      <PageHero
        eyebrow="Каталог"
        title="Каталог решений для бизнеса"
        description="Три сценария входа: по направлению, по задаче или через готовый набор. Используйте фильтры или поиск, чтобы найти нужное."
      />

      <div className="container-page py-10">
        <section className="mb-10">
          <div className="mb-5 flex flex-col justify-between gap-2 md:flex-row md:items-end">
            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                С чего начать
              </div>
              <h2 className="mt-2 text-2xl font-bold">Выберите ситуацию, похожую на вашу</h2>
            </div>
            <Link to="/contacts" className="text-sm font-medium text-primary hover:underline">
              Нужен ручной подбор
            </Link>
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {scenarios.map((scenario) => (
              <button
                key={scenario.categorySlug}
                onClick={() => {
                  setCat(scenario.categorySlug);
                  setView("all");
                }}
                className={`scenario-button card-soft card-static p-5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 ${
                  cat === scenario.categorySlug
                    ? "scenario-button-active border-primary bg-primary/5 text-foreground"
                    : ""
                }`}
              >
                <div className="font-semibold">{scenario.title}</div>
                <p className="mt-2 text-sm text-muted-foreground">{scenario.text}</p>
              </button>
            ))}
          </div>
        </section>

        <div className="card-soft card-static mb-8 space-y-5 p-5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Поиск по решениям и наборам"
              className="h-11 w-full rounded-lg border border-[color:var(--hairline)] bg-background pl-10 pr-4 text-sm outline-none focus:border-primary"
            />
          </div>
          <div className="grid gap-5 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Направление
              </div>
              <div className="flex flex-wrap gap-2">
                <FilterButton active={cat === "all"} onClick={() => setCat("all")}>
                  Все
                </FilterButton>
                {categories.map((c) => (
                  <FilterButton key={c.slug} active={cat === c.slug} onClick={() => setCat(c.slug)}>
                    {c.title}
                  </FilterButton>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Тип
              </div>
              <div className="flex rounded-lg border border-[color:var(--hairline)] bg-background p-1 text-sm">
                {(["all", "solutions", "bundles"] as View[]).map((v) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className={`rounded-md px-4 py-2 transition-colors ${view === v ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {v === "all" ? "Все" : v === "solutions" ? "Решения" : "Наборы"}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Стадия компании
            </div>
            <div className="flex flex-wrap gap-2">
              <FilterButton active={stage === "all"} onClick={() => setStage("all")}>
                Любая
              </FilterButton>
              {stages.map((stageOption) => (
                <FilterButton
                  key={stageOption}
                  active={stage === stageOption}
                  onClick={() => setStage(stageOption)}
                >
                  {stageOption}
                </FilterButton>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-8 flex flex-col justify-between gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center">
          <div>
            Найдено: {visibleBundlesCount} наборов и {visibleSolutionsCount} решений
          </div>
          {hasActiveFilters && (
            <button onClick={resetFilters} className="w-fit text-primary hover:underline">
              Сбросить фильтры
            </button>
          )}
        </div>

        {(view === "all" || view === "bundles") && filteredBundles.length > 0 && (
          <section className="mb-14">
            <h2 className="mb-6 text-2xl font-bold">Готовые наборы</h2>
            <div className="grid gap-5 md:grid-cols-2">
              {filteredBundles.map((b) => (
                <BundleCard key={b.slug} bundle={b} />
              ))}
            </div>
          </section>
        )}

        {(view === "all" || view === "solutions") && (
          <section>
            <h2 className="mb-6 text-2xl font-bold">Отдельные решения</h2>
            {filteredSolutions.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filteredSolutions.map((s) => (
                  <SolutionCard key={s.slug} solution={s} />
                ))}
              </div>
            ) : (
              <div className="card-soft p-10 text-center text-muted-foreground">
                По заданным условиям ничего не найдено.{" "}
                <Link to="/contacts" className="text-primary">
                  Опишите задачу
                </Link>{" "}
                — подберём вручную.
              </div>
            )}
          </section>
        )}
      </div>

      <FinalCTA />
    </>
  );
}

function FilterButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm transition-colors ${
        active
          ? "bg-foreground text-background"
          : "border border-[color:var(--hairline)] text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
