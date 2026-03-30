import { Sequelize, DataTypes, Model } from "sequelize";

export default(sequelize) => {
    class ListaAsistencia extends Model{
        static associate(models) {
            this.belongsTo(models.Materia, {
                foreignKey: "id_materia",
                as: "Materia",
            });

            // NUEVO: Lista_Asistencia ahora pertenece a un Aula (nuevo campo id_aula en el modelo)
            this.belongsTo(models.Aula, {
                foreignKey: "id_aula",
                as: "aula",
            });

            // NUEVO: Lista_Asistencia ahora pertenece a un Docente (nuevo campo id_docente en el modelo)
            this.belongsTo(models.Docente, {
                foreignKey: "id_docente",
                as: "docente",
            });

            this.hasMany(models.DetalleAsistencia, {
                foreignKey: "id_lista",
                as: "detalle",
            });
        }
    }
    ListaAsistencia.init(
        {
            // CAMBIO: renombrado de id_lista_asistencia a id_lista según el nuevo modelo Lista_Asistencia
            id_lista:{
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            fecha:{
                type: DataTypes.DATEONLY,  // CAMBIO: DATE → DATEONLY para coincidir con tipo 'date' del modelo
            },
            // NUEVO: FK hacia Aula (nuevo campo en Lista_Asistencia)
            id_aula: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: "Aula", key: "id_aula" }
            },
            // NUEVO: FK hacia Materia
            id_materia: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: "Materia", key: "id_materia" }
            },
            // NUEVO: FK hacia Docente (nuevo campo en Lista_Asistencia)
            id_docente: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: "Docente", key: "ci_docente" }
            },
        },
        {
            sequelize,
            modelName: "ListaAsistencia",
            freezeTableName: true
        }
    );
    return ListaAsistencia;
}
