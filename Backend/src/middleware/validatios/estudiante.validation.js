import {body, validationResult } from "express-validator";

export const EstudianteValidation = [
    body("ci_estudiante")
    .notEmpty()
    .withMessage("El CI del estudiante es obligatorio")
    .isNumeric()
    .withMessage("El CI debe ser numérico"),

  body("nombre")
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .isLength({ min: 2 })
    .withMessage("El nombre debe tener al menos 2 caracteres"),

  body("apellidos")
    .notEmpty()
    .withMessage("Los apellidos son obligatorios"),

  body("edad")
    .isInt({ min: 3 })
    .withMessage("Edad inválida"),

  body("id_aula")
    .notEmpty()
    .withMessage("Debe asignar un aula")
    .isInt()
    .withMessage("El aula debe ser un número"),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    next();
  },
];