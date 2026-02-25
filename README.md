# Ruhequelle

A modern website for a massage and beauty salon in Koblenz, Germany. Built with React and Spring Boot, it offers online appointment booking, a service catalog, gallery, and customer reviews.

![React](https://img.shields.io/badge/React-19-61dafb?logo=react)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.0-6db33f?logo=spring-boot)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7-646cff?logo=vite)

## Features

- **Home** — Hero section, current promotions and special offers
- **About** — Therapist profile, experience, and certificates
- **Services** — Massage types with descriptions and prices
- **Gallery & Reviews** — Video gallery and customer reviews (stored in localStorage)
- **Online Booking** — Calendar with available time slots, form submission
- **Notifications** — Email + Telegram alerts when a new appointment is booked
- **Legal** — Impressum and Datenschutz (GDPR) pages

## Tech Stack

| Layer    | Technology                    |
|----------|-------------------------------|
| Frontend | React 19, TypeScript, Vite 7   |
| Backend  | Spring Boot 4, Java 21        |
| Database | MySQL (prod) / H2 (dev)       |
| Styling  | CSS, React Icons              |

## Project Structure

```
Ruhequelle/
├── frontend/          # React + Vite SPA
│   ├── src/
│   │   ├── pages/     # Home, About, Services, Booking, Gallery, etc.
│   │   ├── App.tsx
│   │   └── App.css
│   └── public/
│       ├── images/
│       └── videos/
├── backend/           # Spring Boot REST API
│   └── src/main/java/massage/ruhequelle/
│       ├── controller/
│       ├── service/
│       ├── repository/
│       └── model/
└── pom.xml            # Parent Maven project
```

## Prerequisites

- **Node.js** 18+ (for frontend)
- **Java 21** (for backend)
- **Maven** 3.8+
- **MySQL** 8 (optional; use H2 for local dev)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/ruhequelle.git
cd ruhequelle
```

### 2. Run the backend

**With H2 (no MySQL required):**
```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

**With MySQL:**
```bash
cd backend
mvn spring-boot:run
# Set DB_HOST, DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD if needed
```

Backend runs at `http://localhost:8080`.

### 3. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

### 4. Build for production

```bash
# Backend
cd backend && mvn clean package

# Frontend
cd frontend && npm run build
# Output in frontend/dist/
```

## Configuration

### Database

| Variable   | Default   | Description        |
|------------|-----------|--------------------|
| DB_HOST    | localhost | MySQL host         |
| DB_PORT    | 3306      | MySQL port         |
| DB_NAME    | ruhequelle| Database name      |
| DB_USERNAME| root      | Database user      |
| DB_PASSWORD| (empty)   | Database password  |

### Notifications (Email + Telegram)

When a client books an appointment, you receive:
- **Email** to the configured address
- **Telegram** message to your chat

| Variable           | Description                    |
|--------------------|--------------------------------|
| MAIL_PASSWORD      | Gmail app password             |
| TELEGRAM_BOT_TOKEN | Bot token from @BotFather      |
| TELEGRAM_CHAT_ID   | Your chat ID (from @userinfobot)|

See [backend/NOTIFICATION_SETUP.md](backend/NOTIFICATION_SETUP.md) for detailed setup.

## API Endpoints

| Method | Endpoint                              | Description                    |
|--------|---------------------------------------|--------------------------------|
| GET    | `/api/appointments/availability`      | Get available slots (start, end) |
| POST   | `/api/appointments`                   | Create appointment            |
| GET    | `/api/appointments`                   | List all appointments         |
| GET    | `/api/appointments/calendar/{id}`     | Export single appointment ICS |
| GET    | `/api/appointments/calendar`          | Export all appointments ICS   |

## License

Private project. All rights reserved.
