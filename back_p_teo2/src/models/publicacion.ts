import { DataTypes } from "sequelize";
import sequelize from "../database/database";

export const Publicacion = sequelize.define('publicacion',
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        id_articulo: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'articulo',
                key: 'id'
            }
        },
        id_tipo_publicacion: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'tipo_publicacion',
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
    }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    tableName: 'publicacion'
}
);