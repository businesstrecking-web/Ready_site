import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="hairline-t mt-24 bg-muted/40">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-1 font-display text-lg font-bold">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-extrabold text-primary-foreground">
              R
            </span>
            eadyHub
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Платформа готовых решений для бизнеса. Отдельные инструменты и комплексные наборы под
            задачи компании в одном пространстве.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Навигация</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/catalog" className="hover:text-foreground">
                Каталог решений
              </Link>
            </li>
            <li>
              <Link to="/cases" className="hover:text-foreground">
                Кейсы
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-foreground">
                О платформе
              </Link>
            </li>
            <li>
              <Link to="/blog" className="hover:text-foreground">
                База знаний
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Контакты</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>Telegram: @readyhub</li>
            <li>Email: hello@readyhub.ru</li>
            <li>Пн–Пт, 10:00–19:00</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Документы</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/privacy" className="hover:text-foreground">
                Политика конфиденциальности
              </Link>
            </li>
            <li>
              <Link to="/contacts" className="hover:text-foreground">
                Оставить заявку
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="hairline-t">
        <div className="container-page flex flex-col items-start justify-between gap-2 py-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <span>© 2026 readyHub. Все права защищены.</span>
          <span>Платформа готовых решений для бизнеса</span>
        </div>
      </div>
    </footer>
  );
}
