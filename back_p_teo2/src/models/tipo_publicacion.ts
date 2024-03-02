import { DataTypes } from "sequelize";
import sequelize from "../database/database";

export const Articulo = sequelize.define('tipo_publicacion',
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        tipo: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        timestamps: false,
        tableName: 'tipo_publicacion'
    }
);