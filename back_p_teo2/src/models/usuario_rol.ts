import { DataTypes } from "sequelize";
import sequelize from "../database/database";

export const Articulo = sequelize.define('usuario_rol',
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        id_rol: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'rol',
                key: 'id'
            }
        },
        id_usuario: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'usuario',
                key: 'id'
            }
        }
    },
    {
        timestamps: false,
        tableName: 'usuario_rol'
    }
);