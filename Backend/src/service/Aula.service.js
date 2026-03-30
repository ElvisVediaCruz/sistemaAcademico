import { Aula, Estudiante, DocenteMateria } from "../models/index.js";
import BaseService from "./Base.service.js";

class AulaService {
    static async crear(data){
        return BaseService.create(Aula, data);
    }

    static async actualizar(id, data){
        return BaseService.update(Aula, id, data);
    }

    static async listar(page, limit){
        return BaseService.findAllPaginated(Aula, {}, page, limit);
    }
    //selecciona solo las aulas asignadas al docente
    static async listarAsignadas(id){
        return await Aula.findAll({
        include: [
            {
            model: DocenteMateria,
            as: "asignacion",
            where: {
                id_docente: id
            },
            attributes: []
            }
        ]
        });
    }

    // Busca un aula por ID incluyendo sus estudiantes
    static async buscarPorId(id){
        return Aula.findByPk(id, {
            include: [{
                model: Estudiante,
                as: "estudiante",
                attributes: ["ci_estudiante", "nombre", "apellidos", "edad"]
            }]
        });
    }

    static async eliminar(id){
        return BaseService.delete(Aula, id);
    }
}

export default AulaService;
