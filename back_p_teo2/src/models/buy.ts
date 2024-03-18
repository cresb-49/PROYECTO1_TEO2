import { DataTypes } from "sequelize";
import sequelize from "../database/database";
import { Articulo } from "./articulo";

export const Buy = sequelize.define('buy',
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        id_usuario_compra: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'usuario',
                key: 'id'
            }
        },
        id_usuario_venta: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'usuario',
                key: 'id'
            }
        },
        id_articulo_venta: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'articulo',
                key: 'id'
            }
        },
        cantidad_articulo_venta: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        id_articulo_cambio: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'articulo',
                key: 'id'
            }
        },
        cantidad_articulo_cambio: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        valida: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        valor_venta: {
            type: DataTypes.DECIMAL(8, 2),
            allowNull: false,
        },
        creditos_retirables_usados: {
            type: DataTypes.DECIMAL(8, 2),
            allowNull: false,
            defaultValue: 0
        },
        creditos_no_retirables_usados: {
            type: DataTypes.DECIMAL(8, 2),
            allowNull: false,
            defaultValue: 0
        },
        creditos_generados: {
            type: DataTypes.DECIMAL(8, 2),
            allowNull: false,
            defaultValue: 0,
        },
        validate_at: {
            allowNull: true,
            type: DataTypes.DATE
        },
        created_at: {
            allowNull: false,
            type: DataTypes.DATE
        },
        deleted_at: {
            allowNull: true,
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
        deletedAt: 'deleted_at',
        tableName: 'buy'
    }
);