import { Request, Response } from 'express';
import { responseAPI } from '../handler/responseAPI';
import { HttpStatus } from '../enums/httpStatus';
import { Transaccion } from '../models/transaccion';
import { Acount } from '../models/acount';
import { Usuario } from '../models/usuario';
import { Op, Transaction } from 'sequelize';
import sequelize from '../database/database';
import { TasaCambio } from '../models/tasa_cambio';
import { Category } from '../models/category';

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
        return responseAPI(HttpStatus.BAD_REQUEST, res, null, 'Cantidad de Quetzales no enviada', 'Cantidad de Quetzales no enviada');
    }
    cantidad = parseFloat(cantidad);
    if (cantidad <= 0) {
        return responseAPI(HttpStatus.BAD_REQUEST, res, null, 'La cantidad de Quetzales debe ser mayor a 0', 'La cantidad de Quetzales debe ser mayor a 0');
    }
    const { tokenPayload } = req;
    let id_usuario = tokenPayload.usuarioId;
    try {
        //Obtenemos la tasa de cambio
        const tasa_cambio: any = await TasaCambio.findByPk(1);
        if (!tasa_cambio) {
            throw new Error("Tasa de cambio no encontrada");
        }
        const usuario: any = await Usuario.findOne({ where: { id: id_usuario }, include: Acount });
        const cuenta_usuario = usuario.acount;
        if (cuenta_usuario) {
            let saldo_retirable = parseFloat(cuenta_usuario.saldo_retirable);
            saldo_retirable += cantidad * parseFloat(tasa_cambio.valor_compra);
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
                "descripcion": `Se adquirieron ${cantidad} creditos por un monto de Q. ${cantidad}`
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
        //Obtenemos la tasa de cambio
        const tasa_cambio: any = await TasaCambio.findByPk(1);
        if (!tasa_cambio) {
            throw new Error("Tasa de cambio no encontrada");
        }
        const usuario: any = await Usuario.findOne({ where: { id: id_usuario }, include: Acount });
        const cuenta_usuario = usuario.acount;
        if (cuenta_usuario) {
            let saldo_retirable = parseFloat(cuenta_usuario.saldo_retirable);
            let cantidad_quetzales = cantidad / parseFloat(tasa_cambio.valor_venta);
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
                    "descripcion": `Retiro de creditos equivalente un monto de Q${cantidad_quetzales}`
                };
                let transaccion = await Transaccion.create(payload_transaccion);
                if (transaccion) {
                    return responseAPI(HttpStatus.OK, res, null, `Creditos retirados con exito, equivalente a Q${cantidad_quetzales}`);
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

/**
 * Genera la transaccion entre dos cuentas
 * @param cantidad 
 * @param tipo 1 = Retirable, 2 = No Retirable
 * @param id_cuenta_origen 
 * @param id_cuenta_destino 
 * @param comentario 
 * @returns Transaccion
 */
export const generarTransaccion = async (cantidad: number, tipo: number, id_cuenta_origen: number, id_cuenta_destino: number, comentario: string) => {
    const t = await sequelize.transaction();
    try {
        const transaccion = await generarTransaccion2(cantidad, tipo, id_cuenta_origen, id_cuenta_destino, comentario, t);
        await t.commit();
        return transaccion;
    } catch (error) {
        await t.rollback();
        throw error
    }
};

/**
 * Genera la transaccion entre dos cuentas
 * @param cantidad 
 * @param tipo 1 = Retirable, 2 = No Retirable
 * @param id_cuenta_origen 
 * @param id_cuenta_destino 
 * @param comentario 
 * @param t
 * @returns Transaccion
 */
export const generarTransaccion2 = async (cantidad: number, tipo: number, id_cuenta_origen: number, id_cuenta_destino: number, comentario: string, t: Transaction) => {
    try {
        const cuenta_origen: any = await Acount.findByPk(id_cuenta_origen);
        const cuenta_destino: any = await Acount.findByPk(id_cuenta_destino);
        if (!cuenta_origen) {
            throw new Error("Cuenta origen no encontrada");
        }
        if (!cuenta_destino) {
            throw new Error("Cuenta destino no encontrada");
        }
        //Tipo 1: Transaccion de saldo retirable
        if (tipo === 1) {
            //Validamos que la cantidad sea menor a la cantidad de saldo retirable
            if (cantidad > cuenta_origen.saldo_retirable) {
                throw new Error("No tienes suficientes Creditos Retirables");
            }
            let nuevo_saldo_retirable = cuenta_origen.saldo_retirable -= cantidad;
            await Acount.update({
                saldo_retirable: nuevo_saldo_retirable
            }, {
                where: {
                    id: cuenta_origen.id
                },
                transaction: t
            });
            //Registramos la transaccion del usuario
            const payload_transaccion = {
                "id_cuenta_origen": cuenta_origen.id,
                "id_cuenta_destino": cuenta_destino.id,
                "valor": cantidad,
                "descripcion": comentario
            };
            let transaccion = await Transaccion.create(payload_transaccion, { transaction: t });
            return transaccion;
        }
        //Tipo 2: Transaccion de saldo no retirable 
        else if (tipo === 2) {
            //Validamos que la cantidad sea menor a la cantidad de saldo no retirable
            if (cantidad > cuenta_origen.saldo_no_retirable) {
                throw new Error("No tienes suficientes Creditos No Retirables");
            }
            let nuevo_saldo_no_retirable = cuenta_origen.saldo_no_retirable -= cantidad;
            await Acount.update({
                saldo_no_retirable: nuevo_saldo_no_retirable
            }, {
                where: {
                    id: cuenta_origen.id
                },
                transaction: t
            });
            //Registramos la transaccion del usuario
            const payload_transaccion = {
                "id_cuenta_origen": cuenta_origen.id,
                "id_cuenta_destino": cuenta_destino.id,
                "valor": cantidad,
                "descripcion": comentario
            };
            let transaccion = await Transaccion.create(payload_transaccion, { transaction: t });
            return transaccion;
        }
        //Otro caso: Se lanza un error 
        else {
            throw new Error("Tipo de transaccion no valido");
        }
    } catch (error) {
        throw new Error("Error al efectuar la transaccion: " + error.message);
    }
};

export const generarTransaccionArticulo = async (id_usuario: number, tipo: number, cantidad: number, nombre_articulo: string, t: Transaction) => {
    if (t === null) {
        t = await sequelize.transaction();
    }
    if (tipo === 1) {
        //Transaccion de saldo retirable
        const usuario: any = await Usuario.findOne({ where: { id: id_usuario }, include: Acount });
        const cuenta_usuario = usuario.acount;
        if (cuenta_usuario) {
            let saldo_retirable = parseFloat(cuenta_usuario.saldo_retirable);
            console.log('saldo_retirable: ', saldo_retirable);
            if (saldo_retirable > cantidad) {
                saldo_retirable -= cantidad;
                await Acount.update({
                    saldo_retirable: saldo_retirable
                }, {
                    where: {
                        id: cuenta_usuario.id
                    },
                    transaction: t
                });
                const payload_transaccion = {
                    "id_cuenta_origen": cuenta_usuario.id,
                    "id_cuenta_destino": null,
                    "valor": cantidad,
                    "descripcion": `Uso de creditos retirables en la publicacion del articulo "${nombre_articulo}"`
                };
                let transaccion = await Transaccion.create(payload_transaccion, { transaction: t });
                return transaccion;
            } else {
                throw new Error("No tienes suficientes creditos retirables");
            }
        } else {
            throw new Error("Cuenta no encontrada");
        }
    } else if (tipo === 2) {
        //Transaccion de saldo no retirable
        const usuario: any = await Usuario.findOne({ where: { id: id_usuario }, include: Acount });
        const cuenta_usuario = usuario.acount;
        if (cuenta_usuario) {
            let saldo_no_retirable = parseFloat(cuenta_usuario.saldo_no_retirable);
            if (saldo_no_retirable > cantidad) {
                saldo_no_retirable -= cantidad;
                await Acount.update({
                    saldo_no_retirable: saldo_no_retirable
                }, {
                    where: {
                        id: cuenta_usuario.id
                    },
                    transaction: t
                });
                const payload_transaccion = {
                    "id_cuenta_origen": cuenta_usuario.id,
                    "id_cuenta_destino": null,
                    "valor": cantidad,
                    "descripcion": `Uso de creditos no retirables en la publicacion del articulo "${nombre_articulo}"`
                };
                let transaccion = await Transaccion.create(payload_transaccion, { transaction: t });
                return transaccion;
            } else {
                throw new Error("No tienes suficientes creditos no retirables");
            }
        } else {
            throw new Error("Cuenta no encontrada");
        }
    } else {
        throw new Error("Tipo de transaccion no valido");
    }
};

export const descontarCreditos = async (id_cuenta_origen: number | string, tipo: number, cantidad: number, comentario: string, t: Transaction) => {
    try {
        const cuenta_origen: any = await Acount.findByPk(id_cuenta_origen);

        if (!cuenta_origen) {
            throw new Error("Cuenta origen no encontrada");
        }

        //Tipo 1: Transaccion de saldo retirable
        if (tipo === 1) {
            //Validamos que la cantidad sea menor a la cantidad de saldo retirable
            if (cantidad > cuenta_origen.saldo_retirable) {
                throw new Error("No tienes suficientes Creditos Retirables");
            }
            let nuevo_saldo_retirable = cuenta_origen.saldo_retirable -= cantidad;
            await Acount.update({
                saldo_retirable: nuevo_saldo_retirable
            }, {
                where: {
                    id: cuenta_origen.id
                },
                transaction: t
            });
            //Registramos la transaccion del usuario
            const payload_transaccion = {
                "id_cuenta_origen": cuenta_origen.id,
                "id_cuenta_destino": null,
                "valor": cantidad,
                "descripcion": comentario
            };
            let transaccion = await Transaccion.create(payload_transaccion, { transaction: t });
            return transaccion;
        }
        //Tipo 2: Transaccion de saldo no retirable 
        else if (tipo === 2) {
            //Validamos que la cantidad sea menor a la cantidad de saldo no retirable
            if (cantidad > cuenta_origen.saldo_no_retirable) {
                throw new Error("No tienes suficientes Creditos No Retirables");
            }
            let nuevo_saldo_no_retirable = cuenta_origen.saldo_no_retirable -= cantidad;
            await Acount.update({
                saldo_no_retirable: nuevo_saldo_no_retirable
            }, {
                where: {
                    id: cuenta_origen.id
                },
                transaction: t
            });
            //Registramos la transaccion del usuario
            const payload_transaccion = {
                "id_cuenta_origen": cuenta_origen.id,
                "id_cuenta_destino": null,
                "valor": cantidad,
                "descripcion": comentario
            };
            let transaccion = await Transaccion.create(payload_transaccion, { transaction: t });
            return transaccion;
        }
        //Otro caso: Se lanza un error 
        else {
            throw new Error("Tipo de transaccion no valido");
        }
    } catch (error) {
        throw new Error("Error al efectuar la transaccion: " + error.message);
    }
}

export const gananciaCompraCategoria = async (id_usuario: number, id_categoria: number, cantidad: number, t: Transaction) => {
    //Obtenemos la cuenta del usuario
    const usuario: any = await Usuario.findOne({ where: { id: id_usuario }, include: { model: Acount, required: true } });
    //CUenta del usuario
    const cuenta_usuario: any = usuario.acount;
    //Obtenemos la categoria
    const categoria: any = await Category.findByPk(id_categoria);
    //Obtenemos el valor del porcentaje de ganancia
    const porcentaje_ganancia = parseFloat(categoria.porcentaje_ganancias);
    //Calculamos la ganancia total de la transaccion
    const ganancia = cantidad * porcentaje_ganancia / 100;
    //Sumamos la cantidad ganada al sldo no retirable del usuario
    let saldo_no_retirable = parseFloat(cuenta_usuario.saldo_no_retirable);
    saldo_no_retirable += ganancia;
    cuenta_usuario.saldo_no_retirable = saldo_no_retirable;
    await cuenta_usuario.save({ transaction: t });
    //Registramos la transaccion del usuario
    const payload_transaccion = {
        "id_cuenta_origen": null,
        "id_cuenta_destino": cuenta_usuario.id,
        "valor": ganancia,
        "descripcion": `Creditos no retirables ganados por la compra de un articulo de la categoria ${categoria.nombre}`
    };
    let transaccion = await Transaccion.create(payload_transaccion, { transaction: t });
    return transaccion;

}