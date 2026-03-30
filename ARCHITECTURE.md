# Arquitectura — Sistema Académico

## Índice
1. [Descripción general](#1-descripción-general)
2. [Stack tecnológico](#2-stack-tecnológico)
3. [Estructura de directorios](#3-estructura-de-directorios)
4. [Modelo de datos](#4-modelo-de-datos)
5. [Arquitectura del backend](#5-arquitectura-del-backend)
6. [API — Endpoints](#6-api--endpoints)
7. [Middlewares](#7-middlewares)
8. [Arquitectura del frontend](#8-arquitectura-del-frontend)
9. [Autenticación y roles](#9-autenticación-y-roles)
10. [Flujos principales](#10-flujos-principales)

---

## 1. Descripción general

Sistema web para la gestión académica de un centro educativo. Permite administrar estudiantes, docentes, aulas, materias, asignaciones de docentes, toma de asistencia y registro de calificaciones.

**Roles del sistema:**

| Rol | Acceso |
|---|---|
| `administrador` | Gestión completa: estudiantes, docentes, aulas, materias, asignaciones |
| `docente` | Toma de asistencia y registro de calificaciones en sus materias asignadas |

---

## 2. Stack tecnológico

### Backend

| Tecnología | Versión | Uso |
|---|---|---|
| Node.js | — | Entorno de ejecución |
| Express | ^5.2 | Framework HTTP |
| Sequelize | ^6.37 | ORM |
| MySQL | — | Base de datos relacional |
| JSON Web Token (RS256) | ^9.0 | Autenticación con clave pública/privada |
| bcrypt | ^6.0 | Hash de contraseñas |
| express-validator | latest | Validación de entradas |

### Frontend

| Tecnología | Versión | Uso |
|---|---|---|
| React | — | Librería de UI |
| Vite | — | Bundler / dev server |
| Tailwind CSS | — | Estilos utilitarios |
| React Router v6 | — | Enrutamiento SPA |
| Axios | — | Cliente HTTP con interceptores |
| Context API | — | Estado global de autenticación |

---

## 3. Estructura de directorios

```
Sistema Academico/
├── Backend/
│   └── src/
│       ├── app.js                  # Configuración de Express y registro de rutas
│       ├── server.js               # Punto de entrada, levanta el servidor
│       ├── db/
│       │   ├── connection.js       # Instancia de Sequelize
│       │   └── sync.js             # Sincronización de modelos con la BD
│       ├── models/
│       │   ├── index.js            # Inicializa todos los modelos y ejecuta asociaciones
│       │   ├── Usuario.model.js
│       │   ├── Aula.model.js
│       │   ├── Estudiante.model.js
│       │   ├── Docente.model.js
│       │   ├── Materia.model.js
│       │   ├── DocenteMateria.model.js
│       │   ├── ListaAsistencia.model.js
│       │   ├── DetalleAsistencia.model.js
│       │   └── Nota.model.js
│       ├── controllers/
│       │   ├── Auth.controller.js
│       │   ├── Estudiante.controlles.js
│       │   ├── Docente.controller.js
│       │   ├── Materia.controller.js
│       │   ├── Aula.controller.js
│       │   ├── DocenteMateria.controller.js
│       │   ├── Asistencia.controller.js
│       │   └── Nota.controller.js
│       ├── service/
│       │   ├── Base.service.js     # CRUD genérico + paginación + manejo de duplicados
│       │   ├── Auth.service.js
│       │   ├── Estudiante.service.js
│       │   ├── Docente.service.js
│       │   ├── Materia.service.js
│       │   ├── Aula.service.js
│       │   ├── DocenteMateria.service.js
│       │   ├── Asistencia.service.js
│       │   └── Nota.service.js
│       ├── routes/
│       │   ├── Auth.route.js
│       │   ├── Estudiante.route.js
│       │   ├── Doncete.route.js
│       │   ├── Materia.route.js
│       │   ├── Aula.route.js
│       │   ├── DocenteMateria.route.js
│       │   ├── Asistencia.route.js
│       │   └── Nota.route.js
│       ├── middleware/
│       │   ├── auth.middleware.js           # verificarToken (RS256, distingue expirado/inválido)
│       │   ├── normalizarTexto.js           # Lowercase de campos de texto (excluye password)
│       │   └── validations/
│       │       ├── index.js                 # Re-exporta todos los validadores
│       │       ├── persona.validator.js     # CI, nombre, apellidos, edad
│       │       ├── aula.validator.js        # nombre de aula
│       │       ├── nota.validator.js        # valor (0-20), fecha, ids
│       │       ├── asistencia.validator.js  # ids, fecha, estado
│       │       ├── usuario.validator.js     # username, password
│       │       └── curso.validator.js       # materia, docentemateria
│       └── utils/
│           └── jwt.js              # generarToken (RS256, expira en 1h)
│
└── frontend/
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── api/
        │   ├── axiosClient.js      # Interceptores: adjunta token, redirige en 401
        │   ├── authApi.js
        │   ├── studentsApi.js
        │   ├── teachersApi.js
        │   ├── subjectsApi.js
        │   ├── classroomsApi.js
        │   ├── attendanceApi.js
        │   ├── docenteMateriaApi.js
        │   └── notaApi.js
        ├── pages/
        │   ├── Login/
        │   ├── Dashboard/
        │   ├── Students/           # Administrador
        │   ├── Teachers/           # Administrador
        │   ├── Classrooms/         # Administrador
        │   ├── Subjects/           # Administrador
        │   ├── Assignments/        # Administrador (DocenteMateria)
        │   ├── Reports/            # Administrador
        │   ├── Attendance/         # Docente
        │   └── Grades/             # Docente
        ├── components/
        │   ├── Alert.jsx
        │   ├── Button.jsx
        │   ├── Modal.jsx
        │   ├── Table.jsx
        │   └── Pagination.jsx
        ├── layouts/
        │   ├── DashboardLayout.jsx
        │   ├── Navbar.jsx
        │   └── Sidebar.jsx         # Menú dinámico según rol
        ├── context/
        │   └── AuthContext.jsx     # Token, user, login, logout, isAdmin
        ├── hooks/
        │   └── usePagination.js    # Paginación en el cliente
        ├── routes/
        │   ├── AppRouter.jsx       # Rutas protegidas por rol
        │   └── PrivateRoute.jsx
        └── utils/
            ├── formatters.js
            └── permissions.js
```

---

## 4. Modelo de datos

### Diagrama de entidades

```
Aula
├── id_aula (PK, autoincrement)
├── nombre
│
├──hasMany──► Estudiante
│              ├── ci_estudiante (PK, CI — no autoincrement)
│              ├── nombre, apellidos, edad
│              ├── ruta_img, huella
│              └── id_aula (FK)
│
├──hasMany──► DocenteMateria
│              ├── id_docente_materia (PK)
│              ├── id_aula    (FK) ──► Aula
│              ├── id_docente (FK) ──► Docente
│              └── id_materia (FK) ──► Materia
│
└──hasMany──► ListaAsistencia
               ├── id_lista (PK)
               ├── fecha
               ├── id_aula    (FK)
               ├── id_docente (FK)
               ├── id_materia (FK)
               └──hasMany──► DetalleAsistencia
                              ├── id_detalle (PK)
                              ├── id_lista      (FK)
                              ├── id_estudiante (FK)
                              └── estado: presente | ausente | tarde

Docente
├── ci_docente (PK, CI — no autoincrement)
├── nombre, apellidos, edad
└── ruta_img, huella

Materia
├── id_materia (PK, autoincrement)
└── nombre

Nota
├── id_nota (PK, autoincrement)
├── id_estudiante (FK) ──► Estudiante
├── id_materia    (FK) ──► Materia
├── id_docente    (FK) ──► Docente  (opcional: quién la registró)
├── valor  (decimal, 0 – 20)
├── fecha
└── descripcion  (opcional: examen, tarea, proyecto...)

Usuario
├── id_usuario (PK = CI del docente/administrador)
├── password   (hash bcrypt)
└── rol        (administrador | docente)
```

### Resumen de tablas

| Tabla | PK | Tipo PK | Campos clave |
|---|---|---|---|
| Aula | `id_aula` | Autoincrement | nombre |
| Estudiante | `ci_estudiante` | CI (no autoincrement) | nombre, apellidos, edad, id_aula |
| Docente | `ci_docente` | CI (no autoincrement) | nombre, apellidos, edad |
| Materia | `id_materia` | Autoincrement | nombre |
| DocenteMateria | `id_docente_materia` | Autoincrement | id_aula, id_docente, id_materia |
| ListaAsistencia | `id_lista` | Autoincrement | fecha, id_aula, id_docente, id_materia |
| DetalleAsistencia | `id_detalle` | Autoincrement | id_lista, id_estudiante, estado |
| Nota | `id_nota` | Autoincrement | id_estudiante, id_materia, id_docente, valor, fecha |
| Usuario | `id_usuario` | CI (no autoincrement) | password, rol |

> `ci_estudiante`, `ci_docente` e `id_usuario` son únicos y representan el número de cédula de identidad. No se pueden repetir.

---

## 5. Arquitectura del backend

### Patrón por capas

```
Request
   │
   ▼
Router
   │
   ▼
Middleware  ──► verificarToken → normalizarTexto → validator
   │
   ▼
Controller  (maneja req/res, delega toda la lógica)
   │
   ▼
Service     (lógica de negocio, consultas complejas, transacciones)
   │
   ▼
BaseService (CRUD genérico reutilizable)
   │
   ▼
Model / Sequelize
   │
   ▼
MySQL
```

### BaseService — métodos disponibles

| Método | Descripción |
|---|---|
| `create(Model, data)` | Crea un registro. Captura `UniqueConstraintError` y lanza mensaje amigable |
| `update(Model, id, data)` | Actualiza por PK. Lanza error si no existe |
| `findById(Model, id)` | Busca por PK |
| `findAll(Model)` | Retorna todos los registros sin paginación |
| `findAllPaginated(Model, options, page, limit)` | Retorna `{ data, total, totalPages, page, limit }` |
| `delete(Model, id)` | Elimina por PK. Lanza error si no existe |

### Respuesta paginada

Los endpoints de listado aceptan `?page=1&limit=10`:

```json
{
  "ok": true,
  "data": [ ... ],
  "total": 45,
  "totalPages": 5,
  "page": 1,
  "limit": 10
}
```

---

## 6. API — Endpoints

> Todos los endpoints requieren `Authorization: Bearer <token>` excepto `POST /` (login).

### Autenticación

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| POST | `/` | Login — devuelve JWT | No |

### Estudiantes — `/estudiante`

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/crear` | Crea estudiante |
| PUT | `/actualizar` | Actualiza datos |
| GET | `/listar` | Lista paginada (`?page&limit`) |
| GET | `/aula/:id_aula` | Estudiantes de un aula |
| GET | `/:ci` | Busca por CI |
| DELETE | `/:ci` | Elimina por CI |

### Docentes — `/docente`

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/crear` | Crea docente + usuario en transacción atómica |
| PUT | `/actualizar` | Actualiza datos |
| GET | `/listar` | Lista paginada (`?page&limit`) |
| GET | `/asignados` | Docentes con materia asignada |
| POST | `/lista` | Busca o crea lista de asistencia del día |
| GET | `/:ci` | Busca por CI |
| DELETE | `/:ci` | Elimina por CI |

### Materias — `/materia`

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/crear` | Crea materia |
| PUT | `/actualizar` | Actualiza nombre (`nombreActual`, `nombreNuevo`) |
| GET | `/listar` | Lista paginada (`?page&limit`) |
| GET | `/:id_materia` | Busca por ID |
| DELETE | `/:id_materia` | Elimina por ID |

### Aulas — `/aula`

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/crear` | Crea aula |
| PUT | `/actualizar` | Actualiza nombre |
| GET | `/listar` | Lista paginada (`?page&limit`) |
| GET | `/asignadas/:id_docente` | Aulas donde el docente tiene materias asignadas |
| GET | `/:id_aula` | Busca por ID (incluye estudiantes) |
| DELETE | `/:id_aula` | Elimina por ID |

### Asignaciones — `/docentemateria`

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/crear` | Asigna docente a materia en un aula |
| PUT | `/actualizar` | Actualiza asignación |
| GET | `/listar` | Lista todas las asignaciones |
| GET | `/aula/:id_aula` | Asignaciones de un aula |
| GET | `/asignadas/:id_docente` | Materias y aulas asignadas a un docente |
| DELETE | `/:id` | Elimina asignación |

### Asistencia — `/asistencia`

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/crear` | Crea lista con todos los alumnos del aula en estado "ausente" |
| PUT | `/actualizar` | Actualiza estado de un detalle (presente/ausente/tarde) |
| GET | `/lista/:id_lista` | Lista con detalles y datos de estudiantes |
| GET | `/aula/:id_aula` | Historial de listas de un aula |
| GET | `/docente/:id_docente` | Historial de listas de un docente |

### Calificaciones — `/nota`

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/crear` | Registra una nota |
| PUT | `/actualizar` | Actualiza valor, fecha o descripción |
| GET | `/listar` | Lista todas las notas con relaciones |
| GET | `/estudiante/:ci_estudiante` | Notas de un estudiante |
| GET | `/materia/:id_materia` | Notas de una materia |
| GET | `/docente/:ci_docente` | Notas registradas por un docente |
| DELETE | `/:id` | Elimina nota |

---

## 7. Middlewares

### Pipeline por ruta

```
verificarToken → normalizarTexto → validator → controller
```

### verificarToken

- Algoritmo: **RS256** (clave pública/privada)
- Adjunta el payload del token en `req.user` → `{ id, rol }`
- Distingue dos casos de error:
  - **Token expirado** → 401 `"Sesión expirada, inicia sesión nuevamente"`
  - **Token inválido** → 401 `"Token inválido"`
- Todas las rutas están protegidas excepto `POST /` (login)

### normalizarTexto

Convierte a minúsculas y recorta espacios en los campos:
`nombre`, `apellidos`, `descripcion`, `estado`, `nombreActual`, `nombreNuevo`

El campo `password` **nunca** se normaliza.

### Validadores

| Validator | Reglas principales |
|---|---|
| `validarEstudiante` | CI: solo números, 6-10 dígitos · nombre/apellidos: mín. 2 chars · edad: 1-120 · id_aula: entero |
| `validarDocente` | CI: solo números, 6-10 dígitos · nombre/apellidos · edad · password: mín. 4 chars |
| `validarAula` | nombre: 2-50 chars, letras/números/espacios |
| `validarNota` | valor: float 0-20 · fecha: formato YYYY-MM-DD · id_estudiante/id_materia requeridos |
| `validarCrearAsistencia` | id_aula, id_materia: enteros · fecha requerida |
| `validarActualizarAsistencia` | id_detalle: entero · estado: `presente` / `ausente` / `tarde` |
| `validarLogin` | username: numérico · password: mín. 4 chars |
| `validarMateria` | nombre: 2-100 chars |
| `validarDocenteMateria` | id_aula, id_materia: enteros · id_docente: numérico |

**Validación de CI (cédula de identidad):**

| Valor | Resultado |
|---|---|
| `8817891` | Válido |
| `123` | Inválido — menos de 6 dígitos |
| `8817891q` | Inválido — contiene letras |
| `1ro A` | Inválido — no es un CI |

**Respuesta de error de validación (HTTP 400):**
```json
{
  "ok": false,
  "errors": [
    { "type": "field", "msg": "El CI debe contener solo números", "path": "ci_estudiante" }
  ]
}
```

### Manejo de valores únicos

`BaseService.create` captura `UniqueConstraintError` de Sequelize y responde con:
```json
{ "ok": false, "message": "Ya existe un registro con ese identificador (valor duplicado)" }
```
Los campos únicos son: `ci_estudiante`, `ci_docente`, `id_usuario`.

---

## 8. Arquitectura del frontend

### Árbol de rutas

```
/login                          → LoginPage (pública)
/                               → Redirige según sesión

/dashboard                      → DashboardPage (todos)

[requiredRole="administrador"]
  /students                     → StudentsPage
  /teachers                     → TeachersPage
  /classrooms                   → ClassroomsPage
  /subjects                     → SubjectsPage
  /assignments                  → AssignmentsPage
  /reports                      → ReportsPage

[requiredRole="docente"]
  /attendance/create            → CreateAttendancePage
  /attendance/history           → AttendanceHistoryPage
  /grades                       → GradesPage
```

### AuthContext

Provee a toda la app mediante React Context:

| Valor | Tipo | Descripción |
|---|---|---|
| `user` | object | Payload del JWT: `{ id, rol }` |
| `loading` | boolean | Estado inicial de carga del token |
| `isAdmin` | boolean | `true` si `rol === "administrador"` |
| `login(token)` | función | Guarda en localStorage y decodifica el JWT |
| `logout()` | función | Limpia localStorage y redirige al login |

### axiosClient

- Interceptor de **request**: adjunta `Authorization: Bearer <token>` en cada llamada
- Interceptor de **response**: ante cualquier `401` limpia `localStorage` y redirige a `/login`
- `baseURL`: `http://localhost:3000`

### Paginación en cliente

El hook `usePagination(data, pageSize)` gestiona la paginación de los arrays ya cargados en memoria, usado en los listados del administrador.

### Sidebar dinámico

El menú lateral cambia según el rol del usuario autenticado:

| Administrador | Docente |
|---|---|
| Dashboard, Estudiantes, Docentes, Aulas, Materias, Asignaciones, Reportes | Dashboard, Tomar Asistencia, Historial, Calificaciones |

---

## 9. Autenticación y roles

### Flujo de login

```
1. POST / { username: CI, password }
2. Backend busca Usuario por id_usuario = username
3. Compara password con hash bcrypt almacenado
4. Si es correcto: genera JWT RS256 firmado con clave privada
   payload: { id: CI, rol }  —  expira en 1 hora
5. Cliente guarda el token en localStorage
6. Cada request incluye el token en el header Authorization
7. verificarToken decodifica con clave pública y adjunta req.user
8. Si el token expira: el interceptor de Axios limpia la sesión y redirige al login
```

### Matriz de acceso

| Recurso | Administrador | Docente |
|---|---|---|
| CRUD Estudiantes | ✓ | — |
| CRUD Docentes | ✓ | — |
| CRUD Aulas | ✓ | — |
| CRUD Materias | ✓ | — |
| Asignaciones docente-materia | ✓ | — |
| Reportes | ✓ | — |
| Tomar asistencia | — | ✓ solo sus aulas/materias |
| Historial de asistencia | — | ✓ solo sus aulas |
| Calificaciones | — | ✓ solo sus materias asignadas |

---

## 10. Flujos principales

### Toma de asistencia

```
1. Docente selecciona Aula → Materia en /attendance/create
2. POST /docente/lista { idAula, idMateria, fecha }
   ┌── Si es nueva lista:
   │     Genera DetalleAsistencia para cada estudiante del aula en estado "ausente"
   └── Si ya existe:
         Retorna la lista con sus detalles actuales
3. Docente cambia el estado de cada estudiante
4. Cada cambio → PUT /asistencia/actualizar { id_detalle, estado }
```

### Registro de calificaciones

```
1. Docente selecciona Aula → Materia en /grades
2. Frontend carga en paralelo:
   ├── GET /estudiante/aula/:id_aula    → lista de estudiantes del aula
   └── GET /nota/materia/:id_materia   → notas existentes de la materia
3. Se cruzan los datos: cada fila muestra al estudiante con su nota (si tiene) o "Sin nota"
4. Registrar:  POST /nota/crear  { id_estudiante, id_materia, id_docente, valor, fecha, descripcion }
5. Editar:     PUT  /nota/actualizar { id, valor, fecha, descripcion }
6. Eliminar:   DELETE /nota/:id
```

### Creación de un docente

```
1. Admin completa el formulario en /teachers
2. POST /docente/crear { ci_docente, nombre, apellidos, edad, password }
3. Backend ejecuta una transacción:
   ├── Hash del password con bcrypt
   ├── INSERT Usuario { id_usuario: ci_docente, password: hash, rol: "docente" }
   └── INSERT Docente { ci_docente, nombre, apellidos, edad }
   → Commit si ambos OK | Rollback si falla cualquiera
4. El docente puede iniciar sesión con su CI como usuario y la contraseña asignada
```
