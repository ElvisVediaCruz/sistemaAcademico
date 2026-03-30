import { body, validationResult } from "express-validator";

const manejarErrores = (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ ok: false, errors: errores.array() });
    }
    next();
};

const reglasNombre = [
    body("nombre")
        .notEmpty().withMessage("El nombre es obligatorio")
        .isLength({ min: 2 }).withMessage("El nombre debe tener al menos 2 caracteres"),
    body("apellidos")
        .notEmpty().withMessage("Los apellidos son obligatorios")
        .isLength({ min: 2 }).withMessage("Los apellidos deben tener al menos 2 caracteres"),
    body("edad")
        .isInt({ min: 1, max: 120 }).withMessage("La edad debe ser un número entre 1 y 120"),
];

// Estudiante: ci_estudiante + nombre + apellidos + edad + id_aula
export const validarEstudiante = [
    body("ci_estudiante")
        .notEmpty().withMessage("El CI del estudiante es obligatorio")
        .isNumeric().withMessage("El CI debe contener solo números")
        .isLength({ min: 6, max: 10 }).withMessage("El CI debe tener entre 6 y 10 dígitos"),
    ...reglasNombre,
    body("id_aula")
        .notEmpty().withMessage("El aula es obligatoria")
        .isInt({ min: 1 }).withMessage("El ID de aula debe ser un número entero válido"),
    manejarErrores,
];

// Docente: ci_docente + nombre + apellidos + edad + password
export const validarDocente = [
    body("ci_docente")
        .notEmpty().withMessage("El CI del docente es obligatorio")
        .isNumeric().withMessage("El CI debe contener solo números")
        .isLength({ min: 6, max: 10 }).withMessage("El CI debe tener entre 6 y 10 dígitos"),
    ...reglasNombre,
    body("password")
        .notEmpty().withMessage("La contraseña es obligatoria")
        .isLength({ min: 4 }).withMessage("La contraseña debe tener al menos 4 caracteres"),
    manejarErrores,
];

// Actualizar docente (sin password)
export const validarActualizarDocente = [
    body("ci")
        .notEmpty().withMessage("El CI del docente es obligatorio")
        .isNumeric().withMessage("El CI debe contener solo números"),
    ...reglasNombre,
    manejarErrores,
];
