#  UVG Tutoring Platform

A full-stack tutoring management application built for **Universidad del Valle de Guatemala**, enabling students to schedule tutoring sessions, leave reviews, and connect with tutors — all from a single responsive platform.

---

##  Overview

The UVG Tutoring Platform streamlines the academic support process by providing a dedicated space for students, tutors, and administrators. Built with **Expo** for cross-platform compatibility, the app works seamlessly on both desktop and mobile devices, with encrypted user data for enhanced security.

---

##  User Roles

###  Student
- Schedule tutoring appointments
- Submit and view tutor reviews
- View their own upcoming appointments

###  Tutor
- Manage and update availability schedules
- Accept or decline appointment requests
- View pending and past appointments
- Read student reviews

###  Administrator
- All student and tutor capabilities
- View and manage all registered users

---

##  Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Expo (React Native), JavaScript, HTML, CSS |
| Backend | Node.js |
| Reverse Proxy | Nginx |
| Containerization | Docker (Docker Compose) |
| Security | Encrypted user data |

---

##  Installation & Setup

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Docker](https://www.docker.com/) & Docker Compose
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

```bash
npm install -g expo-cli
```

---

### 1. Clone the Repository

```bash
git clone https://github.com/Cisco890/Proyecto_Software.git
cd Proyecto_Software
```

---

### 2. Backend Setup

```bash
cd Backend
npm install
```

Configure your environment variables by creating a `.env` file inside `Backend/`:

```env
PORT=your_port
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
JWT_SECRET=your_jwt_secret
```

---

### 3. Frontend Setup

```bash
cd ../Frontend
npm install
```

---

### 4. Run with Docker (Recommended)

From the root of the project:

```bash
docker compose up --build
```

This will spin up the backend, frontend, and Nginx reverse proxy together.

---

### 5. Run Locally (Without Docker)

**Backend:**
```bash
cd Backend
npm start
```

**Frontend:**
```bash
cd Frontend
npx expo start
```

Then scan the QR code with the Expo Go app on your mobile device, or press `w` to open in a web browser.

---

##  Project Structure

```
Proyecto_Software/
├── Backend/          # Node.js API server
├── Frontend/         # Expo (React Native) app
├── .github/          # GitHub Actions workflows
├── compose.yaml      # Docker Compose configuration
├── nginx.conf        # Nginx reverse proxy config
└── README.md
```

---

##  Security

User information is encrypted to ensure data privacy and compliance with security best practices.

---

##  Contributors

Thanks to the team behind this project:

- [@Cisco890](https://github.com/Cisco890)
- [@0liRem](https://github.com/0liRem)
- [@SebastianUVG](https://github.com/SebastianUVG)
- [@cru23110](https://github.com/cru23110)
- [@luispedrolira](https://github.com/luispedrolira)


---

*Developed as part of a Software Engineering project at Universidad del Valle de Guatemala.*
