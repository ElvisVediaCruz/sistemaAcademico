import BaseService from "./Base.service.js";
import { DocenteMateria, Aula, Docente, Materia } from "../models/index.js";

class DocenteMateriaService {
    static async crear(data){
        return BaseService.create(DocenteMateria, data);
    }

    static async actualizar(id, data){
        return BaseService.update(DocenteMateria, id, data);
    }

    // Lista todas las asignaciones aula-docente-materia con sus relaciones
    static async listar(){
        return DocenteMateria.findAll({
            include: [
                { model: Aula,    as: "aula",    attributes: ["id_aula", "nombre"] },
                { model: Docente, as: "docente", attributes: ["ci_docente", "nombre", "apellidos"] },
                { model: Materia, as: "materia", attributes: ["id_materia", "nombre"] }
            ]
        });
    }

    // Lista todas las asignaciones de un aula específica
    static async listarPorAula(id_aula){
        return DocenteMateria.findAll({
            where: { id_aula },
            include: [
                { model: Docente, as: "docente", attributes: ["ci_docente", "nombre", "apellidos"] },
                { model: Materia, as: "materia", attributes: ["id_materia", "nombre"] }
            ]
        });
    }
    static async listarMateriaASignada(id_docente){
        return await DocenteMateria.findAll({
            attributes: ["id_aula"],
            where: {
                    id_docente: id_docente
                },
            include: [
                {
                    model: Materia,
                    as: "materia",
                    attributes: ["id_materia", "nombre"],
                    required: true
                }
            ],
            raw: true
        });
    }

    static async eliminar(id){
        return BaseService.delete(DocenteMateria, id);
    }
}

export default DocenteMateriaService;
