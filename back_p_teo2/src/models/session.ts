import { DataTypes } from "sequelize";
import sequelize from "../database/database";

export const Articulo = sequelize.define('sesion',
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        id_usuario: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'usuario',
                key: 'id'
            }
        },
        token: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        f_validez: {
            type: DataTypes.DATE,
            allowNull: false
        },
        created_at: {
            allowNull: false,
            type: DataTypes.DATE
        },
        updated_at: {
            allowNull: false,
            type: DataTypes.DATE
        },
        deleted_at: {
            type: DataTypes.DATE
        }
    }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    tableName: 'sesion'
}
);