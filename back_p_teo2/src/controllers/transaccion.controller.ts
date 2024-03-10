import { Request, Response } from 'express';
import { responseAPI } from '../handler/responseAPI';
import { HttpStatus } from '../enums/httpStatus';
import { Transaccion } from '../models/transaccion';
import { Acount } from '../models/acount';
import { Usuario } from '../models/usuario';
import { Op } from 'sequelize';

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
    const usuario: any = await Usuario.findOne({ where: { id: id_usuario }, include: Acount });
    const cuenta_usuario = usuario.acount;
    if (!cuenta_usuario) {
        return responseAPI(HttpStatus.NOT_FOUND, res, null, 'Cuenta no encontrada');
    }
    Transaccion.findAll({
        where: {
            [Op.or]: [
                { id_cuenta_origen: cuenta_usuario.id },
                { id_cuenta_destino: cuenta_usuario.id }
            ]
        }
    })
        .then((transacciones: any) => {
            return responseAPI(HttpStatus.OK, res, transacciones, 'Transacciones encontradas con exito');
        })
        .catch((error: any) => {
            return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, 'Error al buscar transacciones', error.message);
        });
};

export const buyCreditos = async (req: Request, res: Response) => {
    let { cantidad } = req.body;
    if (!cantidad) {
        return responseAPI(HttpStatus.BAD_REQUEST, res, null, 'Cantidad de creditos no enviada', 'Cantidad de creditos no enviada');
    }
    cantidad = parseFloat(cantidad);
    if (cantidad <= 0) {
        return responseAPI(HttpStatus.BAD_REQUEST, res, null, 'La cantidad de creditos debe ser mayor a 0', 'La cantidad de creditos debe ser mayor a 0');
    }
    const { tokenPayload } = req;
    let id_usuario = tokenPayload.usuarioId;
    try {
        const usuario: any = await Usuario.findOne({ where: { id: id_usuario }, include: Acount });
        const cuenta_usuario = usuario.acount;
        if (cuenta_usuario) {
            let saldo_retirable = parseFloat(cuenta_usuario.saldo_retirable);
            saldo_retirable += cantidad;
            await Acount.update({
                "saldo_retirable": saldo_retirable
            }, {
                where: {
                    id: cuenta_usuario.id
                }
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
    let { cantidad } = req.body;
    if (!cantidad) {
        return responseAPI(HttpStatus.BAD_REQUEST, res, null, 'Cantidad de creditos no enviada', 'Cantidad de creditos no enviada');
    }
    cantidad = parseFloat(cantidad);
    if (cantidad <= 0) {
        return responseAPI(HttpStatus.BAD_REQUEST, res, null, 'La cantidad de creditos debe ser mayor a 0', 'La cantidad de creditos debe ser mayor a 0');
    }
    const { tokenPayload } = req;
    let id_usuario = tokenPayload.usuarioId;
    try {
        const usuario: any = await Usuario.findOne({ where: { id: id_usuario }, include: Acount });
        const cuenta_usuario = usuario.acount;
        if (cuenta_usuario) {
            let saldo_retirable = parseFloat(cuenta_usuario.saldo_retirable);
            if (saldo_retirable > cantidad) {
                saldo_retirable -= cantidad;
                await Acount.update({
                    saldo_retirable: saldo_retirable
                }, {
                    where: {
                        id: cuenta_usuario.id
                    }
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