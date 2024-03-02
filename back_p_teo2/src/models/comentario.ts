import { DataTypes } from "sequelize";
import sequelize from "../database/database";

export const Comentario = sequelize.define('comentario',
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        texto: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        id_usuario: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'usuario',
                key: 'id'
            }
        },
        id_publicacion: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'publicacion',
                key: 'id'
            }
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
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        tableName: 'comentario'
    }
);