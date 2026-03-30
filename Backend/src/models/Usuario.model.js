import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
    class User extends Model{
    }

    User.init(
        {
            // CAMBIO: renombrado de id_user a id_usuario según el nuevo modelo Usuario
            id_usuario:{
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: false
            },
            password:{
                type: DataTypes.STRING,
                allowNull: false
            },
            rol:{
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: "User",
            freezeTableName: true
        }
    );
    return User;
}
