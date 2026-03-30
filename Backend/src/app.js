import express from "express";
import cors from "cors";

import MateriaRoute from "./routes/Materia.route.js";
import DocenteRoute from "./routes/Doncete.route.js";
import AsistenciaRoute from "./routes/Asistencia.route.js";
import AulaRoute from "./routes/Aula.route.js";
import DocenteMateriaRoute from "./routes/DocenteMateria.route.js";
import EstudianteRoute from "./routes/Estudiante.route.js";
import AuthRoute from "./routes/Auth.route.js";
// NUEVO: ruta para el modelo Nota definido en modelo.md
import NotaRoute from "./routes/Nota.route.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", AuthRoute);
app.use("/materia", MateriaRoute);
app.use("/docente", DocenteRoute);
app.use("/asistencia", AsistenciaRoute);
app.use("/aula", AulaRoute);
app.use("/docentemateria", DocenteMateriaRoute);
app.use("/estudiante", EstudianteRoute);
app.use("/nota", NotaRoute);

export default app;