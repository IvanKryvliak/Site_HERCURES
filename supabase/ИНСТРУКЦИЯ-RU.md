# Настройка реальной аналитики — пошагово

Панель уже находится на `/#/analytics`. После настройки она будет показывать настоящие просмотры страницы и клики по телефону, email и Viber. До подключения Supabase цифры не подставляются.

## Шаг 1. Создай проект Supabase

1. Открой https://supabase.com/ и создай аккаунт/проект.
2. В панели проекта открой **Project Settings → API Keys** (название раздела может немного отличаться).
3. Скопируй **Project URL** и **publishable key**. Legacy **anon key** тоже подходит.

## Шаг 2. Добавь ключи в React-проект

В корневой папке проекта, рядом с `package.json`, находится `.env.example`.

1. В VS Code нажми правой кнопкой по `.env.example` → **Copy**, затем **Paste**.
2. Переименуй копию в `.env`.
3. Вставь свои данные вместо примеров:

   ```env
   VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR_PUBLISHABLE_OR_ANON_KEY
   ```

4. Сохрани файл. Не вставляй сюда `service_role` или `secret` key — только publishable/anon key.
5. Когда будешь публиковать сайт, добавь эти же две переменные (`VITE_SUPABASE_URL` и `VITE_SUPABASE_ANON_KEY`) в Environment Variables/Build settings своего хостинга и заново запусти deployment. `.env` в GitHub не загружай.

## Шаг 3. Создай таблицу статистики

1. В Supabase открой **SQL Editor**.
2. Нажми **New query**.
3. Открой в VS Code файл `supabase/migrations/202610210001_analytics.sql`, скопируй его содержимое и вставь в SQL Editor.
4. Нажми **Run**. Скрипт создаст таблицу событий, правила доступа и SQL-функцию, которая готовит данные для графиков.

## Шаг 4. Создай закрытый аккаунт администратора

1. В Supabase открой **Authentication → Users**.
2. Создай пользователя с email и сильным паролем.
3. В настройках Authentication отключи публичную регистрацию пользователей, если она включена.
4. В Supabase → SQL Editor выполни запрос ниже, заменив email на email созданного пользователя:

   ```sql
   insert into public.analytics_admins (email)
   values (lower('your-admin-email@example.com'))
   on conflict (email) do nothing;
   ```

5. Запиши пароль в менеджер паролей. Страница `/#/analytics` не имеет формы регистрации, а доступ к статистике дополнительно проверяется по allowlist email в базе.

## Шаг 5. Установи Supabase CLI и загрузи функцию

В PowerShell открой корневую папку проекта. Один из вариантов — установить CLI как dev-зависимость проекта:

```powershell
npm install --save-dev supabase
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase functions deploy track-event
```

`YOUR_PROJECT_REF` — идентификатор проекта из URL/настроек Supabase. Команда `login` откроет вход в браузере; `link` свяжет локальную папку с проектом; последняя команда загрузит функцию сбора событий.

Supabase передаёт функции `SUPABASE_URL` и серверные ключи: код поддерживает как legacy `SUPABASE_SERVICE_ROLE_KEY`, так и новый словарь `SUPABASE_SECRET_KEYS`. Секретный ключ не нужно вставлять в React, `.env` или GitHub. Подробности есть в [официальной инструкции Supabase](https://supabase.com/docs/guides/functions/deploy).

## Шаг 6. Запусти и протестируй

```powershell
npm install
npm run dev
```

1. Открой публичную главную страницу сайта.
2. Внизу появится небольшая панель **Nastavení analytiky**. Нажми **Povolit analytiku**, если тестируешь сбор статистики.
3. Нажми на телефон, email или Viber, чтобы проверить учёт соответствующего клика.
4. Перейди на `/#/analytics`, войди в созданный аккаунт и нажми **Обновить**.
5. Проверь production-сборку:

   ```powershell
   npm run lint
   npm run build
   npm run preview
   ```

Если статистика пока нулевая, убедись, что SQL-скрипт выполнен, Edge Function `track-event` развернута, `.env` заполнен и сервер Vite перезапущен. Новые данные появятся только после реальных посещений/кликов и согласия на аналитику. Старые события не появятся задним числом.

## Что именно сохраняется

Таблица записывает тип события, временный идентификатор вкладочной сессии, путь страницы, укрупнённую категорию источника, тип устройства и канал контакта. Приложение не записывает в таблицу имя, телефон, email, полную ссылку реферера, query-параметры или IP-адрес. Это не отменяет необходимости добавить на опубликованный сайт политику конфиденциальности с фактическими сведениями об обработке данных и сроке хранения.
