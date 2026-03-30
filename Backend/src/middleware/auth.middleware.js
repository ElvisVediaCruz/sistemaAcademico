import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clavePublica = fs.readFileSync(
  path.join(__dirname, "../../public.key"),
  "utf8"
);
export function verificarToken(req, res, next){
  const authHeader = req.headers.authorization;
  if(!authHeader){
    return res.status(401).json({ mensaje: "Token requerido" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, clavePublica, { algorithms: ["RS256"] });
    req.user = decoded;
    next();
  } catch(error){
    if(error.name === "TokenExpiredError"){
      return res.status(401).json({ mensaje: "Sesión expirada, inicia sesión nuevamente" });
    }
    return res.status(401).json({ mensaje: "Token inválido" });
  }
}