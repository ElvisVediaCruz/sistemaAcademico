import { body, validationResult } from "express-validator";

const manejarErrores = (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ ok: false, errors: errores.array() });
    }
    next();
};

export const validarLogin = [
    body("username")
        .notEmpty().withMessage("El usuario es obligatorio")
        .isNumeric().withMessage("El usuario debe ser numérico (CI)"),
    // password NO se normaliza a minúsculas
    body("password")
        .notEmpty().withMessage("La contraseña es obligatoria")
        .isLength({ min: 4 }).withMessage("La contraseña debe tener al menos 4 caracteres"),
    manejarErrores,
];
