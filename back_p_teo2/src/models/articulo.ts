import { DataTypes } from "sequelize";
import sequelize from "../database/database";
import { Publicacion } from "./publicacion";
import { Category } from "./category";
import { Buy } from "./buy";
import { Image } from "./image"

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
                model: 'category',
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

Articulo.belongsTo(Buy, { foreignKey: 'id', as: 'articulo_venta' });
Articulo.belongsTo(Buy, { foreignKey: 'id', as: 'articulo_cambio' });
Buy.belongsTo(Articulo, { foreignKey: 'id_articulo_venta', as: 'articulo_venta' });
Buy.belongsTo(Articulo, { foreignKey: 'id_articulo_cambio', as: 'articulo_cambio' });

Articulo.belongsTo(Category, { foreignKey: 'id_categoria' });

Articulo.hasMany(Image, { foreignKey: 'id_articulo' });
Image.belongsTo(Articulo, { foreignKey: 'id_articulo' });