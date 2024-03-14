import { Request, Response } from 'express';
import { responseAPI } from '../handler/responseAPI';
import { HttpStatus } from '../enums/httpStatus';
import { Like } from '../models/like';

export const getLikesPublicacion = async (req: Request, res: Response) => {
    const { idPublicacion } = req.params;
    try {
        let likes = await Like.count({
            where: { id_publicacion: idPublicacion, tipo: true }
        });
        let dislikes = await Like.count({
            where: { id_publicacion: idPublicacion, tipo: false }
        });
        const payload = {
            likes: likes,
            dislikes: dislikes
        }
        return responseAPI(HttpStatus.CREATED, res, payload, 'Likes recuperados con exito');
    } catch (error) {
        return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, 'Error al obtener likes', error.message);
    }
};

export const createLike = async (req: Request, res: Response) => {
    const { id_publicacion, state } = req.body;
    const { tokenPayload } = req;
    const id_usuario = tokenPayload.usuarioId;
    Like.create({ id_usuario: id_usuario, id_publicacion: id_publicacion, tipo: state })
        .then((like: any) => {
            return responseAPI(HttpStatus.CREATED, res, like, 'Like creado con exito');
        })
        .catch((error: any) => {
            return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, 'Error al crear like', error.message);
        });
};

export const deleteLike = async (req: Request, res: Response) => {
    const { idPublicacion } = req.params;
    const { tokenPayload } = req;
    const id_usuario = tokenPayload.usuarioId;
    Like.destroy({ where: { id_publicacion: idPublicacion, id_usuario: id_usuario } })
        .then((like: any) => {
            return responseAPI(HttpStatus.OK, res, like, 'Like eliminado con exito');
        })
        .catch((error: any) => {
            return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, 'Error al eliminar like', error.message);
        });
};

export const updateLike = async (req: Request, res: Response) => {
    const { id_publicacion, state } = req.body;
    const { tokenPayload } = req;
    const id_usuario = tokenPayload.usuarioId;
    Like.update({ tipo: state }, { where: { id_publicacion: id_publicacion, id_usuario: id_usuario } })
        .then((like: any) => {
            return responseAPI(HttpStatus.OK, res, like, 'Like actualizado con exito');
        })
        .catch((error: any) => {
            return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, 'Error al actualizar like', error.message);
        });
}

export const getLikePublicacion = async (req: Request, res: Response) => {
    const { idPublicacion } = req.params;
    const { tokenPayload } = req;
    const id_usuario = tokenPayload.usuarioId;
    Like.findOne({ where: { id_publicacion: idPublicacion, id_usuario: id_usuario } })
        .then((like: any) => {
            return responseAPI(HttpStatus.OK, res, like.tipo, 'Like encontrado con exito');
        })
        .catch((error: any) => {
            return responseAPI(HttpStatus.OK, res, null, 'No se encontro like');
        });
};