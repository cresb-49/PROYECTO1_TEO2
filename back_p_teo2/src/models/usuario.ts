import { DataTypes } from "sequelize";
import sequelize from "../database/database";

export const Usuario = sequelize.define('usuario',
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        nombres: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        apellidos: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        f_nacimiento: {
            type: DataTypes.DATE,
            allowNull: false
        },
        id_cuenta: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'cuenta',
                key: 'id'
            }
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        created_at: {
            allowNull: false,
            type: DataTypes.DATE
        },
        updated_at: {
            allowNull: false,
            type: DataTypes.DATE
        }
    },
    {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        tableName: 'usuario'
    }
);