import { DataTypes } from "sequelize";
import sequelize from "../database/database";

export const Like = sequelize.define('like',
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        tipo: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        id_publicacion: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'publicacion',
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
        tableName: 'like'
    }
);