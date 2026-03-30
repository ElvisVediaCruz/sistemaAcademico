import EstudianteService from "../service/Estudiante.service.js";

class EstudianteController {
    static async crear(req, res) {
        try {
            const estudiante = await EstudianteService.crear(req.body);
            return res.status(201).json({ ok: true, message: "estudiante creado correctamente", data: estudiante });
        } catch (error) {
            return res.status(500).json({ ok: false, message: error.message });
        }
    }

    static async actualizar(req, res) {
        try {
            const estudiante = await EstudianteService.actualizar(req.body.id, {
                nombre:    req.body.nombre,
                apellidos: req.body.apellidos,
                edad:      req.body.edad,
                id_aula:   req.body.id_aula
            });
            console.log(estudiante);
            return res.status(200).json({ ok: true, message: "se actualizo correctamente", data: estudiante });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ ok: false, message: error.message });
        }
    }

    static async listar(req, res){
        try {
            const { page = 1, limit = 10 } = req.query;
            const resultado = await EstudianteService.listar(page, limit);
            return res.status(200).json({ ok: true, message: "lista de estudiantes", ...resultado });
        } catch (error) {
            return res.status(500).json({ ok: false, message: error.message });
        }
    }

    // GET /estudiante/:ci — obtiene un estudiante por CI con su aula y materias
    static async buscar(req, res){
        try {
            const estudiante = await EstudianteService.buscarPorId(req.params.ci);
            if (!estudiante) return res.status(404).json({ ok: false, message: "Estudiante no encontrado" });
            return res.status(200).json({ ok: true, data: estudiante });
        } catch (error) {
            return res.status(500).json({ ok: false, message: error.message });
        }
    }

    // GET /estudiante/aula/:id_aula — lista los estudiantes de un aula específica
    static async listarPorAula(req, res){
        try {
            const estudiantes = await EstudianteService.listarPorAula(req.params.id_aula);
            return res.status(200).json({ ok: true, message: "estudiantes del aula", data: estudiantes });
        } catch (error) {
            return res.status(500).json({ ok: false, message: error.message });
        }
    }

    // DELETE /estudiante/:ci — elimina un estudiante por CI
    static async eliminar(req, res){
        try {
            await EstudianteService.eliminar(req.params.ci);
            return res.status(200).json({ ok: true, message: "Estudiante eliminado correctamente" });
        } catch (error) {
            return res.status(500).json({ ok: false, message: error.message });
        }
    }
}

export default EstudianteController;
