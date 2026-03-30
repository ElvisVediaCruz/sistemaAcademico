import jwt from 'jsonwebtoken';
import fs from 'node:fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Convierte import.meta.url a ruta de sistema de archivos correcta
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const clavePrivada = fs.readFileSync(path.join(__dirname, "../../private.key"), 'utf8');

export function generarToken(usuario){
    const tk = jwt.sign({
        id: usuario.id,
        rol: usuario.rol
        
    }, clavePrivada, { algorithm: 'RS256', expiresIn: '1h' });
    return tk;
}