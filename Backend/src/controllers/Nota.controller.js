import NotaService from "../service/Nota.service.js";

class NotaController {
    // POST /nota/crear — registra una nota para un estudiante en una materia
    static async crear(req, res) {
        try {
            const nota = await NotaService.crear(req.body);
            return res.status(201).json({ ok: true, message: "nota registrada correctamente", data: nota });
        } catch (error) {
            return res.status(500).json({ ok: false, message: error.message });
        }
    }

    // PUT /nota/actualizar — actualiza el valor, fecha o descripción de una nota
    static async actualizar(req, res) {
        try {
            const nota = await NotaService.actualizar(req.body.id, {
                valor:       req.body.valor,
                fecha:       req.body.fecha,
                descripcion: req.body.descripcion
            });
            return res.status(200).json({ ok: true, message: "nota actualizada correctamente", data: nota });
        } catch (error) {
            return res.status(500).json({ ok: false, message: error.message });
        }
    }

    // GET /nota/listar — lista todas las notas con relaciones completas
    static async listar(req, res) {
        try {
            const notas = await NotaService.listar();
            return res.status(200).json({ ok: true, message: "lista de notas", data: notas });
        } catch (error) {
            return res.status(500).json({ ok: false, message: error.message });
        }
    }

    // GET /nota/estudiante/:ci_estudiante — lista las notas de un estudiante
    static async listarPorEstudiante(req, res) {
        try {
            const notas = await NotaService.listarPorEstudiante(req.params.ci_estudiante);
            return res.status(200).json({ ok: true, message: "notas del estudiante", data: notas });
        } catch (error) {
            return res.status(500).json({ ok: false, message: error.message });
        }
    }

    // GET /nota/materia/:id_materia — lista las notas de una materia
    static async listarPorMateria(req, res){
        try {
            const notas = await NotaService.listarPorMateria(req.params.id_materia);
            return res.status(200).json({ ok: true, message: "notas de la materia", data: notas });
        } catch (error) {
            return res.status(500).json({ ok: false, message: error.message });
        }
    }

    // GET /nota/docente/:ci_docente — lista las notas registradas por un docente
    static async listarPorDocente(req, res){
        try {
            const notas = await NotaService.listarPorDocente(req.params.ci_docente);
            return res.status(200).json({ ok: true, message: "notas registradas por el docente", data: notas });
        } catch (error) {
            return res.status(500).json({ ok: false, message: error.message });
        }
    }

    // DELETE /nota/:id — elimina una nota por ID
    static async eliminar(req, res){
        try {
            await NotaService.eliminar(req.params.id);
            return res.status(200).json({ ok: true, message: "Nota eliminada correctamente" });
        } catch (error) {
            return res.status(500).json({ ok: false, message: error.message });
        }
    }
}

export default NotaController;
