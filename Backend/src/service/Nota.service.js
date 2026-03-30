import { Nota, Estudiante, Materia, Docente } from "../models/index.js";
import BaseService from "./Base.service.js";

class NotaService {
    static async crear(data){
        return BaseService.create(Nota, data);
    }

    static async actualizar(id, data){
        return BaseService.update(Nota, id, data);
    }

    // Lista todas las notas con relaciones completas
    static async listar(){
        return Nota.findAll({
            include: [
                { model: Estudiante, as: "estudiante", attributes: ["ci_estudiante", "nombre", "apellidos"] },
                { model: Materia,    as: "materia",    attributes: ["id_materia", "nombre"] },
                { model: Docente,    as: "docente",    attributes: ["ci_docente", "nombre", "apellidos"] }
            ]
        });
    }

    // Lista las notas de un estudiante específico
    static async listarPorEstudiante(ci_estudiante){
        return Nota.findAll({
            where: { id_estudiante: ci_estudiante },
            include: [
                { model: Materia, as: "materia", attributes: ["id_materia", "nombre"] },
                { model: Docente, as: "docente", attributes: ["ci_docente", "nombre", "apellidos"] }
            ]
        });
    }

    // Lista todas las notas de una materia
    static async listarPorMateria(id_materia){
        return Nota.findAll({
            where: { id_materia },
            include: [
                { model: Estudiante, as: "estudiante", attributes: ["ci_estudiante", "nombre", "apellidos"] },
                { model: Docente,    as: "docente",    attributes: ["ci_docente", "nombre", "apellidos"] }
            ]
        });
    }

    // Lista todas las notas registradas por un docente
    static async listarPorDocente(ci_docente){
        return Nota.findAll({
            where: { id_docente: ci_docente },
            include: [
                { model: Estudiante, as: "estudiante", attributes: ["ci_estudiante", "nombre", "apellidos"] },
                { model: Materia,    as: "materia",    attributes: ["id_materia", "nombre"] }
            ]
        });
    }

    static async eliminar(id){
        return BaseService.delete(Nota, id);
    }
}

export default NotaService;
