# Backend — Sistema Académico

## Stack tecnológico

| Tecnología | Uso |
|---|---|
| Node.js + Express | Servidor HTTP y routing |
| Sequelize | ORM para base de datos |
| MySQL | Base de datos relacional |
| JWT (RS256) | Autenticación stateless con clave pública/privada |
| bcrypt | Hash de contraseñas |

---

## Estructura de carpetas

```
Backend/
└── src/
    ├── app.js                  # Configuración de Express y registro de rutas
    ├── db/
    │   ├── connection.js       # Instancia de Sequelize (MySQL - SistemaAcademico)
    │   └── sync.js             # Sincronización de tablas con la base de datos
    ├── models/
    │   ├── index.js            # Inicializa modelos y ejecuta asociaciones
    │   ├── Aula.model.js
    │   ├── Estudiante.model.js
    │   ├── Docente.model.js
    │   ├── Materia.model.js
    │   ├── Inscripcion.model.js
    │   ├── DocenteMateria.model.js
    │   ├── ListaAsistencia.model.js
    │   ├── DetalleAsistencia.model.js
    │   ├── Nota.model.js
    │   └── Usuario.model.js
    ├── controllers/
    │   ├── Auth.controller.js
    │   ├── Aula.controller.js
    │   ├── Docente.controller.js
    │   ├── Estudiante.controlles.js
    │   ├── Materia.controller.js
    │   ├── Inscripcion.controller.js
    │   ├── DocenteMateria.controller.js
    │   ├── Asistencia.controller.js
    │   └── Nota.controller.js
    ├── service/
    │   ├── Base.service.js     # CRUD genérico (create, update, findById, findAll, delete)
    │   ├── Auth.service.js
    │   ├── Aula.service.js
    │   ├── Docente.service.js
    │   ├── Estudiante.service.js
    │   ├── Materia.service.js
    │   ├── Inscripcion.service.js
    │   ├── DocenteMateria.service.js
    │   ├── Asistencia.service.js
    │   └── Nota.service.js
    ├── routes/
    │   ├── Auth.route.js
    │   ├── Aula.route.js
    │   ├── Doncete.route.js
    │   ├── Estudiante.route.js
    │   ├── Materia.route.js
    │   ├── Inscripcion.route.js
    │   ├── DocenteMateria.route.js
    │   ├── Asistencia.route.js
    │   └── Nota.route.js
    ├── middleware/
    │   ├── auth.middleware.js  # Verifica JWT RS256 (verificarToken)
    │   └── normalizarTexto.js
    └── utils/
        └── jwt.js              # generarToken con clave privada RS256
```

---

## Modelos y relaciones

```
Aula
 ├── hasMany Estudiante        (FK: id_aula)
 ├── hasMany DocenteMateria    (FK: id_aula)
 └── hasMany ListaAsistencia   (FK: id_aula)

Estudiante (PK: ci_estudiante)
 ├── belongsTo Aula            (FK: id_aula)
 ├── belongsToMany Materia     (through: Inscripcion)
 ├── hasMany DetalleAsistencia (FK: id_estudiante)
 └── hasMany Nota              (FK: id_estudiante)

Docente (PK: ci_docente)
 ├── belongsToMany Materia     (through: DocenteMateria)
 ├── hasMany ListaAsistencia   (FK: id_docente)
 └── hasMany Nota              (FK: id_docente)

Materia
 ├── belongsToMany Estudiante  (through: Inscripcion)
 ├── belongsToMany Docente     (through: DocenteMateria)
 ├── hasMany ListaAsistencia   (FK: id_materia)
 └── hasMany Nota              (FK: id_materia)

Inscripcion (junction Estudiante ↔ Materia)
 ├── belongsTo Estudiante      (FK: id_estudiante)
 └── belongsTo Materia         (FK: id_materia)

DocenteMateria / Aula_Docente_Materia (junction)
 ├── belongsTo Aula            (FK: id_aula)
 ├── belongsTo Docente         (FK: id_docente)
 └── belongsTo Materia         (FK: id_materia)

ListaAsistencia (PK: id_lista)
 ├── belongsTo Aula            (FK: id_aula)
 ├── belongsTo Materia         (FK: id_materia)
 ├── belongsTo Docente         (FK: id_docente)
 └── hasMany DetalleAsistencia (FK: id_lista)

DetalleAsistencia (PK: id_detalle)
 ├── belongsTo ListaAsistencia (FK: id_lista)
 └── belongsTo Estudiante      (FK: id_estudiante)

Nota (PK: id_nota)
 ├── belongsTo Estudiante      (FK: id_estudiante)
 ├── belongsTo Materia         (FK: id_materia)
 └── belongsTo Docente         (FK: id_docente, nullable)

Usuario (PK: id_usuario)  — vinculado al CI del Docente
```

---

## Endpoints

### Auth
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| POST | `/` | Login — devuelve JWT | No |

### Aula `/aula`
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| POST | `/crear` | Crear aula | No |
| PUT | `/actualizar` | Actualizar nombre | No |
| GET | `/listar` | Listar todas las aulas | No |
| GET | `/:id_aula` | Obtener aula con sus estudiantes | No |
| DELETE | `/:id_aula` | Eliminar aula | No |
| GET | `/asignadas/:id_docente` | Listar solo las aulas asignadas al docente | No

### Estudiante `/estudiante`
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| POST | `/crear` | Crear estudiante | No |
| PUT | `/actualizar` | Actualizar datos | No |
| GET | `/listar` | Listar todos los estudiantes | No |
| GET | `/aula/:id_aula` | Estudiantes de un aula | No |
| GET | `/:ci` | Obtener estudiante con aula y materias | No |
| DELETE | `/:ci` | Eliminar estudiante | No |

### Docente `/docente`
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| POST | `/crear` | Crear docente + usuario (transacción) | No |
| PUT | `/actualizar` | Actualizar datos del docente | No |
| GET | `/listar` | Listar todos los docentes | JWT |
| GET | `/asignados` | Docentes con sus materias asignadas | No |
| POST | `/lista` | Buscar o crear lista de asistencia para la clase actual | JWT |
| GET | `/:ci` | Obtener docente con sus materias | No |
| DELETE | `/:ci` | Eliminar docente | No |

### Materia `/materia`
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| POST | `/crear` | Crear materia | No |
| PUT | `/actualizar` | Actualizar materia | No |
| GET | `/listar` | Listar todas las materias | No |
| GET | `/:id_materia` | Obtener materia por ID | No |
| DELETE | `/:id_materia` | Eliminar materia | No |

### Inscripción `/inscripcion`
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| POST | `/crear` | Inscribir todos los alumnos de un aula en una materia | No |
| PUT | `/actualizar` | Actualizar una inscripción | No |
| GET | `/materia/:id_materia` | Estudiantes inscritos en una materia | No |
| DELETE | `/:id` | Eliminar una inscripción | No |

### Asignación Aula-Docente-Materia `/docentemateria`
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| POST | `/crear` | Crear asignación `{id_aula, id_docente, id_materia}` | No |
| PUT | `/actualizar` | Actualizar asignación | No |
| GET | `/listar` | Listar todas las asignaciones | No |
| GET | `/aula/:id_aula` | Asignaciones de un aula | No |
| DELETE | `/:id` | Eliminar asignación | No |
| GET | `/asignadas/:id_docente` | Listar solo las materias asignadas al docente | No |

### Asistencia `/asistencia`
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| POST | `/crear` | Crear lista + detalles en "ausente" para todos los alumnos del aula | No |
| PUT | `/actualizar` | Marcar estado de un alumno (presente/ausente/tarde) | No |
| GET | `/lista/:id_lista` | Obtener lista con detalles y datos de estudiantes | No |
| GET | `/aula/:id_aula` | Listas de asistencia de un aula | No |
| GET | `/docente/:id_docente` | Listas de asistencia tomadas por un docente | No |

### Notas `/nota`
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| POST | `/crear` | Registrar una nota `{id_estudiante, id_materia, valor, fecha, ...}` | No |
| PUT | `/actualizar` | Actualizar valor/fecha/descripción de una nota | No |
| GET | `/listar` | Listar todas las notas | No |
| GET | `/estudiante/:ci_estudiante` | Notas de un estudiante | No |
| GET | `/materia/:id_materia` | Notas de una materia | No |
| GET | `/docente/:ci_docente` | Notas registradas por un docente | No |
| DELETE | `/:id` | Eliminar nota | No |

---

## Flujo principal del sistema

```
1. Crear Aulas
2. Crear Docentes (también crea su Usuario para login)
3. Crear Materias
4. Asignar Docente+Materia a un Aula  →  POST /docentemateria/crear
5. Crear Estudiantes (con id_aula)
6. Inscribir alumnos del aula en una materia  →  POST /inscripcion/crear
7. Tomar asistencia  →  POST /docente/lista (crea/busca lista)
                        PUT /asistencia/actualizar (marcar presentes)
8. Registrar notas   →  POST /nota/crear
```

---

## Autenticación

- **Algoritmo**: RS256 (clave pública/privada)
- **Archivos de clave**: `public.key` y `private.key` en la raíz del proyecto
- **Header**: `Authorization: Bearer <token>`
- El token lleva `{ id, rol }` del usuario

---

## Base.service.js — Métodos genéricos

| Método | Descripción |
|---|---|
| `create(Model, data)` | Crea un registro |
| `update(Model, id, data)` | Busca por PK y actualiza |
| `findById(Model, id)` | Busca por PK |
| `findAll(Model)` | Retorna todos los registros |
| `delete(Model, id)` | Busca por PK y elimina |
