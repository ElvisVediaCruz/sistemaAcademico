import MateriaService from "../service/Materia.service.js";

class MateriaController {
    static async crear(req, res) {
        const { nombre } = req.body;
        console.log(req.body);
        try {
            await MateriaService.crearMateria({ nombre });
            return res.status(201).json({ message: "Materia creada exitosamente", okey: true });
        } catch (error) {
            return res.status(400).json({ message: error.message || "no se creó la Materia" });
        }
    }

    static async actualizar(req, res) {
        const { nombreActual, nombreNuevo } = req.body;
        try {
            console.log(nombreActual, nombreNuevo)
            await MateriaService.actualizarMateria(nombreActual, nombreNuevo);
            return res.status(200).json({ message: "Materia actualizada exitosamente", okey: true });
        } catch (error) {
            return res.status(400).json({ message: error.message || "Error al actualizar la materia" });
        }
    }

    static async listar(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const resultado = await MateriaService.listarMaterias(page, limit);
            return res.status(200).json({ message: "Listado de materias", ...resultado });
        } catch (error) {
            return res.status(500).json({ message: error.message || "Error al listar las materias" });
        }
    }

    // GET /materia/:id_materia — obtiene una materia por ID
    static async buscar(req, res){
        try {
            const materia = await MateriaService.buscarPorId(req.params.id_materia);
            if (!materia) return res.status(404).json({ ok: false, message: "Materia no encontrada" });
            return res.status(200).json({ ok: true, data: materia });
        } catch (error) {
            return res.status(500).json({ ok: false, message: error.message });
        }
    }

    // DELETE /materia/:id_materia — elimina una materia por ID
    static async eliminar(req, res){
        try {
            await MateriaService.eliminar(req.params.id_materia);
            return res.status(200).json({ ok: true, message: "Materia eliminada correctamente" });
        } catch (error) {
            return res.status(500).json({ ok: false, message: error.message });
        }
    }
}

export default MateriaController;
