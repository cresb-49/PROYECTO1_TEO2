import { DataTypes } from "sequelize";
import sequelize from "../database/database";

export const TasaCambio = sequelize.define('tasa_cambio',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        valor_compra: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        valor_venta: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
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
        tableName: 'tasa_cambio'
    }
);