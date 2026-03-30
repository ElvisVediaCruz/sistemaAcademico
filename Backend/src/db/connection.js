import { Sequelize } from "sequelize";

const database = "SistemaAcademico";
const username = "root";
const password = "8817891";
const host = "localhost";
export const sequelize = new Sequelize(
    database,
    username, 
    password, {
        host: host,
        dialect:  "mysql"
});