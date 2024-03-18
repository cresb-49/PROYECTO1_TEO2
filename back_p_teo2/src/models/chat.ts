import { DataTypes } from "sequelize";
import sequelize from "../database/database";
import { Message } from "./message";

export const Chat = sequelize.define('chat',
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        id_usuario_1: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'usuario',
                key: 'id'
            }
        },
        id_usuario_2: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'usuario',
                key: 'id'
            }
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
        tableName: 'chat'
    }
);

Chat.hasMany(Message, { foreignKey: 'id' });
Message.belongsTo(Chat, { foreignKey: 'id' });