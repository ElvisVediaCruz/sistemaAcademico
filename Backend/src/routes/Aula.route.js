import express from "express";
import AulaController from "../controllers/Aula.controller.js";
import { verificarToken } from "../middleware/auth.middleware.js";
import { normalizarTexto } from "../middleware/normalizarTexto.js";
import { validarAula, validarActualizarAula } from "../middleware/validations/index.js";

const route = express.Router();

route.use(verificarToken);

// Rutas estáticas ANTES de las dinámicas
route.post("/crear",                normalizarTexto, validarAula,           AulaController.crear);
route.put("/actualizar",            normalizarTexto, validarActualizarAula, AulaController.actualizar);
route.get("/listar",                AulaController.listar);
route.get("/asignadas/:id_docente", AulaController.listarAsignadas);
route.get("/:id_aula",              AulaController.buscar);
route.delete("/:id_aula",          AulaController.eliminar);

export default route;
