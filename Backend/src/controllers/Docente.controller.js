import DocenteService from "../service/Docente.service.js";

class DocenteController {
    static async crear(req, res){
        console.log(req.body);
        try {
            await DocenteService.crearDocente(req.body);
            return res.status(201).json({ message: "docente creado exitosamente", okey: true });
        } catch (error) {
            return res.status(400).json({ message: error.message || "no se creó el Docente" });
        }
    }

    static async actualizar(req, res){
        try {
            console.log(req.body);
            const data = {
                ci_docente: req.body.ci,  // ci_docente es la nueva PK del modelo Docente
                nombre:     req.body.nombre,
                apellidos:  req.body.apellidos,
                edad:       req.body.edad,
            };
            console.log(data);
            await DocenteService.actualizarDocente(data.ci_docente, data);
            return res.status(200).json({ message: "docente actualizado exitosamente", okey: true });
        } catch (error) {
            return res.status(400).json({ message: error.message || "no se actualizó el Docente" });
        }
    }

    static async listaDocentes(req, res){
        try {
            const { page = 1, limit = 10 } = req.query;
            const resultado = await DocenteService.listarDocente(page, limit);
            res.status(200).json({ message: "lista de docentes", okey: true, ...resultado });
        } catch (error) {
            return res.status(400).json({ message: error.message || "error al listar docentes", okey: false });
        }
    }

    static async docentesAsignado(req, res){
        try {
            console.log("asignaciones");
            const asignaciones = await DocenteService.docentesAsignado();
            res.status(200).json({ message: "docentes asignados", result: asignaciones, okey: true });
        } catch (error) {
            return res.status(400).json({ message: error.message || "sin lista", result: {}, okey: false });
        }
    }

    // GET /docente/:ci — busca un docente por CI con sus materias asignadas
    static async buscar(req, res){
        try {
            const docente = await DocenteService.buscarPorId(req.params.ci);
            if (!docente) return res.status(404).json({ ok: false, message: "Docente no encontrado" });
            return res.status(200).json({ ok: true, data: docente });
        } catch (error) {
            return res.status(500).json({ ok: false, message: error.message });
        }
    }

    // DELETE /docente/:ci — elimina un docente por CI
    static async eliminar(req, res){
        try {
            await DocenteService.eliminar(req.params.ci);
            return res.status(200).json({ ok: true, message: "Docente eliminado correctamente" });
        } catch (error) {
            return res.status(500).json({ ok: false, message: error.message });
        }
    }

    // POST /docente/lista — busca o crea la lista de asistencia para una clase
    static async lista(req, res){
        console.log("llego a esta parte", req.user);
        try {
            const data = {
                idAula:    req.body.idAula,
                idMateria: req.body.idMateria,
                fecha:     req.body.fecha,
                idDocente: parseInt(req.user.id)
            };
            const lista = await DocenteService.llamarLista(data);
            res.status(200).json({ okey: true, lista });
        } catch (error) {
            return res.status(400).json({ message: error.message + " no se obtuvo la lista" });
        }
    }
}

export default DocenteController;
