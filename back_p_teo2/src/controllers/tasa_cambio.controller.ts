import { Request, Response } from 'express';
import { responseAPI } from '../handler/responseAPI';
import { HttpStatus } from '../enums/httpStatus';
import { TasaCambio } from '../models/tasa_cambio';


export const getTasa = async (req: Request, res: Response) => {
    //Obtenemos el id 1 de la tasa de cambio
    const tasa = await TasaCambio.findByPk(1);
    if (!tasa) {
        return responseAPI(HttpStatus.NOT_FOUND, res, null, 'Tasa de cambio no encontrada');
    }
    return responseAPI(HttpStatus.OK, res, tasa, 'Tasa de cambio obtenida correctamente');
};

export const updateTasa = async (req: Request, res: Response) => {
    let { valor_compra, valor_venta } = req.body;

    valor_compra = parseFloat(valor_compra);
    valor_venta = parseFloat(valor_venta);

    console.log(valor_compra, valor_venta);

    //Validamos que sean valor numericos y mayores a 0
    if (isNaN(valor_compra) || valor_compra <= 0) {
        return responseAPI(HttpStatus.BAD_REQUEST, res, null, 'El valor de compra debe ser un número mayor a 0', 'El valor de compra debe ser un número mayor a 0');
    }
    if (isNaN(valor_venta) || valor_venta <= 0) {
        return responseAPI(HttpStatus.BAD_REQUEST, res, null, 'El valor de venta debe ser un número mayor a 0', 'El valor de venta debe ser un número mayor a 0');
    }

    TasaCambio.update(
        {
            valor_compra,
            valor_venta
        },
        {
            where: {
                id: 1
            }
        })
        .then(() => {
            return responseAPI(HttpStatus.OK, res, null, 'Tasa de cambio actualizada correctamente');
        })
        .catch((err) => {
            return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, 'Error al actualizar la tasa de cambio', err);
        });
};