import BaseService from "./Base.service.js";
import { Materia } from "../models/index.js";
import { where } from "sequelize";

class MateriaService {
    static async crearMateria(data){
        return BaseService.create(Materia, data);
    }

    static async listarMaterias(page, limit){
        return BaseService.findAllPaginated(Materia, {}, page, limit);
    }

    static async actualizarMateria(nombreActual, nombreNuevo){
        const materia = await Materia.findOne({where: {nombre: nombreActual}});
        if(!materia){
            throw new Error("Registro no encontrado");
        }
        materia.nombre = nombreNuevo;
        return materia.save();
    }

    // Busca una materia por ID
    static async buscarPorId(id){
        return BaseService.findById(Materia, id);
    }

    static async eliminar(id){
        return BaseService.delete(Materia, id);
    }
}

export default MateriaService;
