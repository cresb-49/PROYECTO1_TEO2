import { DataTypes } from "sequelize";
import sequelize from "../database/database";

export const Categoria = sequelize.define('categoria',
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
                model: 'categoria',
                key: 'id'
            }
        }
    },
    {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        tableName: 'categoria'
    }
);