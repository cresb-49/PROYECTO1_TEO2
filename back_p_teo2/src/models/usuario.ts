import { DataTypes } from "sequelize";
import sequelize from "../database/database";
import { Acount } from "./acount";
import { Comentario } from "./comentario";
import { UsuarioRol } from "./usuario_rol";
import { Message } from "./message";

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
                model: 'acount',
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

Usuario.belongsTo(Acount, { foreignKey: 'id_cuenta' });

Usuario.hasMany(UsuarioRol, { foreignKey: 'id_usuario' });
UsuarioRol.belongsTo(Usuario, { foreignKey: 'id_usuario' });

// Usuario.belongsTo(Message, { foreignKey: 'id_usuario_1', as: 'usuario1' })
// Usuario.belongsTo(Message, { foreignKey: 'id_usuario_2', as: 'usuario2' })

// Message.belongsTo(Usuario, { foreignKey: 'id', as: 'usuario1' })
// Message.belongsTo(Usuario, { foreignKey: 'id', as: 'usuario2' })

