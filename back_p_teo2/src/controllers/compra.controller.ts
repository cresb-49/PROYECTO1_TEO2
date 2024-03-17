import { Request, Response } from 'express';
import { responseAPI } from '../handler/responseAPI';
import { HttpStatus } from '../enums/httpStatus';
import { Publicacion } from '../models/publicacion';
import { Articulo } from '../models/articulo';
import { Category } from '../models/category';
import { Buy } from '../models/buy';
import { Usuario } from '../models/usuario';
import { Acount } from '../models/acount';
import { generarTransaccion } from './transaccion.controller';
import { BuyTransaccion } from '../models/buy_transaccion';
import { resCantidadArticulo } from './articulo.controller';
import sequelize from '../database/database';


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
            validate_at: articulo_intercambiar === null ? new Date() : null
        };

        await resCantidadArticulo(publicacion.id_articulo, cantidad);

        const buy: any = await Buy.create(payload, { transaction: t });
        if (buy === null) {
            return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, "Error al realizar la compra", "Error al realizar la compra");
        }
        let transacciones = [];
        if (creditos_retirables > 0) {
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
        if (creditos_no_retirables > 0) {
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
        await Promise.all(transacciones.map(async (transaccion) => {
            await BuyTransaccion.create({
                id_buy: buy.id,
                id_transaccion: transaccion.id
            }, { transaction: t });
        }));
        await t.commit();
        return responseAPI(HttpStatus.CREATED, res, buy, "Compra realizada con exito");
    } catch (error) {
        await t.rollback();
        return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, "Error al realizar la compra", error.message);
    }
}