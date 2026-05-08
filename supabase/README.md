# Supabase setup for readyHub

Эти файлы подключают первый этап CRM: заявка с сайта сохраняется в Supabase и отправляет уведомление в Telegram.

## Что создать в Supabase

1. Создать проект Supabase.
2. Открыть SQL Editor и выполнить миграцию:

```txt
supabase/migrations/202605070001_create_contacts.sql
```

Что делает миграция: создаёт таблицу `contacts` для заявок и включает RLS, чтобы публичный frontend не писал в таблицу напрямую.

3. Для CRM-полей выполнить вторую миграцию:

```txt
supabase/migrations/202605080001_extend_contacts_crm.sql
```

Что делает миграция:

- добавляет к заявкам `priority`, `assigned_to`, `crm_note`, `next_contact_at`, `closed_at`;
- создаёт таблицу `contact_events` для истории действий по заявке;
- добавляет индексы для быстрых фильтров по статусу, приоритету и дате следующего контакта;
- обновляет `updated_at`, `status_changed_at` и `closed_at` автоматически при смене статуса.

## Какие secrets нужны в Supabase Edge Function

Эти значения Supabase даёт функциям автоматически, руками их добавлять не нужно:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Эти значения нужно добавить руками в Edge Functions → Secrets:

```bash
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
TELEGRAM_CHAT_ID=your-telegram-chat-id
ADMIN_PASSWORD=your-admin-password
```

Что это делает:

- `SUPABASE_URL` — адрес Supabase-проекта, встроен Supabase.
- `SUPABASE_SERVICE_ROLE_KEY` — закрытый ключ, которым функция пишет заявку в базу, встроен Supabase.
- `TELEGRAM_BOT_TOKEN` — токен Telegram-бота.
- `TELEGRAM_CHAT_ID` — чат, куда приходят заявки.
- `ADMIN_PASSWORD` — пароль для входа на страницу `/admin`.

Не добавлять `SUPABASE_SERVICE_ROLE_KEY` в frontend `.env`.

## Какие env добавить в сайт

Создать `.env` рядом с `.env.example`:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
```

Что это делает:

- frontend узнаёт, куда отправлять заявку;
- anon key публичный, его можно использовать в браузере;
- секретный service role key остаётся только в Supabase Function.

## Как работает поток

1. Пользователь заполняет форму на `/contacts`.
2. Сайт отправляет POST-запрос в `contact-submit`.
3. Edge Function валидирует имя и контакт.
4. Edge Function сохраняет заявку в `contacts`.
5. Edge Function отправляет уведомление в Telegram.
6. Сайт показывает состояние “Заявка отправлена”.

## Как работает мини-CRM

1. Откройте `/admin`.
2. Введите пароль из секрета `ADMIN_PASSWORD`.
3. Сайт вызывает Edge Function `admin-contacts`.
4. Функция проверяет пароль, читает заявки из `contacts` и возвращает их в интерфейс.
5. При смене статуса функция обновляет поле `status` в таблице.
6. Каждая смена статуса пишется в `contact_events`, чтобы позже видеть историю обработки.

Для функции `admin-contacts` также нужно выключить JWT verification в настройках Supabase, если функция создаётся вручную через UI.
