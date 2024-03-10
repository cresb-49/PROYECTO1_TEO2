import { DataTypes } from "sequelize";
import sequelize from "../database/database";

export const Category = sequelize.define('category',
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        porcentaje_ganancias: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        id_categoria_padre: {
            type: DataTypes.INTEGER,
            references: {
                model: 'category',
                key: 'id'
            }
        }
    },
    {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        tableName: 'category'
    }
);