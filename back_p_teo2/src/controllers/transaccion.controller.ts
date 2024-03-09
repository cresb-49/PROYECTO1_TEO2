import { Request, Response } from 'express';
import { responseAPI } from '../handler/responseAPI';
import { HttpStatus } from '../enums/httpStatus';
import { Transaccion } from '../models/transaccion';

export const getTransacciones = async (req: Request, res: Response) => {
    Transaccion.findAll()
        .then((transacciones: any) => {
            return responseAPI(HttpStatus.OK, res, transacciones, 'Transacciones encontradas con exito');
        })
        .catch((error: any) => {
            return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, 'Error al buscar transacciones', error.message);
        });
};

export const getTransaccionesUsuario = async (req: Request, res: Response) => {
    const { idUsuario } = req.params;
    Transaccion.findAll({ where: { id_usuario: idUsuario } })
        .then((transacciones: any) => {
            return responseAPI(HttpStatus.OK, res, transacciones, 'Transacciones encontradas con exito');
        })
        .catch((error: any) => {
            return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, 'Error al buscar transacciones', error.message);
        });
};