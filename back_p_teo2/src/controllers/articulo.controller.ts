import { Request, Response } from 'express';
import { responseAPI } from '../handler/responseAPI';
import { HttpStatus } from '../enums/httpStatus';
import { Articulo } from '../models/articulo';
import { Publicacion } from '../models/publicacion';
import { Image } from '../models/image';
import { readFileImage, saveImage } from '../middleware/image.midelware';
import sequelize from '../database/database';
import { TokenPayload } from '../middleware/authMiddleware';
import { Category } from '../models/category';
import { Usuario } from '../models/usuario';
import { Acount } from '../models/acount';
import { generarTransaccionArticulo } from './transaccion.controller';

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
export const getArticulosPublicadosIntercambiables = async (req: Request, res: Response) => {
    const { tokenPayload } = req;
    const idUsuario = tokenPayload.usuarioId;
    Articulo.findAll({
        include: [
            {
                model: Publicacion,
                required: true, // INNER JOIN
            },
            {
                model: Category,
                required: true,
                where: { id: [1, 4] }
            }
        ],
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
    const { idArticulo } = req.params;
    const tokenPayload: TokenPayload = req.tokenPayload;
    const id_usuario: number = parseInt(tokenPayload.usuarioId);
    Articulo.findByPk(idArticulo, {
        include: [
            {
                model: Category,
                required: true
            }
        ]
    })
        .then((articulo: any) => {
            if (articulo) {
                if (!articulo) {
                    return responseAPI(HttpStatus.NOT_FOUND, res, null, "Producto no encontrado", "Producto no encontrado");
                }
                if (articulo.id_usuario === id_usuario) {
                    return responseAPI(HttpStatus.OK, res, articulo, "Producto encontrado con exito");
                } else {
                    return responseAPI(HttpStatus.FORBIDDEN, res, null, "No tienes permisos para ver este producto", "No tienes permisos para ver este producto");
                }
            } else {
                return responseAPI(HttpStatus.NOT_FOUND, res, null, "Producto no encontrado", "Producto no encontrado");
            }
        })
        .catch((reason: any) => {
            return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, reason.message, reason.message);
        });
};

export const createArticulo = async (req: Request, res: Response) => {

    const { nombre, precio, cantidad, descripcion, imagen, valor_entrada, recompenza } = req.body;
    const id_categoria = parseInt(req.body.id_categoria);
    const tokenPayload: TokenPayload = req.tokenPayload;
    const id_usuario = parseInt(tokenPayload.usuarioId);
    let payload = {
        nombre: nombre,
        valor: parseFloat(precio),
        valor_entrada: parseFloat(valor_entrada),
        recompenza: parseFloat(recompenza),
        descripcion: descripcion,
        id_categoria: id_categoria,
        id_usuario: id_usuario,
        cantidad: parseInt(cantidad),
        creditos_retirables_asignados: 0,
        creditos_no_retirables_asignados: 0
    }
    //Validamos el precio si el articulo es la catoegoria 1 o 4
    if (payload.valor <= 0 && (id_categoria === 1 || id_categoria === 4)) {
        return responseAPI(HttpStatus.BAD_REQUEST, res, null, "El precio no puede ser negativo o cero", "El precio no puede ser negativo o cero");
    }
    //Si categoria es 2 o 3 el precio debe ser 0
    if (payload.valor !== 0 && (id_categoria === 2 || id_categoria === 3)) {
        return responseAPI(HttpStatus.BAD_REQUEST, res, null, "Este tipo de articulo no puede tener precio", "Este tipo de articulo no puede tener precio");
    }
    //Si la categoria es 1 o 4 el valor_entrada y recompenza deben ser 0
    if (payload.valor_entrada !== 0 && (id_categoria === 1 || id_categoria === 4)) {
        return responseAPI(HttpStatus.BAD_REQUEST, res, null, "Este tipo de articulo no puede tener valor de entrada", "Este tipo de articulo no puede tener valor de entrada");
    }
    if (payload.recompenza !== 0 && (id_categoria === 1 || id_categoria === 4)) {
        return responseAPI(HttpStatus.BAD_REQUEST, res, null, "Este tipo de articulo no puede tener recompenza", "Este tipo de articulo no puede tener recompenza");
    }
    //Validamos la cantidad positiva
    if (payload.cantidad < 1) {
        return responseAPI(HttpStatus.BAD_REQUEST, res, null, "La cantidad no puede ser negativa o cero", "La cantidad no puede ser negativa o cero");
    }
    // Si el articulo es de la categoria 2 0 4 el valor de entrada puede ser >= 0 y la recompenza >= 1
    if ((id_categoria === 2 || id_categoria === 3) && payload.valor_entrada < 0) {
        return responseAPI(HttpStatus.BAD_REQUEST, res, null, "El valor de entrada no puede ser negativo", "El valor de entrada no puede ser negativo");
    }
    if ((id_categoria === 2 || id_categoria === 3) && payload.recompenza < 1) {
        return responseAPI(HttpStatus.BAD_REQUEST, res, null, "La recompenza no puede ser negativa o cero", "La recompenza no puede ser negativa o cero");
    }
    //El valor de la entrada no puede ser mayor a la recompenza
    if (payload.valor_entrada > payload.recompenza) {
        return responseAPI(HttpStatus.BAD_REQUEST, res, null, "El valor de la entrada no puede ser mayor a la recompenza", "El valor de la entrada no puede ser mayor a la recompenza");
    }
    const t = await sequelize.transaction();
    try {
        //Verificasmos si la multiplicacion entre la cantidad y la recompenza es mayor al saldo del usuario
        if (recompenza > 0) {
            let cantidad_creditos_descontar = payload.cantidad * payload.recompenza;
            let usuario: any = await Usuario.findByPk(id_usuario, { include: [{ model: Acount, required: true }] });
            let saldo_total_disponible = usuario.acount.saldo_retirable + usuario.acount.saldo_no_retirable;
            if (cantidad_creditos_descontar > saldo_total_disponible) {
                throw new Error("No tienes suficientes creditos para publicar este articulo");
            }
            //Calculamos el uso de los creditos no retirables
            let total_asignado = 0;
            let asignancion_no_retirable = 0;
            let asignancion_retirable = 0;
            if (usuario.acount.saldo_no_retirable > cantidad_creditos_descontar) {
                asignancion_no_retirable = payload.recompenza;
                total_asignado += asignancion_no_retirable;
            } else {
                asignancion_no_retirable = usuario.acount.saldo_no_retirable / payload.cantidad;
                total_asignado += asignancion_no_retirable;
            }
            if (total_asignado !== payload.recompenza) {
                asignancion_retirable = payload.recompenza - total_asignado;
                total_asignado += asignancion_retirable;
            }
            if (total_asignado !== payload.recompenza) {
                throw new Error("Error al asignar los creditos");
            }
            payload.creditos_retirables_asignados = asignancion_retirable;
            payload.creditos_no_retirables_asignados = asignancion_no_retirable;
            //Generamos el descuento de los creditos al usuario
            console.log(payload);
            if (asignancion_retirable > 0) {
                await generarTransaccionArticulo(id_usuario, 1, (asignancion_retirable * payload.cantidad), nombre, t);
            }
            if (asignancion_no_retirable > 0) {
                await generarTransaccionArticulo(id_usuario, 2, (asignancion_no_retirable * payload.cantidad), nombre, t);
            }
        }
        let image_local = await saveImage(imagen);
        let articulo: any = await Articulo.create(payload, { transaction: t });
        await Image.create(
            {
                id_articulo: articulo.id,
                url: image_local,
                prioridad: 1
            }, { transaction: t });
        await t.commit();
        return responseAPI(HttpStatus.OK, res, articulo, "Producto Creado");
    } catch (error) {
        await t.rollback();
        return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, error.message, error.message);
    }
};

export const updateArticulo = async (req: Request, res: Response) => {
    const { nombre, precio, cantidad, id_categoria, descripcion, imagen } = req.body;
    const { idArticulo } = req.params;
    const { tokenPayload } = req;
    const idUsuario: number = parseInt(tokenPayload.usuarioId);
    let articulo_original: any = await Articulo.findByPk(idArticulo, { include: [{ model: Image, required: false }] });
    if (!articulo_original) {
        return responseAPI(HttpStatus.NOT_FOUND, res, null, "Producto no encontrado", "Producto no encontrado");
    }
    if (articulo_original.id_usuario !== idUsuario) {
        return responseAPI(HttpStatus.FORBIDDEN, res, null, "No tienes permisos para modificar este producto", "No tienes permisos para modificar este producto");
    }
    //Validamos el precio y la cantidad positiva
    if (precio <= 0) {
        return responseAPI(HttpStatus.BAD_REQUEST, res, null, "El precio no puede ser negativo o cero", "El precio no puede ser negativo o cero");
    }
    if (cantidad <= 0) {
        return responseAPI(HttpStatus.BAD_REQUEST, res, null, "La cantidad no puede ser negativa o cero", "La cantidad no puede ser negativa o cero");
    }
    let base64Articulo = await readFileImage(articulo_original.images[0].url);
    let payloadActulizacion = {}
    if (nombre) {
        if (nombre !== articulo_original.nombre) {
            payloadActulizacion['nombre'] = nombre;
        }
    }
    if (precio) {
        if (precio !== articulo_original.valor) {
            payloadActulizacion['valor'] = precio;
        }
    }
    if (cantidad) {
        if (cantidad !== articulo_original.cantidad) {
            payloadActulizacion['cantidad'] = cantidad;
        }
    }
    if (descripcion) {
        if (descripcion !== articulo_original.descripcion) {
            payloadActulizacion['descripcion'] = descripcion;
        }
    }
    if (id_categoria) {
        if (id_categoria !== articulo_original.id_categoria) {
            payloadActulizacion['id_categoria'] = id_categoria;
        }
    }
    let banderaImagen = false;
    if (base64Articulo !== imagen) {
        banderaImagen = true;
    }
    if (Object.keys(payloadActulizacion).length === 0 && banderaImagen === false) {
        return responseAPI(HttpStatus.NOT_MODIFIED, res, null, "No se realizo ninguna actualizacion", "No se realizo ninguna actualizacion");
    } else {
        Articulo.update(payloadActulizacion, { where: { id: idArticulo } })
            .then(async (articulo: any) => {
                if (banderaImagen) {
                    let path_image = await saveImage(imagen);
                    let id_imagen = articulo_original.images[0].id;
                    await Image.update({ url: path_image }, { where: { id: id_imagen } });
                }
                return responseAPI(HttpStatus.OK, res, articulo, "Producto actualizado con exito");
            })
            .catch((reason: any) => {
                return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, reason.message, reason.message);
            });
    }
};

export const resCantidadArticulo = async (id_articulo: number | null, cantidad_restar: number | null) => {
    if (id_articulo !== null && cantidad_restar !== null) {
        const t = await sequelize.transaction();
        try {
            const articulo: any = await Articulo.findByPk(id_articulo);
            if (!articulo) {
                throw new Error("Articulo no encontrado");
            }
            if (articulo.cantidad <= cantidad_restar) {
                throw new Error("Cantidad invalida del producto a comprar");
            }
            let cantidad = articulo.cantidad - cantidad_restar;
            await Articulo.update(
                { cantidad: cantidad },
                { where: { id: id_articulo }, transaction: t }
            );
            await t.commit();
            return await Articulo.findByPk(id_articulo);
        } catch (error) {
            await t.rollback();
            throw error;
        }
    } else {
        console.log('Se envio null en alguno de los parametros');
    }
};