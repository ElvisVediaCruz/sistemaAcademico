import express from "express";
import DocenteController from "../controllers/Docente.controller.js";
import { verificarToken } from "../middleware/auth.middleware.js";
import { normalizarTexto } from "../middleware/normalizarTexto.js";
import { validarDocente, validarActualizarDocente } from "../middleware/validations/index.js";

const route = express.Router();

route.use(verificarToken);

route.post("/crear",      normalizarTexto, validarDocente,           DocenteController.crear);
route.put("/actualizar",  normalizarTexto, validarActualizarDocente, DocenteController.actualizar);
route.get("/listar",      DocenteController.listaDocentes);
route.get("/asignados",   DocenteController.docentesAsignado);
route.post("/lista",      DocenteController.lista);
route.get("/:ci",         DocenteController.buscar);
route.delete("/:ci",      DocenteController.eliminar);

export default route;
