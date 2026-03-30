// Normaliza todos los campos de texto a minúsculas y sin espacios extra.
// Excluye campos sensibles como password/contraseña.
const CAMPOS_EXCLUIDOS = new Set(["password", "contraseña"]);

const CAMPOS_TEXTO = [
    "nombre", "apellidos", "nombreActual", "nombreNuevo",
    "descripcion", "estado",
];

export function normalizarTexto(req, res, next) {
    if (req.body && typeof req.body === "object") {
        for (const campo of CAMPOS_TEXTO) {
            if (typeof req.body[campo] === "string" && !CAMPOS_EXCLUIDOS.has(campo)) {
                req.body[campo] = req.body[campo].toLowerCase().trim();
            }
        }
    }
    next();
}
