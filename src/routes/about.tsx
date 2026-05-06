import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { FinalCTA } from "@/components/site/CTA";

const principles = [
  {
    title: "Системность",
    text: "Каждое решение встроено в общую логику направления и стадии бизнеса.",
  },
  { title: "Практичность", text: "Только инструменты, которые применимы в реальных компаниях." },
  { title: "Скорость запуска", text: "Готовые шаблоны и регламенты экономят месяцы на внедрении." },
  { title: "Понятность", text: "Язык собственника бизнеса, без академизма и канцелярита." },
  {
    title: "Фокус на результате",
    text: "Каждое решение измеримо влияет на конкретный показатель.",
  },
  { title: "Гибкость", text: "Берите отдельные решения или комплексные наборы — как удобно." },
];

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "О платформе — readyHub" },
      {
        name: "description",
        content:
          "readyHub — единое пространство готовых бизнес-решений. Принципы, подход и для кого создана платформа.",
      },
      { property: "og:title", content: "О платформе — readyHub" },
      {
        property: "og:description",
        content: "Как мы отбираем и структурируем решения для собственников и руководителей.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="О платформе"
        title="Единое пространство бизнес-решений"
        description="readyHub — это платформа, где собственники и руководители выбирают готовые инструменты для роста и порядка в компании. Отдельные решения и комплексные наборы — в одной логике выбора."
      />

      <Section eyebrow="Зачем" title="Почему решения собраны в одном месте">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="card-soft p-7">
            <h3 className="text-lg font-semibold">Раньше</h3>
            <p className="mt-3 text-sm text-muted-foreground">
              Бизнес собирал решения по кускам: курсы, консультанты, разрозненные шаблоны. Внедрение
              растягивалось на годы.
            </p>
          </div>
          <div className="card-soft p-7">
            <h3 className="text-lg font-semibold">Сейчас</h3>
            <p className="mt-3 text-sm text-muted-foreground">
              Все решения структурированы по направлениям и задачам. Можно зайти с одной задачи и
              собрать систему за недели.
            </p>
          </div>
        </div>
      </Section>

      <Section eyebrow="Подход" title="Как мы отбираем и структурируем решения">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              n: "01",
              t: "Опыт практиков",
              d: "Каждое решение собрано на основе реальных внедрений в компаниях.",
            },
            {
              n: "02",
              t: "Единая методология",
              d: "Все решения сводятся в общую логику направлений и стадий бизнеса.",
            },
            {
              n: "03",
              t: "Поддержка внедрения",
              d: "Помогаем выбрать формат: самостоятельно, с сопровождением или под ключ.",
            },
          ].map((s) => (
            <div key={s.n} className="card-soft p-7">
              <div className="text-3xl font-bold text-primary">{s.n}</div>
              <h3 className="mt-4 text-lg font-semibold">{s.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Принципы" title="На чём построена платформа">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {principles.map((p) => (
            <div key={p.title} className="card-soft p-7">
              <h3 className="text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Для кого" title="Кому полезна платформа">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              t: "Собственникам",
              d: "Чтобы снять с себя операционку и увидеть систему компании целиком.",
            },
            {
              t: "Руководителям",
              d: "Чтобы выстроить управляемые отделы с понятными результатами.",
            },
            { t: "Командам продукта", d: "Чтобы принимать решения на данных, а не на догадках." },
          ].map((p) => (
            <div key={p.t} className="card-soft p-7">
              <h3 className="text-lg font-semibold">{p.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.d}</p>
            </div>
          ))}
        </div>
      </Section>

      <FinalCTA />
    </>
  );
}
