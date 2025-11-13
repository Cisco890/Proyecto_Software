# API Documentation

Complete REST API reference for the Tutoring Platform.

**Base URL:** `http://localhost:3001/api`

---

## Table of Contents

1. [Authentication](#authentication)
2. [Users](#users)
3. [Tutors](#tutors)
4. [Ratings](#ratings)
5. [Filters](#filters)
6. [Appointments](#appointments)
7. [Error Responses](#error-responses)

---

## Authentication

### Login

Authenticate a user and receive user data.

**Endpoint:** `POST /login`

**Request Body:**
```json
{
  "correo": "ana.tutor@example.com",
  "contrasena": "pass123"
}
```

**Success Response (200):**
```json
{
  "message": "Inicio de sesión exitoso",
  "user": {
    "id_usuario": 6,
    "nombre": "Ana Tutor",
    "correo": "ana.tutor@example.com",
    "telefono": "6666666666",
    "id_perfil": 2
  }
}
```

**Error Responses:**
- `400` - Missing fields
- `401` - Invalid credentials

**cURL Example:**
```bash
curl -X POST http://localhost:3001/api/login \
  -H "Content-Type: application/json" \
  -d '{"correo":"ana.tutor@example.com","contrasena":"pass123"}'
```

---

## Users

### List All Tutors

Get all users with tutor profile (id_perfil = 2).

**Endpoint:** `GET /tutorias`

**Success Response (200):**
```json
[
  {
    "id_usuario": 6,
    "nombre": "Ana Tutor",
    "correo": "ana.tutor@example.com",
    "telefono": "6666666666",
    "id_perfil": 2,
    "foto_perfil": null,
    "tutorInfo": {
      "id": 1,
      "descripcion": "Tutora de matemáticas...",
      "tarifa_hora": 25.00,
      "experiencia": 5,
      "horario": 1,
      "modalidad": "virtual",
      "tutorMaterias": [
        {
          "materia": {
            "id_materia": 1,
            "nombre_materia": "Matemáticas"
          }
        }
      ]
    }
  }
]
```

**cURL Example:**
```bash
curl http://localhost:3001/api/tutorias
```

---

### List Students

Get all users with student profile (id_perfil = 1).

**Endpoint:** `GET /tutorias/usuarios/estudiantes`

**Success Response (200):**
```json
[
  {
    "id_usuario": 1,
    "nombre": "Laura Sánchez",
    "correo": "laura@example.com",
    "telefono": "1111111111",
    "foto_perfil": null
  }
]
```

**cURL Example:**
```bash
curl http://localhost:3001/api/tutorias/usuarios/estudiantes
```

---

### Register User

Create a new user account.

**Endpoint:** `POST /tutorias/registro`

**Request Body:**
```json
{
  "nombre": "Juan Pérez",
  "correo": "juan@example.com",
  "contrasena": "securepass123",
  "telefono": "9999999999",
  "tipo_usuario": "estudiante"
}
```

**Field Notes:**
- `tipo_usuario`: `"estudiante"` (id_perfil=1) or `"tutor"` (id_perfil=2)
- Password is automatically hashed with bcrypt

**Success Response (201):**
```json
{
  "id_usuario": 9,
  "nombre": "Juan Pérez",
  "correo": "juan@example.com",
  "telefono": "9999999999",
  "id_perfil": 1,
  "foto_perfil": "null"
}
```

**Error Responses:**
- `400` - Missing fields or invalid email

**cURL Example:**
```bash
curl -X POST http://localhost:3001/api/tutorias/registro \
  -H "Content-Type: application/json" \
  -d '{
    "nombre":"Juan Pérez",
    "correo":"juan@example.com",
    "contrasena":"securepass123",
    "telefono":"9999999999",
    "tipo_usuario":"estudiante"
  }'
```

---

### Create Profile

Create a new profile type.

**Endpoint:** `POST /tutorias/perfiles`

**Request Body:**
```json
{
  "nombre": "Administrador"
}
```

**Success Response (201):**
```json
{
  "id_perfil": 3,
  "nombre": "Administrador"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3001/api/tutorias/perfiles \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Administrador"}'
```

---

## Tutors

### Get Tutor Rating

Get average rating and total reviews for a tutor.

**Endpoint:** `GET /tutorias/tutores/:id/rating`

**URL Parameters:**
- `id` - Tutor ID

**Success Response (200):**
```json
{
  "rating_promedio": 4.5,
  "total_calificaciones": 10
}
```

**No ratings:**
```json
{
  "rating_promedio": 0,
  "total_calificaciones": 0,
  "message": "Este tutor aún no tiene calificaciones"
}
```

**cURL Example:**
```bash
curl http://localhost:3001/api/tutorias/tutores/6/rating
```

---

### Get Tutor Info by User ID

Get complete tutor information including rating and subjects.

**Endpoint:** `GET /tutorias/tutores/info/usuario/:idUsuario`

**URL Parameters:**
- `idUsuario` - User ID

**Success Response (200):**
```json
{
  "id_tutor": 1,
  "id_usuario": 6,
  "nombre": "Ana Tutor",
  "foto_perfil": null,
  "descripcion": "Tutora con 5 años de experiencia...",
  "horario": 1,
  "modalidad": "virtual",
  "experiencia": 5,
  "tarifa_hora": 25.00,
  "materias": [
    {
      "id_materia": 1,
      "nombre_materia": "Matemáticas"
    }
  ],
  "rating_promedio": 4.50,
  "total_calificaciones": 10,
  "comentarios": [
    {
      "calificacion": 5,
      "comentario": "Excelente tutora!",
      "fecha": "2025-01-15T10:00:00.000Z"
    }
  ]
}
```

**Error Responses:**
- `404` - Tutor not found

**cURL Example:**
```bash
curl http://localhost:3001/api/tutorias/tutores/info/usuario/6
```

---

### Get Tutor Methodology

Get tutor's teaching methodology.

**Endpoint:** `GET /tutorias/tutores/:id/metodologia`

**Success Response (200):**
```json
{
  "metodologia": "Utilizo ejemplos prácticos y ejercicios..."
}
```

**cURL Example:**
```bash
curl http://localhost:3001/api/tutorias/tutores/1/metodologia
```

---

### Get Tutor Subjects

Get subjects taught by a tutor.

**Endpoint:** `GET /tutorias/tutores/:id/tutorias`

**Success Response (200):**
```json
[
  {
    "materia": "Matemáticas",
    "tutor": "Ana Tutor",
    "horario": 1,
    "modalidad": "virtual"
  }
]
```

**Error Responses:**
- `404` - No subjects found

**cURL Example:**
```bash
curl http://localhost:3001/api/tutorias/tutores/1/tutorias
```

---

### Get Tutor Description

Get tutor's description and name.

**Endpoint:** `GET /tutorias/tutores/:id/descripcion`

**Success Response (200):**
```json
{
  "nombre": "Ana Tutor",
  "descripcion": "Tutora con experiencia en matemáticas..."
}
```

**cURL Example:**
```bash
curl http://localhost:3001/api/tutorias/tutores/1/descripcion
```

---

### Create Tutor Info

Add tutor information to a user.

**Endpoint:** `POST /tutorias/tutores/info`

**Request Body:**
```json
{
  "id_usuario": 9,
  "descripcion": "Tutor especializado en física",
  "tarifa_hora": 30.00,
  "experiencia": 3,
  "horario": 0,
  "modalidad": "presencial"
}
```

**Field Notes:**
- `horario`: `0` (mañana), `1` (tarde), `2` (noche)
- `modalidad`: `"virtual"`, `"presencial"`, or `"hibrido"`

**Success Response (201):**
```json
{
  "id": 4,
  "id_usuario": 9,
  "descripcion": "Tutor especializado en física",
  "tarifa_hora": 30.00,
  "experiencia": 3,
  "horario": 0,
  "modalidad": "presencial",
  "metodologia": null,
  "usuario": {
    "id_usuario": 9,
    "nombre": "Juan Pérez"
  }
}
```

**Error Responses:**
- `400` - Missing fields, invalid horario, or user already has tutor info
- `404` - User not found

**cURL Example:**
```bash
curl -X POST http://localhost:3001/api/tutorias/tutores/info \
  -H "Content-Type: application/json" \
  -d '{
    "id_usuario":9,
    "descripcion":"Tutor especializado en física",
    "tarifa_hora":30.00,
    "experiencia":3,
    "horario":0,
    "modalidad":"presencial"
  }'
```

---

### Get Tutor Sessions

Get all sessions for a tutor.

**Endpoint:** `GET /tutorias/tutores/:id/sesiones`

**Success Response (200):**
```json
[
  {
    "materia": "Matemáticas",
    "estudiante": "Laura Sánchez",
    "modalidad": "virtual",
    "horario": 1
  }
]
```

**cURL Example:**
```bash
curl http://localhost:3001/api/tutorias/tutores/6/sesiones
```

---

## Ratings

### Create Rating

Rate a tutor after a session.

**Endpoint:** `POST /tutorias/calificaciones`

**Request Body:**
```json
{
  "id_tutor": 6,
  "id_estudiante": 1,
  "id_sesion": 1,
  "calificacion": 5,
  "comentario": "Excelente tutora, muy clara!"
}
```

**Field Notes:**
- `calificacion`: Integer from 1-5
- `comentario`: Optional

**Success Response (201):**
```json
{
  "id_calificacion": 4,
  "id_tutor": 6,
  "id_estudiante": 1,
  "id_sesion": 1,
  "calificacion": 5,
  "comentario": "Excelente tutora, muy clara!",
  "fecha_calificacion": "2025-01-15T10:00:00.000Z",
  "tutor": { ... },
  "estudiante": { ... },
  "sesion": { ... }
}
```

**Error Responses:**
- `400` - Missing fields or rating already exists for this session
- `404` - Session, tutor, or student not found

**cURL Example:**
```bash
curl -X POST http://localhost:3001/api/tutorias/calificaciones \
  -H "Content-Type: application/json" \
  -d '{
    "id_tutor":6,
    "id_estudiante":1,
    "id_sesion":1,
    "calificacion":5,
    "comentario":"Excelente tutora!"
  }'
```

---

## Filters

### Search Tutors by Name

Search tutors by name (case-insensitive).

**Endpoint:** `GET /tutorias/tutores/nombre?busqueda={name}`

**Query Parameters:**
- `busqueda` - Search term

**Success Response (200):**
```json
[
  {
    "id_usuario": 6,
    "nombre": "Ana Tutor",
    "tutorInfo": { ... }
  }
]
```

**cURL Example:**
```bash
curl "http://localhost:3001/api/tutorias/tutores/nombre?busqueda=ana"
```

---

### Filter by Rating

Get tutors with minimum rating.

**Endpoint:** `GET /tutorias/tutores/rating?minRating={rating}`

**Query Parameters:**
- `minRating` - Minimum average rating (float)

**Success Response (200):**
```json
[
  {
    "id_usuario": 6,
    "nombre": "Ana Tutor",
    "tutorInfo": { ... }
  }
]
```

**cURL Example:**
```bash
curl "http://localhost:3001/api/tutorias/tutores/rating?minRating=4.0"
```

---

### Filter by Price

Get tutors with maximum hourly rate.

**Endpoint:** `GET /tutorias/tutores/precio?maxPrecio={price}`

**Query Parameters:**
- `maxPrecio` - Maximum hourly rate (float)

**Success Response (200):**
```json
[
  {
    "id": 1,
    "tarifa_hora": 25.00,
    "usuario": { ... }
  }
]
```

**cURL Example:**
```bash
curl "http://localhost:3001/api/tutorias/tutores/precio?maxPrecio=30.00"
```

---

### Filter by Modality

Get tutors by teaching modality.

**Endpoint:** `GET /tutorias/tutores/modalidad/:modalidad`

**URL Parameters:**
- `modalidad` - `virtual`, `presencial`, or `hibrido`

**Success Response (200):**
```json
[
  {
    "id": 1,
    "modalidad": "virtual",
    "usuario": { ... }
  }
]
```

**cURL Example:**
```bash
curl http://localhost:3001/api/tutorias/tutores/modalidad/virtual
```

---

### Filter by Subject

Get tutors teaching a specific subject.

**Endpoint:** `GET /tutorias/tutores/materia/:idMateria`

**URL Parameters:**
- `idMateria` - Subject ID

**Success Response (200):**
```json
[
  {
    "id": 1,
    "tutor": {
      "usuario": {
        "nombre": "Ana Tutor"
      }
    },
    "materia": {
      "nombre_materia": "Matemáticas"
    }
  }
]
```

**cURL Example:**
```bash
curl http://localhost:3001/api/tutorias/tutores/materia/1
```

---

### Filter by Hour

Get tutors available at specific hour.

**Endpoint:** `GET /tutorias/tutores/horario/:hora`

**URL Parameters:**
- `hora` - Hour (0-23)

**Success Response (200):**
```json
[
  {
    "id": 1,
    "horario": 14,
    "usuario": { ... }
  }
]
```

**cURL Example:**
```bash
curl http://localhost:3001/api/tutorias/tutores/horario/14
```

---

### Filter by Experience

Get tutors with minimum years of experience.

**Endpoint:** `GET /tutorias/tutores/experiencia?minExperiencia={years}`

**Query Parameters:**
- `minExperiencia` - Minimum years of experience (integer)

**Success Response (200):**
```json
[
  {
    "id": 1,
    "experiencia": 5,
    "usuario": { ... }
  }
]
```

**cURL Example:**
```bash
curl "http://localhost:3001/api/tutorias/tutores/experiencia?minExperiencia=3"
```

---

### Filter by Schedule

Get tutors by time of day.

**Endpoint:** `GET /tutorias/horarios/:horario`

**URL Parameters:**
- `horario` - Schedule type (morning/afternoon/evening)

**Success Response (200):**
```json
[
  {
    "tutor": {
      "usuario": {
        "nombre": "Ana Tutor"
      }
    }
  }
]
```

**cURL Example:**
```bash
curl http://localhost:3001/api/tutorias/horarios/tarde
```

---

## Appointments

### Get Tutor Availability

Get occupied time blocks for a tutor.

**Endpoint:** `GET /citas/disponibilidad/:idTutor`

**URL Parameters:**
- `idTutor` - Tutor ID

**Success Response (200):**
```json
{
  "bloques_ocupados": [
    "2025-01-20T14:00:00.000Z",
    "2025-01-22T16:00:00.000Z"
  ]
}
```

**cURL Example:**
```bash
curl http://localhost:3001/api/citas/disponibilidad/6
```

---

### Create Appointment

Book a new tutoring session.

**Endpoint:** `POST /citas`

**Request Body:**
```json
{
  "id_tutor": 6,
  "id_estudiante": 1,
  "id_materia": 1,
  "fecha_hora": "2025-01-25T14:00:00.000Z",
  "duracion_min": 60
}
```

**Field Notes:**
- `duracion_min` - Optional, session duration in minutes

**Success Response (201):**
```json
{
  "id_sesion": 7,
  "id_tutor": 6,
  "id_estudiante": 1,
  "id_materia": 1,
  "fecha_hora": "2025-01-25T14:00:00.000Z",
  "duracion_min": 60,
  "estado": "pendiente",
  "fecha_creacion": "2025-01-15T10:00:00.000Z"
}
```

**Error Responses:**
- `400` - Missing required fields

**cURL Example:**
```bash
curl -X POST http://localhost:3001/api/citas \
  -H "Content-Type: application/json" \
  -d '{
    "id_tutor":6,
    "id_estudiante":1,
    "id_materia":1,
    "fecha_hora":"2025-01-25T14:00:00.000Z",
    "duracion_min":60
  }'
```

---

### Get User Sessions

Get sessions for a user (as student or tutor) with optional filters.

**Endpoint:** `GET /citas/usuarios/:id/sesiones`

**URL Parameters:**
- `id` - User ID

**Query Parameters:**
- `rol` - `estudiante` or `tutor` (default: `estudiante`)
- `estado` - `pendiente`, `completada`, `en_curso`, or `cancelada`
- `futuras` - `true` or `false` (filter future sessions)

**Success Response (200):**
```json
[
  {
    "id_sesion": 1,
    "fecha_hora": "2025-01-20T14:00:00.000Z",
    "estado": "pendiente",
    "duracion_min": 60,
    "estudiante": {
      "id_usuario": 1,
      "nombre": "Laura Sánchez"
    },
    "tutor": {
      "id_usuario": 6,
      "nombre": "Ana Tutor"
    },
    "materia": {
      "id_materia": 1,
      "nombre_materia": "Matemáticas"
    }
  }
]
```

**cURL Examples:**
```bash
# Get all student sessions
curl "http://localhost:3001/api/citas/usuarios/1/sesiones?rol=estudiante"

# Get pending tutor sessions
curl "http://localhost:3001/api/citas/usuarios/6/sesiones?rol=tutor&estado=pendiente"

# Get future sessions only
curl "http://localhost:3001/api/citas/usuarios/1/sesiones?futuras=true"
```

---

### Update Session Status

Change the status of a session.

**Endpoint:** `PUT /citas/sesiones/:idSesion/estado`

**URL Parameters:**
- `idSesion` - Session ID

**Request Body:**
```json
{
  "estado": "completada"
}
```

**Valid States:**
- `pendiente`
- `completada`
- `en_curso`
- `cancelada`

**Success Response (200):**
```json
{
  "id_sesion": 1,
  "estado": "completada",
  "fecha_hora": "2025-01-20T14:00:00.000Z",
  "estudiante": { ... },
  "tutor": { ... },
  "materia": { ... }
}
```

**Error Responses:**
- `400` - Invalid state
- `404` - Session not found

**cURL Example:**
```bash
curl -X PUT http://localhost:3001/api/citas/sesiones/1/estado \
  -H "Content-Type: application/json" \
  -d '{"estado":"completada"}'
```

---

## Error Responses

All endpoints follow a consistent error response format.

### Common Error Codes

| Code | Meaning |
|------|---------|
| `400` | Bad Request - Invalid or missing parameters |
| `401` | Unauthorized - Invalid credentials |
| `404` | Not Found - Resource doesn't exist |
| `500` | Internal Server Error - Server-side error |

### Error Response Format

```json
{
  "error": "Description of the error"
}
```

### Examples

**400 Bad Request:**
```json
{
  "error": "Todos los campos son obligatorios"
}
```

**401 Unauthorized:**
```json
{
  "error": "Credenciales incorrectas"
}
```

**404 Not Found:**
```json
{
  "error": "Tutor no encontrado"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Error del servidor"
}
```

---

## Rate Limiting

Currently, there are no rate limits implemented. This may be added in future versions.

---

## Authentication

**Current Implementation:** No token-based authentication (JWT) is implemented yet.

**Future:** JWT tokens will be added for secure API access.

---

## Changelog

### v1.0.0 (2025-01-13)
- Initial API documentation
- 24 endpoints across 6 domains
- bcrypt password hashing
- Reorganized routes by domain

---

For more information, see the [main README](../README.md).
