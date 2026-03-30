import { body, validationResult } from "express-validator";

const manejarErrores = (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ ok: false, errors: errores.array() });
    }
    next();
};

// Materia
export const validarMateria = [
    body("nombre")
        .notEmpty().withMessage("El nombre de la materia es obligatorio")
        .isLength({ min: 2, max: 100 }).withMessage("El nombre debe tener entre 2 y 100 caracteres"),
    manejarErrores,
];

export const validarActualizarMateria = [
    body("nombreActual")
        .notEmpty().withMessage("El nombre actual es obligatorio"),
    body("nombreNuevo")
        .notEmpty().withMessage("El nombre nuevo es obligatorio")
        .isLength({ min: 2, max: 100 }).withMessage("El nombre debe tener entre 2 y 100 caracteres"),
    manejarErrores,
];

// DocenteMateria
export const validarDocenteMateria = [
    body("id_aula")
        .notEmpty().withMessage("El ID del aula es obligatorio")
        .isInt({ min: 1 }).withMessage("El ID de aula debe ser un entero válido"),
    body("id_docente")
        .notEmpty().withMessage("El CI del docente es obligatorio")
        .isNumeric().withMessage("El CI del docente debe ser numérico"),
    body("id_materia")
        .notEmpty().withMessage("El ID de materia es obligatorio")
        .isInt({ min: 1 }).withMessage("El ID de materia debe ser un entero válido"),
    manejarErrores,
];
