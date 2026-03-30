import { Sequelize, DataTypes, Model } from "sequelize";

export default (sequelize) => {
    class Aula extends Model{
        static associate(models) {
            this.hasMany(models.Estudiante, {
                foreignKey: "id_aula",
                as: "estudiante"  // CORRECCIÓN TYPO: era "estudiates"
            });

            // NUEVO: un aula puede tener muchas asignaciones Aula_Docente_Materia
            this.hasMany(models.DocenteMateria, {
                foreignKey: "id_aula",
                as: "asignacion",
            });

            // NUEVO: un aula puede tener muchas listas de asistencia (id_aula en Lista_Asistencia)
            this.hasMany(models.ListaAsistencia, {
                foreignKey: "id_aula",
                as: "listas_asistencia",
            });
        }
    }
    Aula.init(
        {
            id_aula:{
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            nombre: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: "Aula",
            freezeTableName: true
        }
    );

    return Aula;
}
