import { Request, Response } from 'express';
import { responseAPI } from '../handler/responseAPI';
import { HttpStatus } from '../enums/httpStatus';
import { Like } from '../models/like';

export const getLikes = async (req: Request, res: Response) => {
    Like.findAll()
        .then((likes: any) => {
            return responseAPI(HttpStatus.OK, res, likes, 'Likes encontrados con exito');
        })
        .catch((error: any) => {
            return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, 'Error al buscar likes', error.message);
        });
};

export const createLike = async (req: Request, res: Response) => {
    const { id_publicacion } = req.body;
    const { tokenPayload } = req;
    const id_usuario = tokenPayload.usuarioId;
    Like.create({ id_usuario, id_publicacion })
        .then((like: any) => {
            return responseAPI(HttpStatus.CREATED, res, like, 'Like creado con exito');
        })
        .catch((error: any) => {
            return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, 'Error al crear like', error.message);
        });
};

export const deleteLike = async (req: Request, res: Response) => {
    const { idLike } = req.params;
    const { tokenPayload } = req;
    const id_usuario = tokenPayload.usuarioId;
    Like.destroy({ where: { id: idLike, id_usuario: id_usuario } })
        .then((like: any) => {
            return responseAPI(HttpStatus.OK, res, like, 'Like eliminado con exito');
        })
        .catch((error: any) => {
            return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, 'Error al eliminar like', error.message);
        });
};