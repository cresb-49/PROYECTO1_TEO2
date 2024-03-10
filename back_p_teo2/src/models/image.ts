import { DataTypes } from "sequelize";
import sequelize from "../database/database";

export const Image = sequelize.define('image',
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        id_articulo:{
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'articulo',
                key: 'id'
            }
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false
        },
        prioridad: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
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
    },
    {
        tableName: 'image',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at'
    }
);