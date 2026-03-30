import { faker } from "@faker-js/faker";
import { sequelize } from "../db/connection.js";
import { Docente, Aula, Materia, Estudiante } from "../models/index.js";

const cursos = ["primero A", "primero B", 
    "primero C", "primero D",
    "primero E","primero F",
    "primero G"]
const materias = ["matematicas", "quimica",
    "biologia", "ingles",
    "fisica", "lenguaje",
    "religion"
]

async function seedPassword(){
    const pas = [];
    for(let i = 1; i <= 20; i++){
        pas.push({
            id_user: i,
            password: ""
        })
    }
}
async function seedDocentes() {
    const docentes = [];

    for (let i = 1; i <= 20; i++) {
        docentes.push({
            id_docente: i,
            nombre: faker.person.firstName(),
            apellidos: faker.person.lastName(),
            edad: faker.number.int({ min: 25, max: 60 }),
        });

    }
    await Docente.bulkCreate(docentes);

    console.log("Docentes creados correctamente");
}
async function seedAulas(){
    const aulas = [];
    for(let i = 0; i <= 6; i++){
        aulas.push({
            nombre: cursos[i]
        })
    }
    await Aula.bulkCreate(aulas);
    console.log("aulas creados correctamente");
}
async function seedMaterias() {
    const aulas = [];
    for(let i = 0; i <= 6; i++){
        aulas.push({
            nombre: materias[i]
        })
    }
    await Materia.bulkCreate(aulas);
    console.log("aulas creados correctamente");
}
async function seedEstudiantes() {
    const docentes = [];
    for (let i = 30; i <= 2030; i++) {
        docentes.push({
            id_docente: i,
            nombre: faker.person.firstName(),
            apellidos: faker.person.lastName(),
            edad: faker.number.int({ min: 7, max: 25 }),
            id_aula: faker.number.int({min: 1, max: 7})
        });
    }
    await Estudiante.bulkCreate(docentes);

    console.log("Estudiantes creados correctamente");
}

async function seedDatabase() {

    try {

        await sequelize.sync();
        await seedDocentes();
        await seedAulas();
        await seedEstudiantes();
        await seedMaterias();

        console.log("Base de datos poblada correctamente");

    } catch (error) {

        console.error(error);

    }
}

seedDatabase();