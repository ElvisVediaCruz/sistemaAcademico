import express from "express";
import AsistenciaController from "../controllers/Asistencia.controller.js";
import { verificarToken } from "../middleware/auth.middleware.js";
import { validarCrearAsistencia, validarActualizarAsistencia } from "../middleware/validations/index.js";

const route = express.Router();

route.use(verificarToken);

// Rutas estáticas ANTES de las dinámicas
route.post("/crear",              validarCrearAsistencia,      AsistenciaController.crear);
route.put("/actualizar",          validarActualizarAsistencia, AsistenciaController.actualizar);
route.get("/lista/:id_lista",     AsistenciaController.buscarLista);
route.get("/aula/:id_aula",       AsistenciaController.listarPorAula);
route.get("/docente/:id_docente", AsistenciaController.listarPorDocente);

export default route;
