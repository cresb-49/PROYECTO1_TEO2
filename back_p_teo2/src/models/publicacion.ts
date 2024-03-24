import { DataTypes } from "sequelize";
import sequelize from "../database/database";
import { Articulo } from "./articulo";
import { Report } from "./report";
import { Usuario } from "./usuario";
import { TipoPublicacion } from "./tipo_publicacion";
import { Comentario } from "./comentario";

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
        isValidate: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        f_validacion: {
            type: DataTypes.DATE
        },
        isReported: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        f_reporte: {
            allowNull: true,
            type: DataTypes.DATE
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

//Publicacion.belongsTo(Articulo, { foreignKey: 'id_articulo' });

Publicacion.belongsTo(Usuario, { foreignKey: 'id_usuario' });
Publicacion.belongsTo(TipoPublicacion, { foreignKey: 'id_tipo_publicacion' });

Publicacion.hasMany(Comentario, { foreignKey: 'id_publicacion' });
Comentario.belongsTo(Publicacion, { foreignKey: 'id_publicacion' });

Publicacion.hasMany(Report, { foreignKey: 'id_publicacion' });
Report.belongsTo(Publicacion, { foreignKey: 'id_publicacion' });