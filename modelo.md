Table Aula {
  id_aula int [pk, increment]
  nombre varchar
}

Table Estudiante {
  ci_estudiante int [pk]
  nombre varchar
  apellidos varchar
  edad int
  ruta_img varchar
  huella varchar
  id_aula int [ref: > Aula.id_aula]
}    

Table Docente {
  ci_docente int [pk]
  nombre varchar
  apellidos varchar
  edad int
  ruta_img varchar
  huella varchar
}

Table Materia {
  id_materia int [pk, increment]
  nombre varchar
}

Table Aula_Docente_Materia {
  id_docente_materia int [pk, increment]
  id_aula int [ref: > Aula.id_aula]
  id_docente int [ref: > Docente.ci_docente]
  id_materia int [ref: > Materia.id_materia]
}

Table Lista_Asistencia {
  id_lista int [pk, increment]
  fecha date
  id_aula int [ref: > Aula.id_aula]
  id_materia int [ref: > Materia.id_materia]
  id_docente int [ref: > Docente.ci_docente]
}

Table Detalle_Asistencia {
  id_detalle int [pk, increment]
  id_lista int [ref: > Lista_Asistencia.id_lista]
  id_estudiante int [ref: > Estudiante.ci_estudiante]
  estado varchar // Presente, Ausente, Tarde
}

Table Usuario {
  id_usuario int [pk]
  password varchar
}

Table Nota {
  id_nota int [pk, increment]
  id_estudiante int [ref: > Estudiante.ci_estudiante]
  id_materia int [ref: > Materia.id_materia]
  id_docente int [ref: > Docente.ci_docente] // opcional, para saber quién registró
  valor decimal // la nota
  fecha date
  descripcion varchar // opcional: examen, tarea, proyecto, etc.
}