import { DataTypes } from "sequelize";
import sequelize from "../database/database";

export const UsuarioRol = sequelize.define('usuario_rol',
    {
        id_rol: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'rol',
                key: 'id'
            }
        },
        id_usuario: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
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