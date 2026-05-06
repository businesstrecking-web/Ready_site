import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useState } from "react";
import { Send, Mail, MessageCircle, Clock, Briefcase } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/contacts")({
  head: () => ({
    meta: [
      { title: "Контакты — Сборка" },
      {
        name: "description",
        content: "Оставьте заявку — соберём подходящие решения под задачи бизнеса.",
      },
      { property: "og:title", content: "Контакты — Сборка" },
      {
        property: "og:description",
        content: "Свяжитесь с командой платформы готовых решений для бизнеса.",
      },
    ],
  }),
  component: ContactsPage,
});

function ContactsPage() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <PageHero
        eyebrow="Контакты"
        title="Расскажите о задаче"
        description="Опишите, что важно решить — соберём подходящие отдельные решения или готовый набор."
      />

      <div className="container-page py-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="card-soft card-static w-full p-6 md:p-10"
          >
            {sent ? (
              <div className="py-10 text-center">
                <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success">
                  <Send className="h-5 w-5" />
                </div>
                <h2 className="mt-5 text-2xl font-bold">Заявка отправлена</h2>
                <p className="mt-3 text-sm text-muted-foreground">
                  Свяжемся в течение рабочего дня и предложим формат подбора решений.
                </p>
                <div className="mx-auto mt-6 max-w-md rounded-lg bg-muted p-4 text-left text-sm">
                  <div className="font-medium">Что дальше</div>
                  <ul className="mt-2 space-y-1 text-muted-foreground">
                    <li>Уточним задачу и стадию бизнеса.</li>
                    <li>Подберём отдельные решения или готовый набор.</li>
                    <li>Предложим формат внедрения и первые шаги.</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="grid gap-5">
                <Field label="Имя">
                  <input
                    required
                    name="name"
                    className="form-input"
                    placeholder="Как к вам обращаться"
                  />
                </Field>
                <Field label="Телефон или Telegram">
                  <input
                    required
                    name="contact"
                    className="form-input"
                    placeholder="+7 ... или @username"
                  />
                </Field>
                <Field label="Тип бизнеса">
                  <input
                    name="business"
                    className="form-input"
                    placeholder="Например: производство, IT-сервис, ритейл"
                  />
                </Field>
                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Стадия бизнеса">
                    <select name="stage" className="form-input">
                      <option>Старт</option>
                      <option>Рост</option>
                      <option>Масштабирование</option>
                      <option>Пока не знаю</option>
                    </select>
                  </Field>
                  <Field label="Размер команды">
                    <select name="team" className="form-input">
                      <option>До 10 человек</option>
                      <option>10-50 человек</option>
                      <option>50-150 человек</option>
                      <option>150+ человек</option>
                    </select>
                  </Field>
                </div>
                <Field label="Задача">
                  <input name="task" className="form-input" placeholder="Что хочется решить" />
                </Field>
                <Field label="Что уже пробовали">
                  <textarea
                    name="tried"
                    rows={3}
                    className="form-input resize-none"
                    placeholder="Например: регламенты, найм, CRM, консультации"
                  />
                </Field>
                <Field label="Когда нужен результат">
                  <input
                    name="deadline"
                    className="form-input"
                    placeholder="Например: за месяц, к кварталу, перед раундом"
                  />
                </Field>
                <Field label="Комментарий">
                  <textarea
                    name="comment"
                    rows={4}
                    className="form-input resize-none"
                    placeholder="Контекст, стадия бизнеса, ожидания"
                  />
                </Field>
                <button
                  type="submit"
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Отправить заявку <Send className="h-4 w-4" />
                </button>
                <p className="text-xs text-muted-foreground">
                  Нажимая кнопку, вы соглашаетесь с{" "}
                  <Link to="/privacy" className="text-primary hover:underline">
                    политикой конфиденциальности
                  </Link>
                  .
                </p>
              </div>
            )}
          </form>

          <div className="space-y-4">
            <ContactRow
              href="https://t.me/sborka"
              icon={<MessageCircle className="h-5 w-5" />}
              title="Telegram"
              value="@sborka"
            />
            <ContactRow
              href="mailto:hello@sborka.ru"
              icon={<Mail className="h-5 w-5" />}
              title="Email"
              value="hello@sborka.ru"
            />
            <ContactRow
              icon={<Clock className="h-5 w-5" />}
              title="График связи"
              value="Пн–Пт, 10:00–19:00 (МСК)"
            />
            <ContactRow
              icon={<Briefcase className="h-5 w-5" />}
              title="Формат работы"
              value="Подбор, сопровождение или внедрение под ключ"
            />
          </div>
        </div>
      </div>
    </>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function ContactRow({
  href,
  icon,
  title,
  value,
}: {
  href?: string;
  icon: ReactNode;
  title: string;
  value: string;
}) {
  const content = (
    <>
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </div>
        <div className="mt-1 font-medium">{value}</div>
      </div>
    </>
  );

  if (href) {
    return (
      <a href={href} className="card-soft flex items-start gap-4 p-6">
        {content}
      </a>
    );
  }

  return <div className="card-soft card-static flex items-start gap-4 p-6">{content}</div>;
}
