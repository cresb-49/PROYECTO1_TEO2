import { DataTypes } from "sequelize";
import sequelize from "../database/database";
import { Publicacion } from "./publicacion";

export const Articulo = sequelize.define('articulo',
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        nombre: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        valor: {
            type: DataTypes.DECIMAL(8, 2),
            allowNull: false
        },
        descripcion: {
            type: DataTypes.TEXT
        },
        id_categoria: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'categoria',
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
        f_desactivado: {
            type: DataTypes.DATE
        },
        cantidad: {
            type: DataTypes.INTEGER
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
        tableName: 'articulo'
    }
);

Articulo.hasOne(Publicacion, { foreignKey: 'id_articulo' });
Publicacion.belongsTo(Articulo, { foreignKey: 'id_articulo' });