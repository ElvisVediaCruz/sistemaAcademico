import { body, validationResult } from "express-validator";

const manejarErrores = (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ ok: false, errors: errores.array() });
    }
    next();
};

export const validarNota = [
    body("id_estudiante")
        .notEmpty().withMessage("El ID del estudiante es obligatorio")
        .isNumeric().withMessage("El ID del estudiante debe ser numérico"),
    body("id_materia")
        .notEmpty().withMessage("El ID de materia es obligatorio")
        .isInt({ min: 1 }).withMessage("El ID de materia debe ser un entero válido"),
    body("valor")
        .notEmpty().withMessage("El valor de la nota es obligatorio")
        .isFloat({ min: 0, max: 20 }).withMessage("La nota debe estar entre 0 y 20"),
    body("fecha")
        .notEmpty().withMessage("La fecha es obligatoria")
        .isDate().withMessage("La fecha debe tener formato válido (YYYY-MM-DD)"),
    manejarErrores,
];

export const validarActualizarNota = [
    body("id")
        .notEmpty().withMessage("El ID de la nota es obligatorio")
        .isInt({ min: 1 }).withMessage("El ID debe ser un entero válido"),
    body("valor")
        .notEmpty().withMessage("El valor de la nota es obligatorio")
        .isFloat({ min: 0, max: 20 }).withMessage("La nota debe estar entre 0 y 20"),
    body("fecha")
        .notEmpty().withMessage("La fecha es obligatoria")
        .isDate().withMessage("La fecha debe tener formato válido (YYYY-MM-DD)"),
    manejarErrores,
];
