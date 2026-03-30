import express from "express";
import NotaController from "../controllers/Nota.controller.js";
import { verificarToken } from "../middleware/auth.middleware.js";
import { validarNota, validarActualizarNota } from "../middleware/validations/index.js";

const route = express.Router();

route.use(verificarToken);

// Rutas estáticas ANTES de las dinámicas
route.post("/crear",                         validarNota,           NotaController.crear);
route.put("/actualizar",                     validarActualizarNota, NotaController.actualizar);
route.get("/listar",                         NotaController.listar);
route.get("/estudiante/:ci_estudiante",      NotaController.listarPorEstudiante);
route.get("/materia/:id_materia",            NotaController.listarPorMateria);
route.get("/docente/:ci_docente",            NotaController.listarPorDocente);
route.delete("/:id",                         NotaController.eliminar);

export default route;
