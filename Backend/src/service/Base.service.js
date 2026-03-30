import { UniqueConstraintError } from "sequelize";

class BaseService {
    static async create(Model, data) {
        try {
            return await Model.create(data);
        } catch (error) {
            if (error instanceof UniqueConstraintError) {
                throw new Error("Ya existe un registro con ese identificador (valor duplicado)");
            }
            throw error;
        }
    }

    static async update(Model, id, data) {
        const registro = await Model.findByPk(id);
        if (!registro) {
            throw new Error("Registro no encontrado");
        }
        return await registro.update(data);
    }

    static async findById(Model, id) {
        return await Model.findByPk(id);
    }

    static async findAll(Model) {
        return await Model.findAll();
    }

    // Paginación: devuelve { data, total, totalPages, page, limit }
    static async findAllPaginated(Model, options = {}, page = 1, limit = 10) {
        const pageNum  = Math.max(1, parseInt(page)  || 1);
        const limitNum = Math.max(1, parseInt(limit) || 10);
        const offset   = (pageNum - 1) * limitNum;

        const { count, rows } = await Model.findAndCountAll({
            ...options,
            limit:  limitNum,
            offset,
        });

        return {
            data:       rows,
            total:      count,
            totalPages: Math.ceil(count / limitNum),
            page:       pageNum,
            limit:      limitNum,
        };
    }

    static async delete(Model, id) {
        const registro = await Model.findByPk(id);
        if (!registro) {
            throw new Error("Registro no encontrado");
        }
        return await registro.destroy();
    }
}

export default BaseService;
