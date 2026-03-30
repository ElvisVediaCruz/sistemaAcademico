import express from "express";
import DocenteMateriaController from "../controllers/DocenteMateria.controller.js";
import { verificarToken } from "../middleware/auth.middleware.js";
import { validarDocenteMateria } from "../middleware/validations/index.js";

const route = express.Router();

route.use(verificarToken);

// Rutas estáticas ANTES de las dinámicas
route.post("/crear",                  validarDocenteMateria, DocenteMateriaController.crear);
route.put("/actualizar",              DocenteMateriaController.actualizar);
route.get("/listar",                  DocenteMateriaController.listar);
route.get("/aula/:id_aula",           DocenteMateriaController.listarPorAula);
route.get("/asignadas/:id_docente",   DocenteMateriaController.listarMateriaASignada);
route.delete("/:id",                  DocenteMateriaController.eliminar);

export default route;
