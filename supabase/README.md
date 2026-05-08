# Supabase setup for readyHub

Эти файлы подключают первый этап CRM: заявка с сайта сохраняется в Supabase и отправляет уведомление в Telegram.

## Что создать в Supabase

1. Создать проект Supabase.
2. Открыть SQL Editor и выполнить миграцию:

```txt
supabase/migrations/202605070001_create_contacts.sql
```

Что делает миграция: создаёт таблицу `contacts` для заявок и включает RLS, чтобы публичный frontend не писал в таблицу напрямую.

## Какие secrets добавить в Supabase Edge Function

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
TELEGRAM_CHAT_ID=your-telegram-chat-id
```

Что это делает:

- `SUPABASE_URL` — адрес Supabase-проекта.
- `SUPABASE_SERVICE_ROLE_KEY` — закрытый ключ, которым функция пишет заявку в базу.
- `TELEGRAM_BOT_TOKEN` — токен Telegram-бота.
- `TELEGRAM_CHAT_ID` — чат, куда приходят заявки.

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
