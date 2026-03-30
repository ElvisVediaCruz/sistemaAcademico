import express from "express";
import EstudianteController from "../controllers/Estudiante.controlles.js";
import { verificarToken } from "../middleware/auth.middleware.js";
import { normalizarTexto } from "../middleware/normalizarTexto.js";
import { validarEstudiante } from "../middleware/validations/index.js";

const route = express.Router();

route.use(verificarToken);

route.post("/crear",        normalizarTexto, validarEstudiante, EstudianteController.crear);
route.put("/actualizar",    normalizarTexto, EstudianteController.actualizar);
route.get("/listar",        EstudianteController.listar);
route.get("/aula/:id_aula", EstudianteController.listarPorAula);
route.get("/:ci",           EstudianteController.buscar);
route.delete("/:ci",        EstudianteController.eliminar);

export default route;
