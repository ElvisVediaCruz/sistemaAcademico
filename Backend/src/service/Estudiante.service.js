import { Estudiante, Aula } from "../models/index.js";
import BaseService from "./Base.service.js";

class EstudianteService {
    static async crear(data){
        return BaseService.create(Estudiante, data);
    }

    static async actualizar(id, data){
        return BaseService.update(Estudiante, id, data);
    }

    static async listar(page, limit){
        return BaseService.findAllPaginated(Estudiante, {}, page, limit);
    }

    // Busca un estudiante por CI incluyendo su aula
    static async buscarPorId(ci){
        return Estudiante.findByPk(ci, {
            include: [
                {
                    model: Aula,
                    as: "aula",
                    attributes: ["id_aula", "nombre"]
                }
            ]
        });
    }

    // Lista todos los estudiantes que pertenecen a un aula específica
    static async listarPorAula(id_aula){
        return Estudiante.findAll({
            where: { id_aula },
            include: [{
                model: Aula,
                as: "aula",
                attributes: ["id_aula", "nombre"]
            }]
        });
    }

    static async eliminar(ci){
        return BaseService.delete(Estudiante, ci);
    }
}

export default EstudianteService;
