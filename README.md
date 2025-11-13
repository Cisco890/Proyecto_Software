# Tutoring Platform

A full-stack tutoring platform built with React Native (Expo) and Express.js, connecting students with tutors for academic support.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development](#development)
- [Docker Setup](#docker-setup)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

---

## Tech Stack

### Frontend
- **React Native** 0.81.4
- **Expo** 54.0.10
- **React Navigation** 7
- **Axios** 1.9.0
- **AsyncStorage** 2.2.0

### Backend
- **Node.js** 22
- **Express** 5.1.0
- **Prisma ORM** 6.5.0
- **PostgreSQL** (latest)
- **bcrypt** for password hashing
- **Jest** 30.0.4 for testing

### DevOps
- **Docker** & Docker Compose
- **Git** for version control

---

## Project Structure

```
Proyecto_Software/
├── Backend/                  # Express API
│   ├── routes/              # API routes by domain
│   │   ├── auth.js          # Authentication
│   │   ├── users.js         # User management
│   │   ├── tutors.js        # Tutor operations
│   │   ├── ratings.js       # Rating system
│   │   ├── filters.js       # Search filters
│   │   └── appointments.js  # Session management
│   ├── prisma/              # Database schema & migrations
│   │   ├── schema.prisma
│   │   ├── client.js        # Prisma singleton
│   │   └── seed.js          # Test data
│   ├── test/                # Backend tests
│   ├── app.js               # Express app
│   ├── Dockerfile
│   └── .env.example         # Environment template
│
├── Frontend/                # React Native app
│   ├── src/
│   │   ├── api/            # API client
│   │   ├── components/     # Reusable components
│   │   ├── context/        # Global state
│   │   ├── navigation/     # Navigation config
│   │   ├── screens/        # Screen components
│   │   └── utils/          # Utilities
│   ├── assets/             # Images & fonts
│   ├── __tests__/          # Frontend tests
│   ├── App.js
│   ├── Dockerfile
│   └── .env.example        # Environment template
│
├── docs/                    # Project documentation
│   ├── API.md              # API endpoints
│   ├── phase-1/            # Phase 1 deliverables
│   ├── phase-2/            # Phase 2 deliverables
│   └── corte-1/            # Initial problem statement
│
├── compose.yaml            # Full-stack Docker setup
└── README.md               # This file
```

---

## Prerequisites

### Local Development
- **Node.js** 22.x or higher
- **npm** 9.x or higher
- **PostgreSQL** 14+ (or use Docker)
- **Git**

### Mobile Development
- **Expo Go** app (iOS/Android)
- Or **Android Studio** / **Xcode** for simulators

### Docker (Optional)
- **Docker** 24.x or higher
- **Docker Compose** 2.x or higher

---

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Proyecto_Software
```

### 2. Backend Setup

```bash
cd Backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your database credentials
# DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
# PORT=3001
# NODE_ENV=development

# Run Prisma migrations
npx prisma migrate dev

# Seed the database with test data
npx prisma db seed
```

**Test Users (password: `pass123` for all):**
- Students: `laura@example.com`, `miguel@example.com`, `elena@example.com`, `carlos@example.com`, `valeria@example.com`
- Tutors: `ana.tutor@example.com`, `jorge.tutor@example.com`, `lucia.tutor@example.com`

### 3. Frontend Setup

```bash
cd Frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your API URL
# EXPO_PUBLIC_API_URL=http://localhost:3001/api
# EXPO_PUBLIC_IS_DEV_MODE=true
```

---

## Development

### Start Backend

```bash
cd Backend
npm start
```

Server runs at `http://localhost:3001`

### Start Frontend

```bash
cd Frontend
npm start
```

Options:
- Press `w` for web browser
- Press `a` for Android emulator
- Press `i` for iOS simulator
- Scan QR code with Expo Go app

### Database Management

```bash
# View database in browser
npx prisma studio

# Create new migration
npx prisma migrate dev --name <migration_name>

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Generate Prisma Client (after schema changes)
npx prisma generate
```

---

## Docker Setup

### Full Stack (Backend + Frontend + Database)

```bash
# From project root
docker-compose up --build
```

Services:
- **Backend:** `http://localhost:3001`
- **Frontend:** `http://localhost:8081` (web), ports 19000-19002 (Expo)
- **Database:** `localhost:5432`

### Backend Only

```bash
cd Backend
docker-compose up --build
```

Useful when developing frontend locally but using containerized backend.

### Environment Variables

Create `.env` files from examples:

```bash
cp Backend/.env.example Backend/.env
cp Frontend/.env.example Frontend/.env
```

**Note:** `.env` files are gitignored for security.

---

## API Documentation

Full API documentation available at [docs/API.md](./docs/API.md)

### Base URL
```
http://localhost:3001/api
```

### Quick Reference

| Domain | Endpoints | Description |
|--------|-----------|-------------|
| Auth | `POST /login` | User authentication |
| Users | `GET /tutorias` | List all tutors |
| Users | `POST /tutorias/registro` | User registration |
| Tutors | `GET /tutorias/tutores/:id/rating` | Get tutor rating |
| Appointments | `GET /citas/disponibilidad/:id` | Get tutor availability |
| Appointments | `POST /citas` | Book appointment |
| Ratings | `POST /tutorias/calificaciones` | Rate a tutor |
| Filters | `GET /tutorias/tutores/nombre?busqueda=X` | Search tutors |

See [API.md](./docs/API.md) for complete documentation.

---

## Testing

### Backend Tests

```bash
cd Backend
npm test
```

Tests include:
- Authentication (login, registration)
- Filters (modality, price, experience, etc.)

### Frontend Tests

```bash
cd Frontend
npm test
```

Tests include:
- Component rendering
- Authentication flow
- Navigation

---

## Troubleshooting

### Backend Issues

**Problem:** `Error: P1001: Can't reach database server`
- **Solution:** Check PostgreSQL is running and credentials in `.env` are correct

**Problem:** `prisma.usuarios.findMany is not a function`
- **Solution:** Run `npx prisma generate` to regenerate Prisma Client

**Problem:** Login returns 401 with correct credentials
- **Solution:** Database might have old unhashed passwords. Run `npx prisma migrate reset` to reseed

### Frontend Issues

**Problem:** Network request failed
- **Solution:** Update `EXPO_PUBLIC_API_URL` in `.env` to your machine's IP (not `localhost` on physical devices)

**Problem:** Expo app shows white screen
- **Solution:** Clear cache with `npm start -- --clear`

### Docker Issues

**Problem:** `Frontend/Dockerfile: no such file`
- **Solution:** Ensure you're on the latest version with `git pull`

**Problem:** Port 3001 already in use
- **Solution:** Stop other instances or change PORT in `Backend/.env`

**Problem:** Database connection refused in Docker
- **Solution:** Use `host.docker.internal` instead of `localhost` in DATABASE_URL

---

## Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make changes and commit: `git commit -m "feat: add feature"`
3. Push to branch: `git push origin feature/my-feature`
4. Open a Pull Request

### Commit Conventions

Use conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `refactor:` Code restructuring
- `docs:` Documentation
- `test:` Testing
- `chore:` Maintenance

---

## Project Documentation

- **API Reference:** [docs/API.md](./docs/API.md)
- **Phase 1 Design Thinking:** [docs/phase-1/](./docs/phase-1/)
- **Phase 2 Design Studio:** [docs/phase-2/](./docs/phase-2/)
- **Initial Problem Statement:** [docs/corte-1/](./docs/corte-1/)

---

## License

This project is for educational purposes.

---

## Support

For issues or questions, please open an issue in the repository.
