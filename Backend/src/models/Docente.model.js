import { Sequelize, DataTypes, Model } from "sequelize";

export default (sequelize) => {
    class Docente extends Model{
        static associate(models) {
            this.belongsToMany(models.Materia, {
                through: models.DocenteMateria,
                // foreignKey referencia el campo id_docente en la tabla pivote DocenteMateria
                foreignKey: "id_docente",
                otherKey: "id_materia",
                as: "materia",
            });

            // NUEVO: un docente puede tener muchas listas de asistencia (id_docente en Lista_Asistencia)
            this.hasMany(models.ListaAsistencia, {
                foreignKey: "id_docente",
                as: "listas_asistencia",
            });

            // NUEVO: un docente puede registrar muchas notas (id_docente en Nota)
            this.hasMany(models.Nota, {
                foreignKey: "id_docente",
                as: "nota",
            });
        }
    }

    Docente.init(
        {
            // CAMBIO: renombrado de id_docente a ci_docente según el nuevo modelo Docente
            ci_docente:{
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: false  // es el CI del docente
            },
            nombre:{
                type: DataTypes.STRING,
                allowNull: false
            },
            apellidos:{
                type: DataTypes.STRING,
                allowNull: false
            },
            edad:{
                type: DataTypes.INTEGER,
                allowNull: false
            },
            ruta_img:{
                type: DataTypes.STRING
            },
            huella:{
                type: DataTypes.STRING
            },
        },
        {
            sequelize,
            modelName: "Docente",
            freezeTableName: true,
        }
    );
    return Docente;
}
