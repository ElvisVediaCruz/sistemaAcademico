import DocenteMateriaService from "../service/DocenteMateria.service.js";

class DocenteMateriaController {
    static async crear(req, res) {
        try {
            // req.body debe incluir: id_aula, id_docente, id_materia
            const asignacion = await DocenteMateriaService.crear(req.body);
            return res.status(201).json({ ok: true, message: "asignación creada correctamente", data: asignacion });
        } catch (error) {
            return res.status(500).json({ ok: false, message: error.message });
        }
    }

    static async actualizar(req, res) {
        try {
            const asignacion = await DocenteMateriaService.actualizar(req.body.id, {
                id_docente: req.body.id_docente,
                id_materia: req.body.id_materia,
                // id_aula requerido en el nuevo modelo Aula_Docente_Materia
                id_aula:    req.body.id_aula
            });
            return res.status(200).json({ ok: true, message: "asignación actualizada correctamente", data: asignacion });
        } catch (error) {
            return res.status(500).json({ ok: false, message: error.message });
        }
    }

    // GET /docentemateria/listar — lista todas las asignaciones con aula, docente y materia
    static async listar(req, res){
        try {
            const asignaciones = await DocenteMateriaService.listar();
            return res.status(200).json({ ok: true, message: "lista de asignaciones", data: asignaciones });
        } catch (error) {
            return res.status(500).json({ ok: false, message: error.message });
        }
    }

    // GET /docentemateria/aula/:id_aula — lista las asignaciones de un aula
    static async listarPorAula(req, res){
        try {
            const asignaciones = await DocenteMateriaService.listarPorAula(req.params.id_aula);
            return res.status(200).json({ ok: true, message: "asignaciones del aula", data: asignaciones });
        } catch (error) {
            return res.status(500).json({ ok: false, message: error.message });
        }
    }
    static async listarMateriaASignada(req, res){
        try {
            const {id_docente} = req.params;
            const asignadas = await DocenteMateriaService.listarMateriaASignada(id_docente);
            return res.status(200).json({ ok: true, message: "asignaciones de materias", data: asignadas });
        } catch (error) {
            return res.status(500).json({ ok: false, message: error.message });
        }
    }
    // DELETE /docentemateria/:id — elimina una asignación por ID
    static async eliminar(req, res){
        try {
            await DocenteMateriaService.eliminar(req.params.id);
            return res.status(200).json({ ok: true, message: "asignación eliminada correctamente" });
        } catch (error) {
            return res.status(500).json({ ok: false, message: error.message });
        }
    }
}

export default DocenteMateriaController;
