# Ruhequelle — Deployment

## Docker Compose (локально)

```bash
# 1. Создайте .env
cp .env.example .env
# Отредактируйте DB_PASSWORD и др.

# 2. Запуск
docker compose up -d

# 3. Проверка
curl http://localhost:8080/api/appointments/availability?start=2025-02-25&end=2025-03-10
```

Backend: http://localhost:8080  
MySQL: localhost:3306 (user: ruhequelle, password: из .env)

## Деплой на хостинг (Railway, Render, Fly.io и т.д.)

### Backend

1. **Соберите JAR:**
   ```bash
   cd backend && mvn clean package -DskipTests
   ```

2. **Переменные окружения:**
   - `DB_HOST` — хост MySQL
   - `DB_PORT` — 3306
   - `DB_NAME` — имя БД
   - `DB_USERNAME` — пользователь
   - `DB_PASSWORD` — пароль
   - `MAIL_PASSWORD` — пароль приложения Gmail
   - `TELEGRAM_BOT_TOKEN` — токен бота
   - `TELEGRAM_CHAT_ID` — chat ID
   - `CORS_ALLOWED_ORIGINS` — URL фронтенда (через запятую)

3. **Порт:** приложение слушает 8080

### MySQL

Используйте managed MySQL (Railway, PlanetScale, Render и т.д.) или свой сервер.

### Frontend

1. Соберите: `cd frontend && npm run build`
2. Загрузите содержимое `frontend/dist/` на хостинг (Vercel, Netlify и т.д.)
3. Укажите `VITE_API_URL` или замените `localhost:8080` в коде на URL вашего API

## Частые проблемы

| Проблема | Решение |
|----------|---------|
| Backend не подключается к MySQL | Проверьте DB_HOST, DB_PORT, пароль. Для Docker: DB_HOST=mysql |
| CORS ошибка | Добавьте URL фронтенда в CORS_ALLOWED_ORIGINS |
| Порт занят | Измените порт в docker-compose (например 8081:8080) |
| Mail не отправляется | Используйте пароль приложения Gmail (не обычный пароль) |
