import AsistenciaService from "../service/Asistencia.service.js";

class AsistenciaController{
    // POST /asistencia/crear — crea una lista de asistencia con todos los alumnos del aula
    static async crear(req, res) {
        try {
            const asistencia = await AsistenciaService.crear(req.body);
            return res.status(201).json({ ok: true, message: "asistencia creada correctamente", data: asistencia });
        } catch (error) {
            return res.status(500).json({ ok: false, message: error.message });
        }
    }

    // PUT /asistencia/actualizar — actualiza el estado de un detalle (presente/ausente/tarde)
    static async actualizar(req, res) {
        try {
            const detalle = await AsistenciaService.actualizar(req.body.id, {
                estado: req.body.estado
            });
            return res.status(200).json({ ok: true, message: "asistencia actualizada correctamente", data: detalle });
        } catch (error) {
            return res.status(500).json({ ok: false, message: error.message });
        }
    }

    // GET /asistencia/lista/:id_lista — obtiene una lista con sus detalles y datos de estudiantes
    static async buscarLista(req, res){
        console.log("la lista")
        try {
            const lista = await AsistenciaService.buscarLista(req.params.id_lista);
            if (!lista) return res.status(404).json({ ok: false, message: "Lista no encontrada" });
            return res.status(200).json({mensaje: "la lista", ok: true, data: lista });
        } catch (error) {
            return res.status(500).json({ ok: false, message: error.message });
        }
    }

    // GET /asistencia/aula/:id_aula — lista los registros de asistencia de un aula
    static async listarPorAula(req, res){
        try {
            console.log("parametro", req.params.id_aula)
            const listas = await AsistenciaService.listarPorAula(req.params.id_aula);
            return res.status(200).json({ ok: true, message: "listas de asistencia del aula", data: listas });
        } catch (error) {
            return res.status(500).json({ ok: false, message: error.message });
        }
    }

    // GET /asistencia/docente/:id_docente — lista los registros de asistencia de un docente
    static async listarPorDocente(req, res){
        try {
            const listas = await AsistenciaService.listarPorDocente(req.params.id_docente);
            return res.status(200).json({ ok: true, message: "listas de asistencia del docente", data: listas });
        } catch (error) {
            return res.status(500).json({ ok: false, message: error.message });
        }
    }
}

export default AsistenciaController;
