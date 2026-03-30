import { DataTypes, Model } from "sequelize";

// NUEVO: modelo Nota definido en modelo.md
//        Registra la nota de un estudiante en una materia, opcionalmente vinculada a un docente.
export default (sequelize) => {
    class Nota extends Model {
        static associate(models) {
            // Una nota pertenece a un estudiante
            this.belongsTo(models.Estudiante, {
                foreignKey: "id_estudiante",
                as: "estudiante",
            });
            // Una nota pertenece a una materia
            this.belongsTo(models.Materia, {
                foreignKey: "id_materia",
                as: "materia",
            });
            // Una nota puede pertenecer a un docente (opcional: quién la registró)
            this.belongsTo(models.Docente, {
                foreignKey: "id_docente",
                as: "docente",
            });
        }
    }

    Nota.init(
        {
            id_nota: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            id_estudiante: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: "Estudiante", key: "ci_estudiante" },
            },
            id_materia: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: "Materia", key: "id_materia" },
            },
            // opcional: docente que registró la nota
            id_docente: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: { model: "Docente", key: "ci_docente" },
            },
            valor: {
                type: DataTypes.DECIMAL,
                allowNull: false,
            },
            fecha: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            // opcional: descripción de la evaluación (examen, tarea, proyecto, etc.)
            descripcion: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: "Nota",
            freezeTableName: true
        }
    );
    return Nota;
};
