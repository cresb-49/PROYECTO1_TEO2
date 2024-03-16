import { DataTypes } from "sequelize";
import sequelize from "../database/database";

export const BuyTransaccion = sequelize.define('buy_transaccion',
    {
        id_buy: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: {
                model: 'buy',
                key: 'id'
            }
        },
        id_transaccion: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: {
                model: 'transaccion',
                key: 'id'
            }
        }
    },
    {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        tableName: 'buy_transaccion'
    }
);