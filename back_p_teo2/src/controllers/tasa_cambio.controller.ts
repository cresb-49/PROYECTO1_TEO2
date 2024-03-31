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
    const { valor_compra, valor_venta } = req.body;
    const tasa: any = await TasaCambio.findByPk(1);
    if (!tasa) {
        return responseAPI(HttpStatus.NOT_FOUND, res, null, 'Tasa de cambio no encontrada');
    }
    tasa.valor_compra = valor_compra;
    tasa.valor_venta = valor_venta;
    await tasa.save();
    return responseAPI(HttpStatus.OK, res, tasa, 'Tasa de cambio actualizada correctamente');
};