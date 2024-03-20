import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { responseAPI } from '../handler/responseAPI';
import { HttpStatus } from '../enums/httpStatus';
import { TipoPublicacion } from '../models/tipo_publicacion';
import { generatePagesToShow } from '../handler/generatePagesToShow';
import { Chat } from '../models/chat';
import { Message } from '../models/message';
import { TokenPayload } from '../middleware/authMiddleware';
//Tanto el Router como el controller tambien manejan la logica de los mensajes de los chats

export const getChatsUsuario = async (req: Request, res: Response) => {
    //Obtenemos el id del usuario del token
    const tokenPayload: TokenPayload = req.tokenPayload;
    const id_usuario = tokenPayload.usuarioId;
    //Obtenemos los chats del usuario tanto si esta en la columna id_usuario1 o id_usuario2
    //Hacemos un group by para que no se repitan los chats
    Chat.findAll({
        where: {
            [Op.or]: [
                { id_usuario1: id_usuario },
                { id_usuario2: id_usuario }
            ]
        },
        group: ['id_usuario1', 'id_usuario2']
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
    const id_usuario1 = tokenPayload.usuarioId;
    //Obtenemos el id del usuario2
    const { id_usuario2 } = req.body;
    //Creamos el chat si no existe ya la conversacion entre los dos usuarios
    Chat.findOrCreate({
        where: {
            [Op.or]: [
                { id_usuario1, id_usuario2 },
                { id_usuario1: id_usuario2, id_usuario2: id_usuario1 }
            ]
        }
    })
        .then((chat: any) => {
            return responseAPI(HttpStatus.CREATED, res, chat, 'Chat creado con exito');
        })
        .catch((error: any) => {
            return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, 'Error al crear chat', error.message);
        });
};

export const getMensajesChat = async (req: Request, res: Response) => {
    //Obtenemos el id del usuario del token
    const tokenPayload: TokenPayload = req.tokenPayload;
    const id_usuario = tokenPayload.usuarioId;
    //Obtenemos el id del chat
    const { id_chat } = req.body;
    //Verificamos que el usuario pertenezca al chat tanto en el id_usuario1 o id_usuario2
    const chat: any = await Chat.findByPk(id_chat);
    if (!(chat.id_usuario1 === id_usuario || chat.id_usuario2 === id_usuario)) {
        return responseAPI(HttpStatus.NOT_FOUND, res, null, 'Not Found', 'Not Found');
    }
    //Obtenemos los mensajes del chat
    Message.findAll({
        where: {
            id_chat
        }
    })
        .then((mensajes: any) => {
            return responseAPI(HttpStatus.OK, res, mensajes, 'Mensajes encontrados con exito');
        })
        .catch((error: any) => {
            return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, 'Error al obtener mensajes', error.message);
        });
};

export const eliminarChat = async (req: Request, res: Response) => {
    //Obtenemos el id del usuario del token
    const tokenPayload: TokenPayload = req.tokenPayload;
    const id_usuario = tokenPayload.usuarioId;
    //Obtenemos el id del chat
    const { id_chat } = req.body;
    //Verificamos que el usuario pertenezca al chat tanto en el id_usuario1 o id_usuario2
    const chat: any = await Chat.findByPk(id_chat);
    if (!(chat.id_usuario1 === id_usuario || chat.id_usuario2 === id_usuario)) {
        return responseAPI(HttpStatus.NOT_FOUND, res, null, 'Not Found', 'Not Found');
    }
    //Eliminamos el chat
    chat.destroy()
        .then((chat: any) => {
            return responseAPI(HttpStatus.OK, res, chat, 'Chat eliminado con exito');
        })
        .catch((error: any) => {
            return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, 'Error al eliminar chat', error.message);
        });
};