import { body, validationResult } from "express-validator";

const manejarErrores = (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ ok: false, errors: errores.array() });
    }
    next();
};

export const validarCrearAsistencia = [
    body("id_aula")
        .notEmpty().withMessage("El ID del aula es obligatorio")
        .isInt({ min: 1 }).withMessage("El ID de aula debe ser un entero válido"),
    body("id_materia")
        .notEmpty().withMessage("El ID de materia es obligatorio")
        .isInt({ min: 1 }).withMessage("El ID de materia debe ser un entero válido"),
    body("fecha")
        .notEmpty().withMessage("La fecha es obligatoria")
        .isDate().withMessage("La fecha debe tener formato válido (YYYY-MM-DD)"),
    manejarErrores,
];

export const validarActualizarAsistencia = [
    body("id_detalle")
        .notEmpty().withMessage("El ID del detalle es obligatorio")
        .isInt({ min: 1 }).withMessage("El ID debe ser un entero válido"),
    body("estado")
        .notEmpty().withMessage("El estado es obligatorio")
        .isIn(["presente", "ausente", "tarde"]).withMessage("El estado debe ser: presente, ausente o tarde"),
    manejarErrores,
];
