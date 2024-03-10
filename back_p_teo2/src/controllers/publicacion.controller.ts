import { Request, Response } from 'express';
import { responseAPI } from '../handler/responseAPI';
import { HttpStatus } from '../enums/httpStatus';
import { TipoPublicacion } from '../models/tipo_publicacion';
import { Articulo } from '../models/articulo';
import { Publicacion } from '../models/publicacion';

export const getPublicaciones = async (req: Request, res: Response) => {

};

export const getTipoPublicacion = async (req: Request, res: Response) => {
    TipoPublicacion.findAll()
        .then((value: any[]) => {
            return responseAPI(HttpStatus.OK, res, value, "Tipos de publicaciones encontrados con exito");
        })
        .catch((reason: any) => {
            return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, reason.message, reason.message);
        })
};

export const getPublicacionesUsuario = async (req: Request, res: Response) => {

};

export const createPublicacion = async (req: Request, res: Response) => {
    const { tokenPayload } = req;
    const idUsuario = tokenPayload.usuarioId;
    //Obtener el id del articulo
    const { id_articulo } = req.body;
    //Obtenemos el articulo
    let articulo: any = await Articulo.findByPk(id_articulo);
    // Verificamos que el producto exista y pertenezca al usuario
    if (articulo === null) {
        return responseAPI(HttpStatus.NOT_FOUND, res, null, "Articulo no encontrado", "El articulo no existe");
    }
    console.log(articulo.id_usuario, idUsuario);
    if (parseInt(articulo.id_usuario) !== parseInt(idUsuario)) {
        return responseAPI(HttpStatus.FORBIDDEN, res, null, "No tienes permiso para realizar esta accion", "El articulo no pertenece al usuario");
    }
    //Creamos la publicacion con el articulo
    const payload = {
        id_articulo: id_articulo,
        id_tipo_publicacion: 1,
        id_usuario: idUsuario,
        isValidate: true,
        f_validacion: new Date()
    }
    //Guardamos la publicacion
    Publicacion.create(payload)
        .then((value: any) => {
            return responseAPI(HttpStatus.CREATED, res, value, "Publicacion creada con exito");
        })
        .catch((reason: any) => {
            return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, reason.message, reason.message);
        })
};

export const updatePublicacion = async (req: Request, res: Response) => {

};