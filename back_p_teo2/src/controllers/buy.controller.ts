import { Request, Response } from 'express';
import { responseAPI } from '../handler/responseAPI';
import { HttpStatus } from '../enums/httpStatus';
import { Publicacion } from '../models/publicacion';
import { Articulo } from '../models/articulo';
import { Category } from '../models/category';
import { Buy } from '../models/buy';
import { Usuario } from '../models/usuario';
import { Acount } from '../models/acount';
import { generarTransaccion, generarTransaccion2 } from './transaccion.controller';
import { BuyTransaccion } from '../models/buy_transaccion';
import { resCantidadArticulo } from './articulo.controller';
import sequelize from '../database/database';
import { TokenPayload } from '../middleware/authMiddleware';
import { generatePagesToShow } from '../handler/generatePagesToShow';
import { findOrCreateChat, sendMessageOnChat } from './chat.controller';


export const createCompra = async (req: Request, res: Response) => {
    const { tokenPayload } = req;
    const { id_publicacion, creditos, articulo_cambio, cantidad } = req.body;
    const id_usuario = tokenPayload.usuarioId;
    const creditos_retirables = parseFloat(creditos.retirables);
    const creditos_no_retirables = parseFloat(creditos.no_retirables);
    const t = await sequelize.transaction();
    try {
        //Obtenemos la publicacion con su respectivo articulo
        const publicacion: any = await Publicacion.findByPk(id_publicacion, {
            include: [
                {
                    model: Articulo,
                    required: true,
                    include: [
                        {
                            model: Category,
                            required: false
                        }
                    ]
                }
            ]
        });

        if (publicacion === null) {
            return responseAPI(HttpStatus.NOT_FOUND, res, null, "Publicacion no encontrada", "La publicacion no existe");
        }

        if (cantidad < 1) {
            return responseAPI(HttpStatus.BAD_REQUEST, res, null, "Cantidad invalida del producto a comprar", "Cantidad invalida del producto a comprar");
        }
        if (cantidad >= 1) {
            if (publicacion.articulo === null) {
                return responseAPI(HttpStatus.NOT_FOUND, res, null, "Publicacion no encontrada", "La publicacion no existe");
            }
            //Verificamos que la cantidad de compra sea meno o igual a la cantidad de articulos en la publicacion
            let articulo = publicacion.articulo;
            if (cantidad > articulo.cantidad) {
                return responseAPI(HttpStatus.BAD_REQUEST, res, null, "Cantidad invalida del producto a comprar", "Cantidad invalida del producto a comprar");
            }
        }
        //Ahora sumamos la cantidad de creditos y valor de producto a comprar
        let total_creditos = 0;
        let articulo_intercambiar = null;

        if (articulo_cambio.cantidad_articulo > 0) {
            articulo_intercambiar = await Articulo.findByPk(articulo_cambio.id_articulo);
            if (articulo_intercambiar === null) {
                return responseAPI(HttpStatus.NOT_FOUND, res, null, "Articulo de intercambio no existe", "El articulo de intercambio no existe");
            }
            //Comprobamos que el articulo de intercambio tenga la cantidad necesaria
            if (articulo_cambio.cantidad_articulo > articulo_intercambiar.cantidad) {
                return responseAPI(HttpStatus.BAD_REQUEST, res, null, "Cantidad invalida del producto a intercambiar", "Cantidad invalida del producto a intercambiar");
            }
            total_creditos = total_creditos + (parseFloat(articulo_intercambiar.valor) * parseFloat(articulo_cambio.cantidad_articulo));
        }

        total_creditos = total_creditos + creditos_retirables + creditos_no_retirables;

        let articulo = publicacion.articulo;
        if (articulo === null) {
            return responseAPI(HttpStatus.NOT_FOUND, res, null, "Articulo no encontrado", "El articulo no existe");
        }
        let valor_compra = parseFloat(articulo.valor) * parseFloat(cantidad);
        if (valor_compra > total_creditos) {
            return responseAPI(HttpStatus.BAD_REQUEST, res, null, "Creditos insuficientes", "No tienes suficientes creditos para realizar esta compra");
        } else if (valor_compra < total_creditos) {
            return responseAPI(HttpStatus.BAD_REQUEST, res, null, "Creditos excedentes", "Tienes creditos excedentes para realizar esta compra");
        }

        //Validamos que la cuenta del usuario tenga los creditos que va a utilizar
        const usuario_comprador: any = await Usuario.findByPk(id_usuario, { include: [{ model: Acount, required: false }] });
        if (usuario_comprador.acount.saldo_retirable < parseFloat(creditos.retirables)) {
            return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, "No tiene los suficientes creditos retirables disponibles", "No tiene los suficientes creditos retirables disponibles");
        }
        if (usuario_comprador.acount.saldo_no_retirable < parseFloat(creditos.no_retirables)) {
            return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, "No tiene los suficientes creditos no retirables disponibles", "No tiene los suficientes creditos no retirables disponibles");
        }
        const usuario_vendedor: any = await Usuario.findByPk(publicacion.id_usuario, { include: [{ model: Acount, required: false }] });

        const payload = {
            id_usuario_compra: id_usuario,
            id_usuario_venta: publicacion.id_usuario,
            id_articulo_venta: publicacion.id_articulo,
            cantidad_articulo_venta: cantidad,
            id_articulo_cambio: articulo_intercambiar !== null ? articulo_intercambiar.id : null,
            cantidad_articulo_cambio: articulo_intercambiar !== null ? articulo_cambio.cantidad_articulo : null,
            valida: articulo_intercambiar === null ? true : false,
            valor_venta: valor_compra,
            creditos_retirables_usados: creditos_retirables ?? 0,
            creditos_no_retirables_usados: creditos_no_retirables ?? 0,
            creditos_generados: 0, //TODO: Por implementar
            validate_at: articulo_intercambiar === null ? new Date() : null
        };

        await resCantidadArticulo(publicacion.id_articulo, cantidad);
        await resCantidadArticulo(payload.id_articulo_cambio, payload.cantidad_articulo_cambio);


        const buy: any = await Buy.create(payload, { transaction: t });
        if (buy === null) {
            return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, "Error al realizar la compra", "Error al realizar la compra");
        }
        let transacciones = [];
        if (creditos_retirables > 0 && buy.valida === true) {
            let tr = await generarTransaccion(
                creditos_retirables,
                1,
                usuario_comprador.acount.id,
                usuario_vendedor.acount.id,
                `Compra "${buy.id}" de articulo con creditos retirables`
            );
            if (tr) {
                transacciones.push(tr);
            }
        }
        if (creditos_no_retirables > 0 && buy.valida === true) {
            let tr = await generarTransaccion(
                creditos_no_retirables,
                2,
                usuario_comprador.acount.id,
                usuario_vendedor.acount.id,
                `Compra "${buy.id}" de articulo con creditos no retirables`
            );
            if (tr) {
                transacciones.push(tr);
            }
        }
        //Generamos las relaciones de transacciones con la compra
        if (transacciones.length > 0) {
            await Promise.all(transacciones.map(async (transaccion) => {
                await BuyTransaccion.create({
                    id_buy: buy.id,
                    id_transaccion: transaccion.id
                }, { transaction: t });
            }));
        }
        await t.commit();
        return responseAPI(HttpStatus.CREATED, res, buy, "Compra realizada con exito");
    } catch (error) {
        await t.rollback();
        return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, "Error al realizar la compra", error.message);
    }
}

export const validarCompra = async (req: Request, res: Response) => {
    const { idCompra } = req.params;
    const { tokenPayload } = req;
    const id_usuario: number = parseInt(tokenPayload.usuarioId);
    const t = await sequelize.transaction();
    try {
        let creditos_usar_compra: number = 0;
        let costo_compra: number = 0;
        const compra: any = await Buy.findByPk(idCompra);
        if (compra === null) {
            await t.rollback();
            return responseAPI(HttpStatus.NOT_FOUND, res, null, "Compra no encontrada", "La compra no existe");
        }
        if (compra.id_usuario_venta !== id_usuario) {
            await t.rollback();
            return responseAPI(HttpStatus.FORBIDDEN, res, null, "No tienes permisos para validar esta compra", "No tienes permisos para validar esta compra");
        }
        if (compra.valida === true) {
            await t.rollback();
            return responseAPI(HttpStatus.BAD_REQUEST, res, null, "Compra ya validada", "La compra ya ha sido validada");
        }
        const articulo_venta: any = await Articulo.findByPk(compra.id_articulo_venta, { transaction: t });
        const articulo_cambio: any = await Articulo.findByPk(compra.id_articulo_cambio, { transaction: t });
        if (articulo_venta === null) {
            await t.rollback();
            return responseAPI(HttpStatus.NOT_FOUND, res, null, "Articulo no encontrado", "El articulo no existe");
        } else {
            costo_compra += parseFloat(compra.cantidad_articulo_venta) * parseFloat(articulo_venta.valor);
        }
        //Si la cantidad de articulos a intercambiar es mayor a 0, entonces se debe validar que el articulo de intercambio exista
        if (compra.cantidad_articulo_cambio > 0 && articulo_cambio === null) {
            await t.rollback();
            return responseAPI(HttpStatus.NOT_FOUND, res, null, "Articulo de intercambio no encontrado", "El articulo de intercambio no existe");
        } else {
            creditos_usar_compra += parseFloat(compra.cantidad_articulo_cambio) * parseFloat(articulo_cambio.valor);
        }
        //Obtenemos el usuario que vende y el que compra con su acount
        const usuario_comprador: any = await Usuario.findByPk(compra.id_usuario_compra, { include: [{ model: Acount, required: false }] });
        const usuario_vendedor: any = await Usuario.findByPk(compra.id_usuario_venta, { include: [{ model: Acount, required: false }] });
        //Verificamos que el usuario comprador tenga los creditos necesarios
        if (parseFloat(compra.creditos_retirables_usados) > parseFloat(usuario_comprador.acount.saldo_retirable)) {
            await t.rollback();
            return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, "No tiene los suficientes creditos retirables disponibles", "No tiene los suficientes creditos retirables disponibles");
        } else {
            creditos_usar_compra += parseFloat(compra.creditos_retirables_usados);
        }
        if (parseFloat(compra.creditos_no_retirables_usados) > parseFloat(usuario_comprador.acount.saldo_no_retirable)) {
            await t.rollback();
            return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, "No tiene los suficientes creditos no retirables disponibles", "No tiene los suficientes creditos no retirables disponibles");
        } else {
            creditos_usar_compra += parseFloat(compra.creditos_no_retirables_usados);
        }
        //Si el precio de compra es igual al regitrado en la base de datos del buy no hay problema
        if (costo_compra !== parseFloat(compra.valor_venta)) {
            await t.rollback();
            return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, "El precio del producto cambio, rechace el intercambio", "El precio del producto cambio, rechace el intercambio");
        }
        //Si los creditos usados en la compra son iguales a los registrados en la base de datos del buy no hay problema
        if (creditos_usar_compra !== parseFloat(compra.valor_venta)) {
            await t.rollback();
            return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, "Los creditos usados en la compra cambio, rechace el intercambio", "Los creditos usados en la compra cambio, rechace el intercambio");
        }
        //Realizamos las transacciones y lo guardamos en un arreglo
        let transacciones = [];
        if (parseFloat(compra.creditos_retirables_usados) > 0) {
            let tr = await generarTransaccion2(
                parseFloat(compra.creditos_retirables_usados),
                1,
                usuario_comprador.acount.id,
                usuario_vendedor.acount.id,
                `Compra "${compra.id}" de articulo con creditos retirables`,
                t
            );
            if (tr) {
                transacciones.push(tr);
            }
        }
        if (parseFloat(compra.creditos_no_retirables_usados) > 0) {
            let tr = await generarTransaccion2(
                parseFloat(compra.creditos_no_retirables_usados),
                2,
                usuario_comprador.acount.id,
                usuario_vendedor.acount.id,
                `Compra "${compra.id}" de articulo con creditos no retirables`,
                t
            );
            if (tr) {
                transacciones.push(tr);
            }
        }
        //Generamos las relaciones de transacciones con la compra
        if (transacciones.length > 0) {
            await Promise.all(transacciones.map(async (transaccion) => {
                await BuyTransaccion.create({
                    id_buy: compra.id,
                    id_transaccion: transaccion.id
                }, { transaction: t });
            }));
        }
        const payload = {
            valida: true,
            validate_at: new Date()
        };
        //Actuliaza el estado de la compra
        await compra.update(payload, { transaction: t });
        //Le enviamos un mensaje al usuario comprador que la compra fue validada
        let chat: any = await findOrCreateChat(usuario_comprador.id, usuario_vendedor.id, t);
        await sendMessageOnChat(
            usuario_vendedor.id,
            chat.id,
            `El intercambio entre el artículo "${articulo_venta.nombre}" (cantidad: ${compra.cantidad_articulo_venta}) POR el artículo "${articulo_cambio.nombre}" (cantidad: ${compra.cantidad_articulo_cambio}) se ha validado con éxito.\nUso de KORNS:\n- Retirables: KOR. ${compra.creditos_retirables_usados}\n- No Retirables: KOR. ${compra.creditos_no_retirables_usados}`,
            t
        );
        await t.commit();
        return responseAPI(HttpStatus.OK, res, compra, "Compra validada con exito");
    } catch (error) {
        await t.rollback();
        return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, "Error al validar la compra", error.message);
    }
};

export const rechazarCompra = async (req: Request, res: Response) => {
    const { idCompra } = req.params;
    const { tokenPayload } = req;
    const id_usuario: number = parseInt(tokenPayload.usuarioId);
    const t = await sequelize.transaction();
    try {
        const compra: any = await Buy.findByPk(idCompra);
        if (compra === null) {
            return responseAPI(HttpStatus.NOT_FOUND, res, null, "Compra no encontrada", "La compra no existe");
        }
        if (compra.id_usuario_venta !== id_usuario) {
            return responseAPI(HttpStatus.FORBIDDEN, res, null, "No tienes permisos para validar esta compra", "No tienes permisos para validar esta compra");
        }
        if (compra.valida === true) {
            return responseAPI(HttpStatus.BAD_REQUEST, res, null, "Compra ya validada", "La compra ya ha sido validada");
        }
        const articulo_venta: any = await Articulo.findByPk(compra.id_articulo_venta, { transaction: t });
        if (articulo_venta === null) {
            return responseAPI(HttpStatus.NOT_FOUND, res, null, "Articulo no encontrado", "El articulo no existe");
        }
        //Retoornamos la cantidad de articulos a su estado original
        let producto_venta: any = await Articulo.findByPk(compra.id_articulo_venta, { transaction: t });
        let producto_cambio: any = await Articulo.findByPk(compra.id_articulo_cambio, { transaction: t });
        if (producto_venta !== null) {
            await producto_venta.update({ cantidad: producto_venta.cantidad + compra.cantidad_articulo_venta }, { transaction: t });
        }
        if (producto_cambio !== null) {
            await producto_cambio.update({ cantidad: producto_cambio.cantidad + compra.cantidad_articulo_cambio }, { transaction: t });
        }
        //Eliminamos la compra
        await compra.destroy({ transaction: t });
        //Le enviamos un mensaje al usuario comprador que la compra fue recachazada
        let chat: any = await findOrCreateChat(compra.id_usuario_compra, compra.id_usuario_venta, t);
        await sendMessageOnChat(
            compra.id_usuario_venta,
            chat.id,
            `El intercambio entre el artículo "${articulo_venta.nombre}" POR el artículo "${producto_cambio.nombre}" se ha rechazado.`,
            t
        );
        await t.commit();
        return responseAPI(HttpStatus.OK, res, compra, "Compra rechazada con exito");
    } catch (error) {
        await t.rollback();
        return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, "Error al validar la compra", error.message);
    }
};

export const getComprasUsuario = async (req: Request, res: Response) => {
    const tokenPayload: TokenPayload = req.tokenPayload;
    const id_usuario = tokenPayload.usuarioId;
    const page = req.query.page ? parseInt(req.query.page.toString()) : 1; // Página actual, si no se proporciona, se asume 1
    const limit = 10; // Comentarios por página
    const offset = (page - 1) * limit; // Calculo del desplazamiento
    Buy.findAndCountAll({
        where: {
            id_usuario_compra: id_usuario,
            valida: true
        },
        order: [['validate_at', 'DESC']],
        limit: limit,
        offset: offset,
        include: [
            {
                model: Articulo,
                as: 'articulo_venta',
                required: true
            },
            {
                model: Articulo,
                as: 'articulo_cambio',
                required: false
            }
        ]
    })
        .then((result: any) => {
            const compras = result.rows;
            const totalCompras = result.count;
            const totalPages = Math.ceil(totalCompras / limit); // Total de páginas
            const payload = {
                data: compras,
                totalPages: totalPages,
                currentPage: page,
                previousPage: page > 1 ? page - 1 : null,
                nextPage: page < totalPages ? page + 1 : null,
                pagesToShow: generatePagesToShow(page, totalPages)
            }
            return responseAPI(HttpStatus.OK, res, payload, "Compras realizadas por el usuario");
        })
        .catch((error: any) => {
            return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, "Error al obtener las compras", error.message);
        });
};

export const getVentasUsuario = async (req: Request, res: Response) => {
    const tokenPayload: TokenPayload = req.tokenPayload;
    const id_usuario = tokenPayload.usuarioId;
    const page = req.query.page ? parseInt(req.query.page.toString()) : 1; // Página actual, si no se proporciona, se asume 1
    const limit = 10; // Comentarios por página
    const offset = (page - 1) * limit; // Calculo del desplazamiento
    Buy.findAndCountAll({
        where: {
            id_usuario_venta: id_usuario,
            valida: true
        },
        order: [['validate_at', 'DESC']],
        limit: limit,
        offset: offset,
        include: [
            {
                model: Articulo,
                as: 'articulo_venta',
                required: true
            },
            {
                model: Articulo,
                as: 'articulo_cambio',
                required: false
            }
        ]
    })
        .then((result: any) => {
            const ventas = result.rows;
            const totalVentas = result.count;
            const totalPages = Math.ceil(totalVentas / limit); // Total de páginas
            const payload = {
                data: ventas,
                totalPages: totalPages,
                currentPage: page,
                previousPage: page > 1 ? page - 1 : null,
                nextPage: page < totalPages ? page + 1 : null,
                pagesToShow: generatePagesToShow(page, totalPages)
            }
            return responseAPI(HttpStatus.OK, res, payload, "Ventas realizadas por el usuario");
        })
        .catch((error: any) => {
            return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, "Error al obtener las ventas", error.message);
        });
};

export const getVentasValidar = async (req: Request, res: Response) => {
    const tokenPayload: TokenPayload = req.tokenPayload;
    const id_usuario = tokenPayload.usuarioId;
    const page = req.query.page ? parseInt(req.query.page.toString()) : 1; // Página actual, si no se proporciona, se asume 1
    const limit = 10; // Comentarios por página
    const offset = (page - 1) * limit; // Calculo del desplazamiento
    Buy.findAndCountAll({
        where: {
            id_usuario_venta: id_usuario,
            valida: false
        },
        order: [['validate_at', 'DESC']],
        limit: limit,
        offset: offset,
        include: [
            {
                model: Articulo,
                as: 'articulo_venta',
                required: true
            },
            {
                model: Articulo,
                as: 'articulo_cambio',
                required: false
            }
        ]
    })
        .then((result: any) => {
            const ventas = result.rows;
            const totalVentas = result.count;
            const totalPages = Math.ceil(totalVentas / limit); // Total de páginas
            const payload = {
                data: ventas,
                totalPages: totalPages,
                currentPage: page,
                previousPage: page > 1 ? page - 1 : null,
                nextPage: page < totalPages ? page + 1 : null,
                pagesToShow: generatePagesToShow(page, totalPages)
            }
            return responseAPI(HttpStatus.OK, res, payload, "Ventas realizadas por el usuario");
        })
        .catch((error: any) => {
            return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, "Error al obtener las ventas", error.message);
        });
};