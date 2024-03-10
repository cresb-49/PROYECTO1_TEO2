import { Request, Response } from 'express';
import { responseAPI } from '../handler/responseAPI';
import { HttpStatus } from '../enums/httpStatus';
import { Transaccion } from '../models/transaccion';
import { Cuenta } from '../models/cuenta';
import { Usuario } from '../models/usuario';

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
    const { tokenPayload } = req;
    let id_usuario = tokenPayload.usuarioId;
    Transaccion.findAll({ where: { id_usuario: id_usuario } })
        .then((transacciones: any) => {
            return responseAPI(HttpStatus.OK, res, transacciones, 'Transacciones encontradas con exito');
        })
        .catch((error: any) => {
            return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, 'Error al buscar transacciones', error.message);
        });
};

export const buyCreditos = async (req: Request, res: Response) => {
    const { cantidad } = req.body;
    if (!cantidad) {
        return responseAPI(HttpStatus.BAD_REQUEST, res, null, 'Cantidad de creditos no enviada', 'Cantidad de creditos no enviada');
    }
    if (cantidad <= 0) {
        return responseAPI(HttpStatus.BAD_REQUEST, res, null, 'La cantidad de creditos debe ser mayor a 0', 'La cantidad de creditos debe ser mayor a 0');
    }
    const { tokenPayload } = req;
    let id_usuario = tokenPayload.usuarioId;
    try {
        const usuario: any = await Usuario.findOne({ where: { id: id_usuario }, include: Cuenta });
        const cuenta_usuario = usuario.cuentum;
        if (cuenta_usuario) {
            let saldo_retirable = cuenta_usuario.saldo_retirable;
            saldo_retirable += cantidad;
            cuenta_usuario.update({
                saldo_retirable: saldo_retirable
            });
            //Registramos la transaccion del usuario
            const payload_transaccion = {
                "id_cuenta_origen": null,
                "id_cuenta_destino": cuenta_usuario.id,
                "valor": cantidad,
                "descripcion": "Compra de creditos"
            };
            let transaccion = await Transaccion.create(payload_transaccion);
            if (transaccion) {
                return responseAPI(HttpStatus.OK, res, null, 'Creditos comprados con exito');
            } else {
                return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, 'Error al comprar creditos');
            }
        } else {
            return responseAPI(HttpStatus.NOT_FOUND, res, null, 'Cuenta no encontrada');
        }
    } catch (error) {
        return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, 'Error al comprar creditos', error.message);
    }

};

export const retirarCreditos = async (req: Request, res: Response) => {
    const { cantidad } = req.body;
    if (!cantidad) {
        return responseAPI(HttpStatus.BAD_REQUEST, res, null, 'Cantidad de creditos no enviada', 'Cantidad de creditos no enviada');
    }
    if (cantidad <= 0) {
        return responseAPI(HttpStatus.BAD_REQUEST, res, null, 'La cantidad de creditos debe ser mayor a 0', 'La cantidad de creditos debe ser mayor a 0');
    }
    const { tokenPayload } = req;
    let id_usuario = tokenPayload.usuarioId;
    try {
        const usuario: any = await Usuario.findOne({ where: { id: id_usuario }, include: Cuenta });
        const cuenta_usuario = usuario.cuentum;
        if (cuenta_usuario) {
            let saldo_retirable = cuenta_usuario.saldo_retirable;
            if (saldo_retirable > cantidad) {
                saldo_retirable -= cantidad;
                cuenta_usuario.update({
                    saldo_retirable: saldo_retirable
                });
                //Registramos la transaccion del usuario
                const payload_transaccion = {
                    "id_cuenta_origen": cuenta_usuario.id,
                    "id_cuenta_destino": null,
                    "valor": cantidad,
                    "descripcion": "Retiro de creditos"
                };
                let transaccion = await Transaccion.create(payload_transaccion);
                if (transaccion) {
                    return responseAPI(HttpStatus.OK, res, null, 'Creditos retirados con exito');
                } else {
                    return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, 'Error al retirar creditos');
                }
            } else {
                return responseAPI(HttpStatus.BAD_REQUEST, res, null, 'No tienes suficientes creditos');
            }
        } else {
            return responseAPI(HttpStatus.NOT_FOUND, res, null, 'Cuenta no encontrada');
        }
    } catch (error) {
        return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, 'Error al retirar creditos', error.message);
    }
};