import { Docente, Materia, User, ListaAsistencia, DetalleAsistencia, Estudiante } from "../models/index.js";
import BaseService from "./Base.service.js";
import bcrypt from "bcrypt";
import { sequelize } from "../db/connection.js";

class DocenteService {
    static async crearDocente(data){
        const t = await sequelize.transaction();
        const saltRounds = 10;
        try {
            const hash = await bcrypt.hash(data.password, saltRounds);
            // id_usuario: nuevo nombre de PK en modelo Usuario
            await User.create({ id_usuario: data.ci_docente, password: hash, rol: "docente" }, { transaction: t });
            // ci_docente: nuevo nombre de PK en modelo Docente
            await Docente.create({
                ci_docente: data.ci_docente,
                nombre: data.nombre,
                apellidos: data.apellidos,
                edad: data.edad
            }, { transaction: t });
            await t.commit();
            return true;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    static async listarDocente(page, limit){
        return BaseService.findAllPaginated(Docente, {}, page, limit);
    }

    static async actualizarDocente(id, data){
        return BaseService.update(Docente, id, data);
    }

    // Busca un docente por CI incluyendo sus materias asignadas
    static async buscarPorId(ci){
        return Docente.findByPk(ci, {
            include: [{
                model: Materia,
                as: "materia",
                attributes: ["id_materia", "nombre"],
                through: { attributes: [] }
            }]
        });
    }

    static async eliminar(ci){
        return BaseService.delete(Docente, ci);
    }

    static async docentesAsignado(){
        return await Docente.findAll({
            include: {
                model: Materia,
                as: "materia",
                attributes: ["id_materia", "nombre"],
                through: { attributes: [] },
                required: true
            }
        });
    }

    // Busca o crea la lista de asistencia para un aula/materia/docente/fecha.
    // Si es nueva, genera los detalles de todos los estudiantes del aula en estado "ausente".
    static async llamarLista(data){
        const t = await sequelize.transaction();
        try {
            const [lista, created] = await ListaAsistencia.findOrCreate({
                where: {
                    id_aula:    data.idAula,
                    id_materia: data.idMateria,
                    id_docente: data.idDocente,
                    fecha:      data.fecha
                },
                defaults: {
                    id_aula:    data.idAula,
                    id_materia: data.idMateria,
                    id_docente: data.idDocente,
                    fecha:      data.fecha
                },
                transaction: t
            });

            if (created) {
                const estudiantes = await Estudiante.findAll({
                    attributes: ["ci_estudiante"],
                    where: { id_aula: data.idAula },
                    transaction: t
                });
                const detalles = estudiantes.map(e => ({
                    id_lista:      lista.id_lista,
                    id_estudiante: e.ci_estudiante,
                    estado:        "ausente"
                }));
                await DetalleAsistencia.bulkCreate(detalles, { transaction: t });
            }

            await t.commit();

            // Retorna la lista con sus detalles y los datos del estudiante por detalle
            return ListaAsistencia.findByPk(lista.id_lista, {
                include: [{
                    model: DetalleAsistencia,
                    as: "detalle",
                    include: [{
                        model: Estudiante,
                        as: "estudiante",
                        attributes: ["ci_estudiante", "nombre", "apellidos"]
                    }]
                }]
            });
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }
}

export default DocenteService;
