# readyHub Logic and Data Rules

Этот документ фиксирует бизнес-логику readyHub, справочники, связи данных и правила будущего backend/Supabase-слоя.

## 1. Доменная модель

readyHub строится вокруг выбора готовых бизнес-решений.

Основные сущности:

- `Category` — направление бизнеса, например порядок, инвестиции, маркетинг, команда.
- `Solution` — отдельное решение, которое можно внедрять самостоятельно.
- `Bundle` — готовый набор решений под типовую бизнес-задачу.
- `Case` — пример результата внедрения.
- `Article` — материал базы знаний.
- `FAQItem` — вопрос и ответ.
- `Stage` — стадия бизнеса.

Текущий источник типов: `src/data/types.ts`.

## 2. Стадии бизнеса

Допустимые значения `Stage`:

- `старт`
- `рост`
- `масштабирование`

Правила:

- Не добавлять новую стадию без обновления типа `Stage`, фильтров каталога и будущего enum в базе.
- Решение может относиться к нескольким стадиям.
- Наборы пока не имеют отдельного поля стадии, но могут получить его при развитии каталога.

## 3. Сущности и обязательные поля

`Category`:

- `slug` — уникальный публичный идентификатор.
- `title` — название направления.
- `description` — краткое описание.
- `icon` — ключ lucide-иконки из карты иконок.
- `order` — порядок отображения.

`Solution`:

- `slug` — уникальный публичный идентификатор.
- `title` — название решения.
- `summary` — короткое описание для карточки и SEO.
- `problem` — какую боль решает.
- `audience` — кому подходит.
- `contents` — что входит в решение.
- `result` — ожидаемый результат.
- `categorySlug` — связь с категорией.
- `tags` — поисковые и визуальные теги.
- `stage` — список стадий бизнеса.

`Bundle`:

- `slug` — уникальный публичный идентификатор.
- `title` — название набора.
- `audience` — кому подходит.
- `tasks` — какие задачи закрывает.
- `solutionSlugs` — решения внутри набора.
- `outcome` — итог для бизнеса.
- `categorySlug` — основное направление.

`Case`:

- `slug` — уникальный идентификатор.
- `company` — описание компании.
- `categorySlug` — связанное направление.
- `task` — исходная задача.
- `implemented` — что внедрено.
- `result` — измеримый результат.
- `tags` — отрасль и смысловые теги.

`Article`:

- `slug` — уникальный идентификатор.
- `title` — заголовок.
- `excerpt` — описание для карточки и SEO.
- `body` — текст статьи.
- `tags` — темы статьи.
- `relatedSolutionSlugs` — связанные решения.
- `publishedAt` — дата публикации в ISO-формате.

`FAQItem`:

- `question` — вопрос.
- `answer` — ответ.

## 4. Связи данных

Текущие связи строковые:

- `solutions.categorySlug -> categories.slug`
- `bundles.categorySlug -> categories.slug`
- `bundles.solutionSlugs[] -> solutions.slug`
- `cases.categorySlug -> categories.slug`
- `articles.relatedSolutionSlugs[] -> solutions.slug`

Правила:

- Каждый `slug` должен быть стабильным, человекочитаемым и URL-safe.
- Slug нельзя менять без редиректа или осознанного решения о потере старого URL.
- Нельзя добавлять `categorySlug`, которого нет в `categories`.
- Нельзя добавлять `solutionSlugs`, которых нет в `solutions`.
- Нельзя публиковать статью с пустым `publishedAt`.
- Связанные решения в статье должны быть релевантны теме статьи.

## 5. Текущая логика frontend

Каталог:

- Хранит локальное состояние `view`, `cat`, `stage`, `q`.
- Фильтрует решения по категории, стадии и поисковой строке.
- Фильтрует наборы по категории и поисковой строке.
- Сценарные кнопки меняют категорию и возвращают общий вид.
- Если активны фильтры, доступен сброс.

Динамические страницы:

- Страница категории ищет `Category` по `slug`.
- Страница решения ищет `Solution` по `slug`.
- Страница набора ищет `Bundle` по `slug`.
- Страница статьи ищет `Article` по `slug`.
- Если сущность не найдена, используется `notFound()`.

Контакты:

- Форма сейчас работает локально.
- Submit вызывает `preventDefault()` и показывает состояние `sent`.
- Данные не отправляются наружу.

База знаний:

- Список статей строится из `articles`.
- Детальная статья показывает body через разделение по пустым строкам.
- Связанные решения подтягиваются через `relatedSolutionSlugs`.

## 6. Будущая Supabase-модель

Рекомендуемые таблицы:

- `categories`
- `solutions`
- `bundles`
- `bundle_solutions`
- `cases`
- `articles`
- `faqs`
- `contacts`

Рекомендуемые общие поля:

- `id uuid primary key`
- `slug text unique`
- `created_at timestamptz`
- `updated_at timestamptz`
- `status text` для публикуемых сущностей: `draft`, `published`, `archived`
- `sort_order int` там, где важен порядок

`categories`:

- `slug`
- `title`
- `description`
- `icon`
- `sort_order`
- `status`

`solutions`:

- `slug`
- `title`
- `summary`
- `problem`
- `audience`
- `contents text[]` или jsonb
- `result`
- `category_id`
- `tags text[]`
- `stages text[]`
- `status`
- `seo_title`
- `seo_description`

`bundles`:

- `slug`
- `title`
- `audience`
- `tasks text[]` или jsonb
- `outcome`
- `category_id`
- `status`
- `seo_title`
- `seo_description`

`bundle_solutions`:

- `bundle_id`
- `solution_id`
- `sort_order`

`cases`:

- `slug`
- `company`
- `category_id`
- `task`
- `implemented text[]` или jsonb
- `result`
- `tags text[]`
- `status`

`articles`:

- `slug`
- `title`
- `excerpt`
- `body`
- `tags text[]`
- `related_solution_ids uuid[]` или отдельная join-таблица при усложнении.
- `published_at`
- `status`
- `seo_title`
- `seo_description`

`faqs`:

- `question`
- `answer`
- `category_id nullable`
- `sort_order`
- `status`

`contacts`:

- `name`
- `contact`
- `business`
- `stage`
- `team_size`
- `task`
- `tried`
- `deadline`
- `comment`
- `source_page`
- `status`
- `created_at`

## 7. Backend-правила

Общие правила:

- Backend не должен доверять frontend-данным.
- Все входящие данные валидировать через zod или эквивалентную схему.
- Slug генерировать на сервере или валидировать перед записью.
- Внешние связи проверять до публикации.
- Публичные каталожные запросы должны отдавать только `published`.
- Draft и archived доступны только админскому контуру.

Контактные заявки:

- Frontend отправляет заявку только через server/API слой.
- Клиент не должен иметь прямой write-доступ к таблице `contacts`.
- Для публичной формы обязательны rate limit, server-side validation и spam-protection.
- После успешной записи возвращать только безопасный статус, без внутренних данных.

Публичный каталог:

- Read-only для неавторизованных пользователей.
- Фильтры должны работать по `category`, `stage`, `type`, `q`.
- На малом объёме можно загружать справочники и фильтровать на клиенте.
- При росте каталога поиск и фильтрацию вынести на backend/RPC/view.

Администрирование:

- Админские операции отделять от публичного frontend.
- Для Supabase использовать RLS.
- Публикация сущности должна проверять обязательные поля и валидность связей.
- Удаление опубликованных slug заменять на archive, если URL уже мог попасть в индекс.

## 8. API-слой будущего проекта

Рекомендуемые публичные методы:

- `getCategories()`
- `getCatalog({ category, stage, type, q })`
- `getSolutionBySlug(slug)`
- `getBundleBySlug(slug)`
- `getCases({ category })`
- `getArticles()`
- `getArticleBySlug(slug)`
- `createContactRequest(payload)`

Правила API:

- Возвращать типизированные DTO, совместимые с текущими frontend-типами.
- Не отдавать draft-поля в публичный frontend.
- Ошибка отсутствующей сущности должна превращаться в `notFound()`.
- Ошибка валидации формы должна возвращать список полей и сообщений.
- Ошибка сервера не должна показывать пользователю внутренние детали.

React Query:

- Использовать для запросов к API после появления backend.
- Query keys должны быть стабильными: `["catalog", filters]`, `["solution", slug]`, `["article", slug]`.
- Для справочников использовать разумный staleTime.
- Mutations использовать для `createContactRequest`.

## 9. Валидация

Frontend:

- Формы переводить на react-hook-form + zod.
- Показывать ошибки рядом с полем.
- Required-поля не должны зависеть только от HTML `required`.

Backend:

- Дублировать все критичные проверки.
- Нормализовать строки: trim, ограничение длины, запрет пустых значений.
- Проверять enum-значения `Stage`.
- Проверять формат `publishedAt`/дат.
- Проверять массивы tags, tasks, contents на пустые строки.

Минимальная схема заявки:

- `name` required.
- `contact` required.
- `business` optional.
- `stage` optional enum или `Пока не знаю`.
- `team_size` optional enum.
- `task` optional.
- `tried` optional.
- `deadline` optional.
- `comment` optional.

## 10. Миграции и совместимость

При переходе со статических данных на Supabase:

1. Создать таблицы и RLS.
2. Импортировать текущие данные из `src/data/content.ts`.
3. Проверить все slug и связи.
4. Сделать API/read layer, совместимый с текущими типами.
5. Перевести страницы с прямого импорта данных на API/query layer.
6. Сохранить текущие маршруты и URL.
7. После проверки удалить или превратить `src/data/content.ts` в seed/reference.

Правило совместимости:

- Публичные URL должны оставаться стабильными.
- Изменения структуры данных не должны менять UI без отдельной задачи.
- Новые поля должны иметь fallback или быть обязательными только после миграции данных.

## 11. Контроль качества данных

Перед публикацией новой сущности:

- Slug уникален.
- Title понятен без контекста.
- Summary отвечает на вопрос “что это”.
- Problem описывает боль.
- Audience описывает кому подходит.
- Result описывает бизнес-результат.
- Category существует.
- Tags не дублируют друг друга.
- SEO title/description заданы или могут быть безопасно сгенерированы.
- Для bundle все `solutionSlugs` существуют.
- Для article все `relatedSolutionSlugs` существуют.

## 12. Harness Engineering baseline

Для будущих задач:

- Любая новая бизнес-сущность должна быть описана в типах, данных/API и UI.
- Любая новая связь должна иметь правило валидации.
- Любая новая форма должна иметь frontend и backend validation.
- Любой публичный route должен иметь SEO meta и notFound/error-поведение.
- Любое изменение backend-модели должно сопровождаться миграцией и обновлением этого документа.
