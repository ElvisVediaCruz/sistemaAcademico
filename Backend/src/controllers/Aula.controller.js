import AulaService from "../service/Aula.service.js";

class AulaController {
    static async crear(req, res) {
        try {
            const aula = await AulaService.crear(req.body);
            return res.status(201).json({ ok: true, message: "Aula creada correctamente", data: aula });
        } catch (error) {
            return res.status(500).json({ ok: false, message: error.message });
        }
    }

    static async actualizar(req, res) {
        try {
            const aula = await AulaService.actualizar(req.body.id, { nombre: req.body.nombre });
            return res.status(200).json({ ok: true, message: "Aula actualizada correctamente", data: aula });
        } catch (error) {
            return res.status(500).json({ ok: false, message: error.message });
        }
    }

    static async listar(req, res){
        try {
            const { page = 1, limit = 10 } = req.query;
            const resultado = await AulaService.listar(page, limit);
            return res.status(200).json({ ok: true, message: "Lista de aulas", ...resultado });
        } catch (error) {
            return res.status(500).json({ ok: false, message: error.message });
        }
    }
    static async listarAsignadas(req, res){
        try {
            const { id_docente } = req.params;
            const aulas = await AulaService.listarAsignadas(id_docente);
            return res.status(200).json({ ok: true, message: "Lista de aulas", data: aulas });
        } catch (error) {
            return res.status(500).json({ ok: false, message: error.message });
        }
    }
    // GET /aula/:id_aula — obtiene un aula por ID con sus estudiantes
    static async buscar(req, res){
        try {
            const aula = await AulaService.buscarPorId(req.params.id_aula);
            if (!aula) return res.status(404).json({ ok: false, message: "Aula no encontrada" });
            return res.status(200).json({ ok: true, data: aula });
        } catch (error) {
            return res.status(500).json({ ok: false, message: error.message });
        }
    }

    // DELETE /aula/:id_aula — elimina un aula por ID
    static async eliminar(req, res){
        try {
            await AulaService.eliminar(req.params.id_aula);
            return res.status(200).json({ ok: true, message: "Aula eliminada correctamente" });
        } catch (error) {
            return res.status(500).json({ ok: false, message: error.message });
        }
    }
}

export default AulaController;
