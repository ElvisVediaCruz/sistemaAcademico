import { Sequelize, DataTypes, Model } from "sequelize";

export default(sequelize) => {
    class DetalleAsistencia extends Model{
        static associate(models) {
            this.belongsTo(models.ListaAsistencia, {
                foreignKey: "id_lista",
                as: "lista",
            });

            this.belongsTo(models.Estudiante, {
                foreignKey: "id_estudiante",
                as: "estudiante",
            });
        }
    }

    DetalleAsistencia.init(
        {
            // CAMBIO: renombrado de id_detalle_asistencia a id_detalle según el nuevo modelo Detalle_Asistencia
            id_detalle:{
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            // NUEVO: FK hacia ListaAsistencia definida explícitamente (antes era implícita en la asociación)
            id_lista: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: "ListaAsistencia", key: "id_lista" }
            },
            // NUEVO: FK hacia Estudiante definida explícitamente (antes era implícita en la asociación)
            id_estudiante: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: "Estudiante", key: "ci_estudiante" }
            },
            estado: {
                type: DataTypes.STRING,
                allowNull: false
            },
            // ELIMINADO: created_by y updated_by ya no existen en el nuevo modelo Detalle_Asistencia
        },
        {
            sequelize,
            modelName: "DetalleAsistencia",
            freezeTableName: true
        }
    );
    return DetalleAsistencia;
}
