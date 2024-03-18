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

    saveImage(imagen).then((path_image: any) => {
        Articulo.create(payload)
            .then(async (articulo: any) => {
                Image.create({
                    id_articulo: articulo.id,
                    url: path_image,
                    prioridad: 1
                })
                    .then((image: any) => {
                        return responseAPI(HttpStatus.OK, res, articulo, "Producto Creado");
                    })
                    .catch(async (reason: any) => {
                        //eliminamos el articulo creado
                        await Articulo.destroy({ where: { id: articulo.id } });
                        return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, reason.message, reason.message);
                    });
            })
            .catch((reason: any) => {
                return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, reason.message, reason.message);
            })
    }).catch((reason: any) => {
        return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, reason.message, reason.message);
    });
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