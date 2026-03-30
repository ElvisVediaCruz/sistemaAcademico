import {User, Aula, Docente, Materia, Estudiante, ListaAsistencia, DetalleAsistencia, Nota, DocenteMateria, } from  "../models/index.js";


async function syncDatabase() {
  try {6
    // force: true => borra y recrea tablas
    // alter: true => actualiza estructura sin borrar datos
    await Aula.sync({ alter: true });       // primero tabla padres
    await User.sync();
    await Docente.sync({ alter: true });
    await Materia.sync({ alter: true });

    await Estudiante.sync({ alter: true }); // dependientes de Aulas
    await ListaAsistencia.sync({ alter: true }); // dependientes de Aulas, Materias, Docentes
    await DetalleAsistencia.sync({ alter: true });
    await Nota.sync({ alter: true });
    await DocenteMateria.sync({alter: true})
    console.log("Base de datos sincronizada correctamente.");
  } catch (error) {
    console.error("Error al sincronizar la base de datos:", error);
  }
}6

export default syncDatabase;