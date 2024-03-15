import { Request, Response } from 'express';
import { responseAPI } from '../handler/responseAPI';
import { HttpStatus } from '../enums/httpStatus';
import { Articulo } from '../models/articulo';
import { Publicacion } from '../models/publicacion';
import { Image } from '../models/image';
import { saveImage } from '../middleware/image.midelware';

export const getArticulosUsuario = async (req: Request, res: Response) => {
    const { tokenPayload } = req;
    const idUsuario = tokenPayload.usuarioId;
    Articulo.findAll({ where: { id_usuario: idUsuario } })
        .then((value: any) => {
            return responseAPI(HttpStatus.OK, res, value, "Productos encontrados con exito");
        })
        .catch((reason: any) => {
            return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, reason.message, reason.message);
        })
};

export const getArticulosUsuarioSinPublicar = async (req: Request, res: Response) => {
    const { tokenPayload } = req;
    const idUsuario = tokenPayload.usuarioId;
    Articulo.findAll({
        include: [{
            model: Publicacion,
            required: false, // LEFT JOIN
        }],
        where: { id_usuario: idUsuario, '$publicacion.id$': null }
    })
        .then(result => {
            return responseAPI(HttpStatus.OK, res, result, "Productos encontrados con exito");
        })
        .catch(error => {
            console.error('Error al realizar la consulta:', error);
        });
};

export const getArticulosPublicados = async (req: Request, res: Response) => {
    const { tokenPayload } = req;
    const idUsuario = tokenPayload.usuarioId;
    Articulo.findAll({
        include: [{
            model: Publicacion,
            required: true, // INNER JOIN
        }],
        where: { id_usuario: idUsuario }
    })
        .then(result => {
            return responseAPI(HttpStatus.OK, res, result, "Productos encontrados con exito");
        })
        .catch(error => {
            console.error('Error al realizar la consulta:', error);
        });
};


export const getArticulo = async (req: Request, res: Response) => {

};

export const createArticulo = async (req: Request, res: Response) => {

    const { nombre, precio, cantidad, id_categoria, descripcion, imagen } = req.body;
    const { tokenPayload } = req;
    const idUsuario = tokenPayload.usuarioId;
    let payload = {
        nombre: nombre,
        valor: precio,
        descripcion: descripcion,
        id_categoria: id_categoria,
        id_usuario: idUsuario,
        cantidad: cantidad
    }
    //Validamos el precio y la cantidad positiva
    if (precio <= 0) {
        return responseAPI(HttpStatus.BAD_REQUEST, res, null, "El precio no puede ser negativo o cero", "El precio no puede ser negativo o cero");
    }
    if (cantidad <= 0) {
        return responseAPI(HttpStatus.BAD_REQUEST, res, null, "La cantidad no puede ser negativa o cero", "La cantidad no puede ser negativa o cero");
    }

    saveImage(imagen).then((path_image: any) => {
        Articulo.create(payload)
            .then(async (articulo: any) => {
                Image.create({
                    id_articulo: articulo.id,
                    url: path_image,
                    prioridad: 1
                })
                    .then((image: any) => {
                        return responseAPI(HttpStatus.OK, res, articulo, "Producto Creado");
                    })
                    .catch(async (reason: any) => {
                        //eliminamos el articulo creado
                        await Articulo.destroy({ where: { id: articulo.id } });
                        return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, reason.message, reason.message);
                    });
            })
            .catch((reason: any) => {
                return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, reason.message, reason.message);
            })
    }).catch((reason: any) => {
        return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, reason.message, reason.message);
    });
};

export const updateArticulo = async (req: Request, res: Response) => {
    const { nombre, precio, cantidad, id_categoria, descripcion, imagen } = req.body;
    const { idArticulo } = req.params;
    const { tokenPayload } = req;
    const idUsuario = tokenPayload.usuarioId;
    let payload = {
        nombre: nombre,
        valor: precio,
        descripcion: descripcion,
        id_categoria: id_categoria,
        id_usuario: idUsuario,
        cantidad: cantidad
    }
    //Validamos el precio y la cantidad positiva
    if (precio <= 0) {
        return responseAPI(HttpStatus.BAD_REQUEST, res, null, "El precio no puede ser negativo o cero", "El precio no puede ser negativo o cero");
    }
    if (cantidad <= 0) {
        return responseAPI(HttpStatus.BAD_REQUEST, res, null, "La cantidad no puede ser negativa o cero", "La cantidad no puede ser negativa o cero");
    }
    //Buscamos el articulo si existe mediante el id y el id del usuario
    Articulo.findOne({ where: { id: idArticulo, id_usuario: idUsuario } })
        .then((articulo: any) => {
            if (articulo) {
                Articulo.update(payload, { where: { id: idArticulo } })
                    .then((value: any) => {
                        return responseAPI(HttpStatus.OK, res, value, "Producto Actualizado");
                    })
                    .catch((reason: any) => {
                        return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, reason.message, reason.message);
                    })
            } else {
                return responseAPI(HttpStatus.NOT_FOUND, res, null, "Producto no encontrado", "Producto no encontrado");
            }
        })
        .catch((reason: any) => {
            return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, reason.message, reason.message);
        })
};