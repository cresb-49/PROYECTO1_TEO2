import { Request, Response } from 'express';
import { responseAPI } from '../handler/responseAPI';
import { HttpStatus } from '../enums/httpStatus';
import { Articulo } from '../models/articulo';

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
    Articulo.create(payload)
        .then((value: any) => {
            return responseAPI(HttpStatus.OK, res, value, "Producto Creado");
        })
        .catch((reason: any) => {
            return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, reason.message, reason.message);
        })


};

export const updateArticulo = async (req: Request, res: Response) => {

};