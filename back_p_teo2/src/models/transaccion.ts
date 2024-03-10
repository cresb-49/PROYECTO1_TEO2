import { DataTypes } from "sequelize";
import sequelize from "../database/database";

export const Transaccion = sequelize.define('transaccion',
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        id_cuenta_origen: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'acount',
                key: 'id'
            }
        },
        id_cuenta_destino: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'acount',
                key: 'id'
            }
        },
        descripcion: {
            type: DataTypes.STRING
        },
        valor: {
            type: DataTypes.DOUBLE,
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
        tableName: 'transaccion'
    }
);