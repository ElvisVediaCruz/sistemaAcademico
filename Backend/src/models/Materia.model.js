import { Sequelize, DataTypes, Model } from "sequelize";

export default(sequelize) => {
    class Materia extends Model{
        static associate(models) {
            this.belongsToMany(models.Docente, {
                through: models.DocenteMateria,
                foreignKey: "id_materia",
                otherKey: "id_docente",
                as: "docente",
            });

            this.hasMany(models.ListaAsistencia, {
                foreignKey: "id_materia",
                as: "lista",
            });

            // NUEVO: una materia puede tener muchas notas (Nota referencia id_materia)
            this.hasMany(models.Nota, {
                foreignKey: "id_materia",
                as: "nota",
            });
        }
    }
    Materia.init(
        {
            id_materia:{
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
            modelName: "Materia",
            freezeTableName: true
        }
    );
    return Materia;
}
