# Frontend — Sistema Académico

## Stack tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| React | 19 | Biblioteca de UI |
| Vite | 8 | Bundler y servidor de desarrollo |
| React Router v7 | 7 | Enrutamiento SPA |
| Tailwind CSS | 4 | Estilos utilitarios |
| Axios | 1 | Cliente HTTP con interceptores |
| jwt-decode | 4 | Decodificación del JWT en el cliente |

---

## Estructura de carpetas

```
frontend/src/
├── api/                        # Clientes HTTP por entidad
│   ├── axiosClient.js          # Instancia base de Axios con interceptor JWT
│   ├── classroomsApi.js        # Aulas (incluye getClassroomsAsigned para docentes)
│   ├── studentsApi.js          # Estudiantes (CRUD + getStudentsByAula)
│   ├── teachersApi.js          # Docentes (CRUD + deleteTeacher + llamarLista)
│   ├── subjectsApi.js          # Materias (CRUD + deleteSubject)
│   ├── docenteMateriaApi.js    # Asignaciones Aula-Docente-Materia
│   ├── enrollmentApi.js        # Inscripciones estudiante-materia
│   ├── attendanceApi.js        # Asistencia (lista + detalles)
│   └── notaApi.js              # Notas / calificaciones
│
├── context/
│   └── AuthContext.jsx         # Proveedor JWT: user, token, isAdmin, isTeacher, logout
│
├── routes/
│   ├── AppRouter.jsx           # Definición de rutas con roles
│   └── PrivateRoute.jsx        # Guard de rutas con verificación de rol
│
├── layouts/
│   ├── DashboardLayout.jsx     # Shell con Sidebar + Navbar + <Outlet>
│   ├── Sidebar.jsx             # Navegación lateral (nav distinta por rol)
│   └── Navbar.jsx              # Barra superior con botón de menú móvil
│
├── components/                 # Componentes reutilizables
│   ├── Alert.jsx               # Alertas de éxito/error con cierre
│   ├── Button.jsx              # Botón con variantes (primary, secondary, danger)
│   ├── Modal.jsx               # Modal genérico con overlay
│   ├── Pagination.jsx          # Control de paginación
│   └── Table.jsx               # Tabla con columnas configurables y loading state
│
├── hooks/
│   └── usePagination.js        # Hook de paginación sobre arrays
│
├── utils/
│   └── formatters.js           # estadoColor(), capitalize()
│
└── pages/
    ├── Login/LoginPage.jsx
    ├── Dashboard/DashboardPage.jsx
    │
    ├── Students/StudentsPage.jsx       # Admin
    ├── Teachers/TeachersPage.jsx       # Admin
    ├── Classrooms/ClassroomsPage.jsx   # Admin
    ├── Subjects/SubjectsPage.jsx       # Admin
    ├── Assignments/AssignmentsPage.jsx # Admin
    ├── Enrollment/EnrollmentPage.jsx   # Admin
    ├── Reports/ReportsPage.jsx         # Admin
    │
    ├── Attendance/
    │   ├── CreateAttendancePage.jsx    # Docente — tomar lista
    │   └── AttendanceHistoryPage.jsx   # Docente — historial de sus listas
    │
    └── Grades/
        └── GradesPage.jsx              # Docente — registrar y editar calificaciones
```

---

## Rutas de la aplicación

| Ruta | Componente | Rol requerido |
|---|---|---|
| `/login` | LoginPage | público |
| `/dashboard` | DashboardPage | autenticado |
| `/students` | StudentsPage | administrador |
| `/teachers` | TeachersPage | administrador |
| `/classrooms` | ClassroomsPage | administrador |
| `/subjects` | SubjectsPage | administrador |
| `/assignments` | AssignmentsPage | administrador |
| `/enrollment` | EnrollmentPage | administrador |
| `/reports` | ReportsPage | administrador |
| `/attendance/create` | CreateAttendancePage | docente |
| `/attendance/history` | AttendanceHistoryPage | docente |
| `/grades` | GradesPage | docente |

---

## Autenticación

- El login llama `POST /` al backend con `{ username, password }` y recibe un JWT RS256.
- El JWT se guarda en `localStorage` con la clave `"token"`.
- `axiosClient.js` tiene un interceptor `request` que inyecta el header `Authorization: Bearer <token>` en cada petición automáticamente.
- `AuthContext` decodifica el JWT con `jwt-decode` al cargar la app:
  - `user.id` — CI del docente (o ID del usuario)
  - `user.rol` — `"administrador"` | `"docente"`
  - `isAdmin` / `isTeacher` — booleanos de conveniencia
- `PrivateRoute` redirige a `/login` si no hay token; opcionalmente verifica `requiredRole`.

---

## Roles y restricciones

### Administrador
- Acceso completo a CRUD de: Aulas, Docentes, Estudiantes, Materias, Asignaciones, Inscripciones.
- Ve reportes globales de asistencia filtrados por aula o docente.

### Docente
- **Solo ve sus aulas asignadas** — cargadas con `GET /aula/asignadas/:id_docente`.
- **Solo ve sus materias por aula** — cargadas con `GET /docentemateria/asignadas/:id_docente`, filtradas localmente por `id_aula`.
- **Asistencia**: solo puede crear listas en el cruce `(id_aula, id_materia)` de sus asignaciones. El `id_docente` del payload siempre viene del JWT (`user.id`).
- **Historial**: ve únicamente listas donde `id_docente === user.id` (filtro client-side sobre `GET /asistencia/aula/:id_aula`).
- **Calificaciones**: solo puede registrar/editar notas de estudiantes inscritos en materias de sus aulas asignadas. El `id_docente` de la nota se fija desde el JWT.

---

## Flujo de datos del Docente

```
1. Login → JWT { id: ci_docente, rol: "docente" }

2. Sidebar → muestra solo rutas de docente

3. Tomar Asistencia (CreateAttendancePage)
   GET /aula/asignadas/:ci_docente           → aulas del docente
   GET /docentemateria/asignadas/:ci_docente → assignments[]
   Filtro local: assignments donde id_aula === seleccionada → materias del docente en esa aula
   POST /asistencia/crear { id_aula, id_materia, id_docente: user.id }
   PUT  /asistencia/actualizar { id: id_detalle, estado }

4. Historial (AttendanceHistoryPage)
   GET /aula/asignadas/:ci_docente           → aulas
   GET /asistencia/aula/:id_aula             → listas del aula
   Filtro local: listas donde id_docente === user.id
   GET /asistencia/lista/:id_lista           → detalles con estudiantes

5. Calificaciones (GradesPage)
   GET /aula/asignadas/:ci_docente           → aulas
   GET /docentemateria/asignadas/:ci_docente → assignments[]
   Filtro local por aula seleccionada        → materias disponibles
   GET /inscripcion/materia/:id_materia      → estudiantes inscritos
   GET /nota/materia/:id_materia             → notas existentes
   POST /nota/crear { id_estudiante, id_materia, id_docente: user.id, valor, fecha }
   PUT  /nota/actualizar { id: id_nota, valor, fecha, descripcion }
   DELETE /nota/:id_nota
```

---

## API de Asistencia

| Función | Endpoint | Descripción |
|---|---|---|
| `createAttendance(data)` | POST `/asistencia/crear` | Crea lista + DetalleAsistencia en "ausente" para el aula |
| `updateAttendance(data)` | PUT `/asistencia/actualizar` | Marca estado de un `id_detalle` |
| `getAttendanceList(id)` | GET `/asistencia/lista/:id` | Lista con DetalleAsistencia y datos del estudiante |
| `getAttendanceByAula(id)` | GET `/asistencia/aula/:id` | Todas las listas de un aula |
| `getAttendanceByDocente(id)` | GET `/asistencia/docente/:id` | Todas las listas de un docente |

**Modelos relevantes:**
- `ListaAsistencia` PK: `id_lista` (antes `id_lista_asistencia`)
- `DetalleAsistencia` PK: `id_detalle` (antes `id_detalle_asistencia`)
- Estado posible: `"presente"` | `"ausente"` | `"tarde"`

---

## API de Notas

| Función | Endpoint | Descripción |
|---|---|---|
| `createNota(data)` | POST `/nota/crear` | Crea nota `{id_estudiante, id_materia, id_docente, valor, fecha}` |
| `updateNota(data)` | PUT `/nota/actualizar` | Actualiza `{id, valor, fecha, descripcion}` |
| `getNotasByMateria(id)` | GET `/nota/materia/:id` | Notas de una materia |
| `getNotasByEstudiante(ci)` | GET `/nota/estudiante/:ci` | Notas de un estudiante |
| `getNotasByDocente(ci)` | GET `/nota/docente/:ci` | Notas registradas por un docente |
| `deleteNota(id)` | DELETE `/nota/:id` | Eliminar nota |

---

## Notas importantes

- La respuesta del backend es inconsistente entre controladores:
  - Aula / Estudiante / Asistencia → `{ ok, data }`
  - Docente → `{ message, result, okey }`
  - Materia → `{ message, data }`
  - Por eso los API files usan `res.data?.data ?? res.data?.result ?? []`
- `getAssignmentsClass` retorna objetos con propiedades planas Sequelize: `"materia.id_materia"`, `"materia.nombre"`, `"id_aula"` (sin punto — campo propio del modelo).
- El token JWT lleva `{ id, rol }` — `id` es el `ci_docente` para docentes.

---

## Comandos

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo (http://localhost:5173)
npm run dev

# Build de producción
npm run build
```
