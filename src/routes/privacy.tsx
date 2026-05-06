import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Политика конфиденциальности — Сборка" },
      {
        name: "description",
        content: "Как мы обрабатываем персональные данные на платформе Сборка.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Документы" title="Политика конфиденциальности" />
      <article className="container-page py-16">
        <div className="mx-auto max-w-3xl space-y-6 text-base leading-relaxed text-foreground/85">
          <p>
            Настоящая политика описывает, как платформа «Сборка» собирает, хранит и использует
            персональные данные пользователей.
          </p>
          <h2 className="text-2xl font-bold">1. Какие данные мы собираем</h2>
          <p>
            Имя, контактные данные (телефон, Telegram, email), сведения о бизнесе и комментарии,
            которые вы оставляете в формах на сайте.
          </p>
          <h2 className="text-2xl font-bold">2. Как мы используем данные</h2>
          <p>
            Данные используются исключительно для обработки заявок и подбора решений. Мы не передаём
            данные третьим лицам без вашего согласия.
          </p>
          <h2 className="text-2xl font-bold">3. Хранение и защита</h2>
          <p>Данные хранятся на защищённых серверах. Доступ имеет ограниченный круг сотрудников.</p>
          <h2 className="text-2xl font-bold">4. Ваши права</h2>
          <p>
            Вы можете запросить удаление или изменение своих данных, написав на hello@sborka.ru.
          </p>
          <h2 className="text-2xl font-bold">5. Контакты</h2>
          <p>По вопросам обработки данных: hello@sborka.ru.</p>
        </div>
      </article>
    </>
  );
}
