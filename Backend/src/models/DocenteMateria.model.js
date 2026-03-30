import { Sequelize, DataTypes, Model } from "sequelize";

// CAMBIO: este modelo ahora refleja Aula_Docente_Materia del nuevo modelo.md
//         Se agregan los campos FK (id_aula, id_docente, id_materia) de forma explícita
//         para que Sequelize los gestione correctamente en queries y sincronización.
export default(sequelize) => {
    class DocenteMateria extends Model{
        static associate(models) {
            // NUEVO: asociaciones para las tres FK del nuevo modelo Aula_Docente_Materia
            this.belongsTo(models.Aula, {
                foreignKey: "id_aula",
                as: "aula",
            });
            this.belongsTo(models.Docente, {
                foreignKey: "id_docente",
                as: "docente",
            });
            this.belongsTo(models.Materia, {
                foreignKey: "id_materia",
                as: "materia",
            });
        }
    }

    DocenteMateria.init(
        {
            id_docente_materia:{
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            // NUEVO: FK hacia Aula (nuevo campo en Aula_Docente_Materia)
            id_aula: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: "Aula", key: "id_aula" }
            },
            // NUEVO: FK hacia Docente
            id_docente: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: "Docente", key: "ci_docente" }
            },
            // NUEVO: FK hacia Materia
            id_materia: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: "Materia", key: "id_materia" }
            },
        },
        {
            sequelize,
            modelName: "DocenteMateria",
            freezeTableName: true
        }
    );
    return DocenteMateria;
}
