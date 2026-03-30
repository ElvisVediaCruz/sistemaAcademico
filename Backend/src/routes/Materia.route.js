import express from "express";
import MateriaController from "../controllers/Materia.controller.js";
import { verificarToken } from "../middleware/auth.middleware.js";
import { normalizarTexto } from "../middleware/normalizarTexto.js";
import { validarMateria, validarActualizarMateria } from "../middleware/validations/index.js";

const route = express.Router();

route.use(verificarToken);

route.post("/crear",          normalizarTexto, validarMateria,           MateriaController.crear);
route.put("/actualizar",      normalizarTexto, validarActualizarMateria, MateriaController.actualizar);
route.get("/listar",          MateriaController.listar);
route.get("/:id_materia",     MateriaController.buscar);
route.delete("/:id_materia",  MateriaController.eliminar);

export default route;
