import { body, validationResult } from "express-validator";

const manejarErrores = (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ ok: false, errors: errores.array() });
    }
    next();
};

export const validarAula = [
    body("nombre")
        .notEmpty().withMessage("El nombre del aula es obligatorio")
        .isLength({ min: 2, max: 50 }).withMessage("El nombre debe tener entre 2 y 50 caracteres")
        .matches(/^[a-z0-9\s]+$/i).withMessage("El nombre solo puede contener letras, números y espacios"),
    manejarErrores,
];

export const validarActualizarAula = [
    body("id")
        .notEmpty().withMessage("El ID del aula es obligatorio")
        .isInt({ min: 1 }).withMessage("El ID debe ser un número entero válido"),
    body("nombre")
        .notEmpty().withMessage("El nombre del aula es obligatorio")
        .isLength({ min: 2, max: 50 }).withMessage("El nombre debe tener entre 2 y 50 caracteres"),
    manejarErrores,
];
