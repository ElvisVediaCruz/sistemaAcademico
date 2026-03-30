// 🔹 Crear conexión
import {sequelize} from "../db/connection.js";

// 🔹 Importar funciones de modelos
import UserModel from "./Usuario.model.js";
import AulaModel from "./Aula.model.js";
import EstudianteModel from "./Estudiante.model.js";
import DocenteModel from "./Docente.model.js";
import MateriaModel from "./Materia.model.js";
import DocenteMateriaModel from "./DocenteMateria.model.js";
import ListaAsistenciaModel from "./ListaAsistencia.model.js";
import DetalleAsistenciaModel from "./DetalleAsistencia.model.js";
import NotaModel from "./Nota.model.js";

// 🔹 Inicializar modelos
const Aula = AulaModel(sequelize);
const Estudiante = EstudianteModel(sequelize);
const Docente = DocenteModel(sequelize);
const Materia = MateriaModel(sequelize);
const DocenteMateria = DocenteMateriaModel(sequelize);
const ListaAsistencia = ListaAsistenciaModel(sequelize);
const DetalleAsistencia = DetalleAsistenciaModel(sequelize);
const User = UserModel(sequelize);
const Nota = NotaModel(sequelize);

// 🔹 Guardar en objeto
const models = {
  User,
  Aula,
  Estudiante,
  Docente,
  Materia,
  DetalleAsistencia,
  DocenteMateria,
  ListaAsistencia,
  Nota,
};

// 🔥 Ejecutar asociaciones
Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

// 🔹 Exportar todo
export {
    User,
    sequelize,
    Aula,
    Estudiante,
    Docente,
    Materia,
    DocenteMateria,
    ListaAsistencia,
    DetalleAsistencia,
    Nota,
}

export default models;
