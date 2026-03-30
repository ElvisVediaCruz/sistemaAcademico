import { DetalleAsistencia, ListaAsistencia, Estudiante, Aula, Docente, Materia } from "../models/index.js";
import BaseService from "./Base.service.js";
import { sequelize } from "../db/connection.js";

class AsistenciaService {
    // Crea una lista de asistencia con todos los estudiantes del aula en estado "ausente"
    static async crear(data){
        const t = await sequelize.transaction();
        try {
            const estudiantes = await Estudiante.findAll({
                // ci_estudiante es la nueva PK del modelo Estudiante
                attributes: ["ci_estudiante"],
                where: { id_aula: data.id_aula },
                transaction: t
            });
            const data_list = {
                fecha:      new Date(),
                id_materia: data.id_materia,
                // id_aula e id_docente ahora son FK requeridas en Lista_Asistencia
                id_aula:    data.id_aula,
                id_docente: data.id_docente
            };
            const lista_asistencia = await ListaAsistencia.create(data_list, { transaction: t });

            const detalle_asistencia = estudiantes.map(estudiante => ({
                // ci_estudiante es la nueva PK, antes era .id
                id_estudiante: estudiante.ci_estudiante,
                // id_lista es el nuevo nombre de la PK de ListaAsistencia
                id_lista:      lista_asistencia.id_lista,
                estado:        "ausente"
            }));
            await DetalleAsistencia.bulkCreate(detalle_asistencia, { transaction: t });
            await t.commit();
            return lista_asistencia.id_lista;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }
    //crear funcion para obtener solo los estudiantes de la asistencia
    // Actualiza el estado (presente/ausente/tarde) de un detalle de asistencia
    static async actualizar(id, data){
        return BaseService.update(DetalleAsistencia, id, data);
    }

    // Obtiene una lista de asistencia con todos sus detalles y datos del estudiante
    static async buscarLista(id_lista){
        return ListaAsistencia.findByPk(id_lista, {
            include: [
                { model: Aula,    as: "aula",    attributes: ["id_aula", "nombre"] },
                { model: Materia, as: "Materia", attributes: ["id_materia", "nombre"] },
                { model: Docente, as: "docente", attributes: ["ci_docente", "nombre", "apellidos"] },
                {
                    model: DetalleAsistencia,
                    as: "detalle",
                    include: [{
                        model: Estudiante,
                        as: "estudiante",
                        attributes: ["ci_estudiante", "nombre", "apellidos"]
                    }]
                }
            ]
        });
    }

    // Lista todas las listas de asistencia de un aula
    static async listarPorAula(id_aula){
        return ListaAsistencia.findAll({
            where: { id_aula },
            include: [
                { model: Materia, as: "Materia", attributes: ["id_materia", "nombre"] },
                { model: Docente, as: "docente", attributes: ["ci_docente", "nombre", "apellidos"] }
            ]
        });
    }

    // Lista todas las listas de asistencia tomadas por un docente
    static async listarPorDocente(id_docente){
        return ListaAsistencia.findAll({
            where: { id_docente },
            include: [
                { model: Aula,    as: "aula",    attributes: ["id_aula", "nombre"] },
                { model: Materia, as: "Materia", attributes: ["id_materia", "nombre"] }
            ]
        });
    }
}

export default AsistenciaService;
