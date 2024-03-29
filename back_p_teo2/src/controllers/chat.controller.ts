import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { responseAPI } from '../handler/responseAPI';
import { HttpStatus } from '../enums/httpStatus';
import { generatePagesToShow } from '../handler/generatePagesToShow';
import { Chat } from '../models/chat';
import { Message } from '../models/message';
import { TokenPayload } from '../middleware/authMiddleware';
import { Usuario } from '../models/usuario';
import sequelize from '../database/database';
//Tanto el Router como el controller tambien manejan la logica de los mensajes de los chats

export const getChatsUsuario = async (req: Request, res: Response) => {
    console.log('getChatsUsuario');
    //Obtenemos el id del usuario del token
    const tokenPayload: TokenPayload = req.tokenPayload;
    const id_usuario = tokenPayload.usuarioId;
    //Obtenemos los chats del usuario tanto si esta en la columna id_usuario_1 o id_usuario_2
    //Hacemos un group by para que no se repitan los chats
    Chat.findAll({
        where: {
            [Op.or]: [
                { id_usuario_1: id_usuario },
                { id_usuario_2: id_usuario }
            ]
        },
        include: [
            {
                model: Usuario,
                as: 'usuario_1',
                required: true,
                attributes: ['id', 'nombres', 'apellidos', 'email']
            },
            {
                model: Usuario,
                as: 'usuario_2',
                required: true,
                attributes: ['id', 'nombres', 'apellidos', 'email']
            }
        ],
        group: ['id_usuario_1', 'id_usuario_2']
    })
        .then((chats: any) => {
            return responseAPI(HttpStatus.OK, res, chats, 'Chats encontrados con exito');
        })
        .catch((error: any) => {
            return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, 'Error al obtener chats', error.message);
        });
};

export const getChat = async (req: Request, res: Response) => {
    //Obtenemos el id del usuario del token
    const tokenPayload: TokenPayload = req.tokenPayload;
    const id_usuario_1: number = parseInt(tokenPayload.usuarioId);
    //Obtenemos el id del usuario2
    let { id_usuario_2 } = req.body;
    id_usuario_2 = parseInt(id_usuario_2);
    //Creamos el chat si no existe ya la conversacion entre los dos usuarios
    let chat = await findOrCreateChat(id_usuario_1, id_usuario_2);
    return responseAPI(HttpStatus.OK, res, chat, 'Chat encontrado con exito');
};

export const findOrCreateChat = async (id_usuario_1: number | string, id_usuario_2: number | string, t = null) => {
    //Creamos el chat si no existe ya la conversacion entre los dos usuarios
    let chat = await Chat.findOne({
        where: {
            [Op.or]: [
                { id_usuario_1, id_usuario_2 },
                { id_usuario_1: id_usuario_2, id_usuario_2: id_usuario_1 }
            ]
        }
    });
    if (!chat) {
        if (t) {
            chat = await Chat.create(
                {
                    id_usuario_1,
                    id_usuario_2
                },
                { transaction: t }
            );
        } else {
            chat = await Chat.create({
                id_usuario_1,
                id_usuario_2
            });
        }
        return chat;
    } else {
        return chat;
    }
};

export const getChatById = async (req: Request, res: Response) => {
    //Obtenemos el id del usuario del token
    const tokenPayload: TokenPayload = req.tokenPayload;
    const id_usuario_1: number = parseInt(tokenPayload.usuarioId);
    //Obtenemos el id del usuario2
    const { id_chat } = req.body;
    //Creamos el chat si no existe ya la conversacion entre los dos usuarios
    let chat: any = await Chat.findOne({
        where: {
            id: id_chat
        }
    });
    if (chat) {
        let usuario_1 = parseInt(chat.id_usuario_1);
        let usuario_2 = parseInt(chat.id_usuario_2);
        if (usuario_1 === id_usuario_1 && usuario_2 !== id_usuario_1) {
            return responseAPI(HttpStatus.OK, res, chat, 'Chat encontrado con exito');
        } else if (usuario_2 === id_usuario_1 && usuario_1 !== id_usuario_1) {
            return responseAPI(HttpStatus.OK, res, chat, 'Chat encontrado con exito');
        } else {
            return responseAPI(HttpStatus.NOT_FOUND, res, null, 'Not Found', 'Not Found');
        }
    } else {
        return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, 'Error al obtener chat', 'Error al obtener chat');
    }
};

export const getMensajesChat = async (req: Request, res: Response) => {
    //Obtenemos el id del usuario del token
    const tokenPayload: TokenPayload = req.tokenPayload;
    const id_usuario: number = parseInt(tokenPayload.usuarioId);
    //Obtenemos el id del chat
    const { id_chat } = req.body;
    //Verificamos que el usuario pertenezca al chat tanto en el id_usuario_1 o id_usuario_2
    const chat: any = await Chat.findByPk(id_chat);
    if (!(parseInt(chat.id_usuario_1) === id_usuario || parseInt(chat.id_usuario_2) === id_usuario)) {
        return responseAPI(HttpStatus.NOT_FOUND, res, null, 'Not Found', 'Not Found');
    }
    //Obtenemos los mensajes del chat
    Message.findAll({
        where: {
            id_chat: id_chat
        }
    })
        .then((mensajes: any) => {
            return responseAPI(HttpStatus.OK, res, mensajes, 'Mensajes encontrados con exito');
        })
        .catch((error: any) => {
            return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, 'Error al obtener mensajes', error.message);
        });
};

export const sendMessageChat = async (req: Request, res: Response) => {
    //Obtenemos el id del usuario del token
    const tokenPayload: TokenPayload = req.tokenPayload;
    const id_usuario: number = parseInt(tokenPayload.usuarioId);
    //Obtenemos el id del chat
    const { id_chat, mensaje } = req.body;
    //Verificamos que el usuario pertenezca al chat tanto en el id_usuario_1 o id_usuario_2
    const chat: any = await Chat.findByPk(id_chat);
    if (!(parseInt(chat.id_usuario_1) === id_usuario || parseInt(chat.id_usuario_2) === id_usuario)) {
        return responseAPI(HttpStatus.NOT_FOUND, res, null, 'Not Found', 'Not Found');
    }
    //Creamos el mensaje
    try {
        let message = await sendMessageOnChat(id_usuario, id_chat, mensaje);
        return responseAPI(HttpStatus.OK, res, message, 'Mensaje enviado con exito');
    } catch (error) {
        return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, 'Error al enviar mensaje', error.message);
    }
}

export const sendMessageOnChat = async (id_usuario: number | string, id_chat: number | string, mensaje: string, t = null) => {
    //Creamos el mensaje
    try {
        let message = null;
        if (t) {
            message = await Message.create(
                {
                    id_chat: id_chat,
                    id_usuario: id_usuario,
                    text: mensaje
                },
                { transaction: t }
            );
        } else {
            message = await Message.create(
                {
                    id_chat: id_chat,
                    id_usuario: id_usuario,
                    text: mensaje
                }
            );
        }
        return message;
    } catch (error) {
        throw error;
    }
};

export const deleteChatById = async (req: Request, res: Response) => {
    //Obtenemos el id del usuario del token
    const tokenPayload: TokenPayload = req.tokenPayload;
    const id_usuario: number = parseInt(tokenPayload.usuarioId);
    //Obtenemos el id del chat
    const { idChat } = req.params;
    //Verificamos que el usuario pertenezca al chat tanto en el id_usuario_1 o id_usuario_2
    const chat: any = await Chat.findByPk(idChat);
    if (!(chat.id_usuario_1 === id_usuario || chat.id_usuario_2 === id_usuario)) {
        return responseAPI(HttpStatus.NOT_FOUND, res, null, 'Not Found', 'Not Found');
    }
    //Iniciamos una transaccion
    const t = await sequelize.transaction();
    try {
        //Eliminamos todos los mensajes asociados al chat
        let cantidadMensajes = await Message.destroy({
            where: {
                id_chat: idChat
            },
            transaction: t
        });
        //Eliminamos el chat
        await chat.destroy({ transaction: t });
        // Hacemos commit
        await t.commit();
        return responseAPI(HttpStatus.OK, res, null, 'Chat eliminado con exito, con ' + cantidadMensajes + ' mensajes eliminados');
    }
    catch (error) {
        // Hacemos rollback
        await t.rollback();
        return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, 'Error al eliminar chat', error.message);
    }
};