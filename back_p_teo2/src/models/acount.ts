import { DataTypes } from "sequelize";
import sequelize from "../database/database";

export const Acount = sequelize.define('acount',
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        nombres: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        apellidos: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        saldo_retirable: {
            type: DataTypes.DECIMAL(8, 2),
            defaultValue: 0
        },
        saldo_no_retirable: {
            type: DataTypes.DECIMAL(8, 2),
            defaultValue: 0
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
        tableName: 'acount'
    }
);