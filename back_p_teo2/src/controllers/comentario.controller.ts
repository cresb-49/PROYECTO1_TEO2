import { Request, Response } from 'express';
import { responseAPI } from '../handler/responseAPI';
import { HttpStatus } from '../enums/httpStatus';
import { Comentario } from '../models/comentario';
import { Usuario } from '../models/usuario';

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
    const page = req.query.page ? parseInt(req.query.page.toString()) : 1; // Página actual, si no se proporciona, se asume 1
    const limit = 10; // Comentarios por página
    const offset = (page - 1) * limit; // Calculo del desplazamiento
    Comentario.findAndCountAll(
        {
            where: { id_publicacion: idPublicacion },
            order: [['created_at', 'DESC']],
            limit: limit,
            offset: offset,
            include: [
                {
                    model: Usuario,
                    required: true,
                    attributes: ['id', 'nombres', 'apellidos']
                }
            ]
        })
        .then((result: any) => {
            const comentarios = result.rows;
            const totalComentarios = result.count;
            const totalPages = Math.ceil(totalComentarios / limit); // Total de páginas
            const payload = {
                data: comentarios,
                totalPages: totalPages,
                currentPage: page,
                previousPage: page > 1 ? page - 1 : null,
                nextPage: page < totalPages ? page + 1 : null
            }
            return responseAPI(HttpStatus.OK, res, payload, 'Comentarios encontrados con éxito');
        })
        .catch((error: any) => {
            return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, 'Error al buscar comentarios', error.message);
        });
};

export const createComentario = async (req: Request, res: Response) => {
    const { texto, id_publicacion } = req.body;
    const { tokenPayload } = req;
    const id_usuario = tokenPayload.usuarioId;
    const payload = {
        'texto': texto,
        'id_publicacion': id_publicacion,
        'id_usuario': id_usuario
    }
    Comentario.create(payload)
        .then(async (comentario: any) => {
            let usuario = await Usuario.findByPk(id_usuario, { attributes: ['id', 'nombres', 'apellidos'] });
            comentario.dataValues.usuario = usuario;
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