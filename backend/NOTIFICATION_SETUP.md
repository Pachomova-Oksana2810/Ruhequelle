# Настройка уведомлений (Email + Telegram)

При каждой новой записи клиента вы получаете:
- **Email** на koldakova.anna88@gmail.com
- **Сообщение в Telegram** на @koldakova_anna

## 1. Email (Gmail)

1. Создайте **пароль приложения** в Google:
   - Аккаунт Google → Безопасность → Двухэтапная аутентификация (включить)
   - Пароли приложений → Создать → Скопируйте пароль

2. Запустите приложение с переменной окружения:
   ```bash
   export MAIL_PASSWORD="ваш_пароль_приложения"
   ```

## 2. Telegram

1. Создайте бота через [@BotFather](https://t.me/BotFather):
   - Отправьте `/newbot`
   - Укажите имя и username бота
   - Скопируйте **токен** (например, `7123456789:AAH...`)

2. Узнайте свой **chat_id**:
   - Напишите своему боту `/start` или используйте [@userinfobot](https://t.me/userinfobot)
   - Скопируйте числовой **Id** (chat_id)

3. Запустите приложение с переменными:
   ```bash
   export TELEGRAM_BOT_TOKEN="ваш_токен_от_BotFather"
   export TELEGRAM_CHAT_ID="ваш_chat_id"
   ```

## Вариант 1: Локальный профиль (для разработки)

Создайте `application-local.yml` (уже в .gitignore) с вашими данными.
Запуск:
```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

## Вариант 2: Переменные окружения (для продакшена)

```bash
export MAIL_PASSWORD="xxxx xxxx xxxx xxxx"
export TELEGRAM_BOT_TOKEN="7123456789:AAH..."
export TELEGRAM_CHAT_ID="123456789"
java -jar backend.jar
```
