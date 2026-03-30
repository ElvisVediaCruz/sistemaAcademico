import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
    class Estudiante extends Model{
        static associate(models) {
            // CAMBIO: era hasMany(Aula) que era incorrecto —un estudiante pertenece a un aula,
            //         no tiene muchas. Refleja la FK id_aula del nuevo modelo.
            this.belongsTo(models.Aula, {
                foreignKey: "id_aula",
                as: "aula"
            });

            this.hasMany(models.DetalleAsistencia, {
                foreignKey: "id_estudiante",
                as: "asistencia",
            });

            // NUEVO: relación con Nota (modelo nuevo en modelo.md)
            this.hasMany(models.Nota, {
                foreignKey: "id_estudiante",
                as: "nota",
            });
        }
    }

    Estudiante.init(
        {
            // NUEVO: ci_estudiante definido explícitamente como PK según el nuevo modelo.
            //        Antes Sequelize generaba el campo 'id' automáticamente.
            ci_estudiante: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: false  // es el CI del estudiante, no autoincremental
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
            // NUEVO: FK hacia Aula, refleja la columna id_aula del nuevo modelo Estudiante
            id_aula: {
                type: DataTypes.INTEGER,
                references: {
                    model: "Aula",
                    key: "id_aula"
                }
            }
        },
        {
            sequelize,
            modelName: "Estudiante",
            freezeTableName: true
        }
    );
    return Estudiante;
}
