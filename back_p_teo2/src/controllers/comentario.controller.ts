import { Request, Response } from 'express';
import { responseAPI } from '../handler/responseAPI';
import { HttpStatus } from '../enums/httpStatus';
import { Comentario } from '../models/comentario';

export const getComentarrios = async (req: Request, res: Response) => {
    Comentario.findAll()
        .then((comentarios: any) => {
            return responseAPI(HttpStatus.OK, res, comentarios, 'Comentarios encontrados con exito');
        })
        .catch((error: any) => {
            return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, 'Error al buscar comentarios', error.message);
        });
};

export const getComentariosPublicacion = async (req: Request, res: Response) => {
    const { idPublicacion } = req.params;
    Comentario.findAll({ where: { id_publicacion: idPublicacion } })
        .then((comentarios: any) => {
            return responseAPI(HttpStatus.OK, res, comentarios, 'Comentarios encontrados con exito');
        })
        .catch((error: any) => {
            return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, 'Error al buscar comentarios', error.message);
        });
};

export const createComentario = async (req: Request, res: Response) => {
    const { texto, id_publicacion } = req.body;
    const { tokenPayload } = req;
    const id_usuario = tokenPayload.usuarioId;
    Comentario.create({ texto, id_usuario, id_publicacion })
        .then((comentario: any) => {
            return responseAPI(HttpStatus.CREATED, res, comentario, 'Comentario creado con exito');
        })
        .catch((error: any) => {
            return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, 'Error al crear comentario', error.message);
        });
};

export const deleteComentario = async (req: Request, res: Response) => {
    const { idComentario } = req.params;
    const { tokenPayload } = req;
    const id_usuario = tokenPayload.usuarioId;
    Comentario.destroy({ where: { id: idComentario, id_usuario: id_usuario } })
        .then((comentario: any) => {
            return responseAPI(HttpStatus.OK, res, comentario, 'Comentario eliminado con exito');
        })
        .catch((error: any) => {
            return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, 'Error al eliminar comentario', error.message);
        });
};