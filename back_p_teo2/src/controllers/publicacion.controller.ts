import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { responseAPI, responsePaginateAPI } from '../handler/responseAPI';
import { HttpStatus } from '../enums/httpStatus';
import { TipoPublicacion } from '../models/tipo_publicacion';
import { Articulo } from '../models/articulo';
import { Publicacion } from '../models/publicacion';
import { Category } from '../models/category';
import { Report } from '../models/report';
import { generatePagesToShow } from '../handler/generatePagesToShow';
import { findOrCreateChat, sendMessageOnChat } from './chat.controller';
import { TokenPayload } from '../middleware/authMiddleware';
import { Buy } from '../models/buy';
import { Usuario } from '../models/usuario';
import { Acount } from '../models/acount';
import sequelize from '../database/database';
import { BuyTransaccion } from '../models/buy_transaccion';

export const getPublicaciones = async (req: Request, res: Response) => {
    //Obtenemos el parametro nombre
    let { nombre } = req.query;
    const page: number = req.query.page ? parseInt(req.query.page.toString()) : 1; // Página actual, si no se proporciona, se asume 1
    const limit: number = 20; // Comentarios por página
    const offset: number = (page - 1) * limit; // Calculo del desplazamiento
    //Si nombre solo es un string vacio lo convertimos a null
    if (nombre !== undefined && nombre !== "" && typeof nombre === "string" && nombre.length !== 0 && nombre.trim() !== "") {
        //Buscamos por medio de like en el nombre del articulo
        console.log('con nombre');
        Publicacion.findAndCountAll({
            where: {
                isValidate: true
            },
            order: [['created_at', 'DESC']],
            limit: limit,
            offset: offset,
            include: [
                {
                    model: Articulo,
                    required: true,
                    where: {
                        nombre: {
                            [Op.like]: `%${nombre}%`
                        }
                    },
                    include: [
                        {
                            model: Category,
                            required: false
                        }
                    ]
                }
            ]
        })
            .then((value: any) => {
                const publicaciones = value.rows;
                const totalItems = value.count;
                const totalPages = Math.ceil(totalItems / limit);
                const payload = {
                    data: publicaciones,
                    totalPages: totalPages,
                    currentPage: page,
                    previousPage: page > 1 ? page - 1 : null,
                    nextPage: page < totalPages ? page + 1 : null,
                    pagesToShow: generatePagesToShow(page, totalPages)
                }
                return responseAPI(HttpStatus.OK, res, payload, "Publicaciones encontradas con exito");
            })
            .catch((reason: any) => {
                return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, reason.message, reason.message);
            })
    } else {
        Publicacion.findAndCountAll({
            where: {
                isValidate: true
            },
            order: [['created_at', 'DESC']],
            limit: limit,
            offset: offset,
            include: [
                {
                    model: Articulo,
                    required: true,
                    include: [
                        {
                            model: Category,
                            required: false,
                        }
                    ]
                }
            ]
        })
            .then((value: any) => {
                const publicaciones = value.rows;
                const totalItems = value.count;
                const totalPages = Math.ceil(totalItems / limit);
                const payload = {
                    data: publicaciones,
                    totalPages: totalPages,
                    currentPage: page,
                    previousPage: page > 1 ? page - 1 : null,
                    nextPage: page < totalPages ? page + 1 : null,
                    pagesToShow: generatePagesToShow(page, totalPages)
                }
                return responseAPI(HttpStatus.OK, res, payload, "Publicaciones encontradas con exito");
            })
            .catch((reason: any) => {
                return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, reason.message, reason.message);
            })
    }
};

export const getPublicacionesPorConfirmar = async (req: Request, res: Response) => {
    Publicacion.findAll({
        where: {
            isValidate: false
        },
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
    })
        .then((value: any[]) => {
            return responseAPI(HttpStatus.OK, res, value, "Publicaciones encontradas con exito");
        })
        .catch((reason: any) => {
            return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, reason.message, reason.message);
        })
};

export const getPublicacion = async (req: Request, res: Response) => {
    const { id } = req.params;
    Publicacion.findByPk(id, {
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
    })
        .then((value: any) => {
            if (value === null) {
                return responseAPI(HttpStatus.NOT_FOUND, res, null, "Publicacion no encontrada", "La publicacion no existe");
            }
            return responseAPI(HttpStatus.OK, res, value, "Publicacion encontrada con exito");
        })
        .catch((reason: any) => {
            return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, reason.message, reason.message);
        })
}

export const getTipoPublicacion = async (req: Request, res: Response) => {
    TipoPublicacion.findAll()
        .then((value: any[]) => {
            return responseAPI(HttpStatus.OK, res, value, "Tipos de publicaciones encontrados con exito");
        })
        .catch((reason: any) => {
            return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, reason.message, reason.message);
        })
};

export const getPublicacionesUsuario = async (req: Request, res: Response) => {

};

export const createPublicacion = async (req: Request, res: Response) => {
    const { tokenPayload } = req;
    const idUsuario = tokenPayload.usuarioId;
    //Obtener el id del articulo
    const { id_articulo } = req.body;
    //Obtenemos el articulo
    let articulo: any = await Articulo.findByPk(id_articulo);
    // Verificamos que el producto exista y pertenezca al usuario
    if (articulo === null) {
        return responseAPI(HttpStatus.NOT_FOUND, res, null, "Articulo no encontrado", "El articulo no existe");
    }
    console.log(articulo.id_usuario, idUsuario);
    if (parseInt(articulo.id_usuario) !== parseInt(idUsuario)) {
        return responseAPI(HttpStatus.FORBIDDEN, res, null, "No tienes permiso para realizar esta accion", "El articulo no pertenece al usuario");
    }
    //Contamos cuantas publicaciones validadas tiene el usuario
    let publicaciones: number = await Publicacion.count({
        where: {
            id_usuario: idUsuario,
            isValidate: true
        }
    });
    //Creamos la publicacion con el articulo
    const payload = {
        id_articulo: id_articulo,
        id_tipo_publicacion: 1,
        id_usuario: idUsuario,
        isValidate: publicaciones >= 3,
        f_validacion: new Date()
    }
    //Guardamos la publicacion
    Publicacion.create(payload)
        .then((value: any) => {
            return responseAPI(HttpStatus.CREATED, res, value, "Publicacion creada con exito");
        })
        .catch((reason: any) => {
            return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, reason.message, reason.message);
        })
};

export const confirmarPublicacion = async (req: Request, res: Response) => {
    const { id_publicacion } = req.body;
    let publicacion = await Publicacion.findByPk(id_publicacion);
    if (publicacion === null) {
        return responseAPI(HttpStatus.NOT_FOUND, res, null, "Publicacion no encontrada", "La publicacion no existe");
    }
    publicacion.update({
        isValidate: true,
        f_validacion: new Date()
    }).then((value: any) => {
        return responseAPI(HttpStatus.OK, res, value, "Publicacion confirmada con exito");
    }).catch((reason: any) => {
        return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, reason.message, reason.message);
    })
};

export const reportarPublicacion = async (req: Request, res: Response) => {
    const { tokenPayload } = req;
    const id_usuario = tokenPayload.usuarioId;
    const { id_publicacion, comentario } = req.body;
    //Obtenemos la publicacion en base a su id
    let publicacion = await Publicacion.findByPk(id_publicacion);
    if (publicacion === null) {
        return responseAPI(HttpStatus.NOT_FOUND, res, null, "Publicacion no encontrada", "La publicacion no existe");
    }
    Report.create({
        id_usuario: id_usuario,
        id_publicacion: id_publicacion,
        comentario: comentario
    }).then(async (value: any) => {
        //Actulizamos ek estado de la publiacion a reportada
        await publicacion.update({
            isReported: true,
            f_reporte: new Date()
        });
        //Enviamos al respuesta
        return responseAPI(HttpStatus.CREATED, res, value, "Publicacion reportada con exito");
    }).catch((reason: any) => {
        return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, reason.message, reason.message);
    });
};

export const getPublicacionesReportadas = async (req: Request, res: Response) => {

    const page: number = req.query.page ? parseInt(req.query.page.toString()) : 1; // Página actual, si no se proporciona, se asume 1
    const limit: number = 20; // Comentarios por página
    const offset: number = (page - 1) * limit; // Calculo del desplazamiento

    Publicacion.findAndCountAll(
        {
            where: {
                isValidate: true,
                isReported: true
            },
            order: [['f_reporte', 'DESC']],
            limit: limit,
            offset: offset,
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
                },
                {
                    model: Report,
                    required: false
                }
            ]
        })
        .then((value: any) => {
            return responsePaginateAPI(HttpStatus.OK, { res, req }, value, "Publicaciones encontradas con exito");
        })
        .catch((reason: any) => {
            return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, reason.message, reason.message);
        })
};

export const getPublicacionesTrabajosVoluntariados = async (req: Request, res: Response) => {
    //Obtenermos el id del cliente
    const { tokenPayload } = req;
    const id_usuario: number = parseInt(tokenPayload.usuarioId);
    const page: number = req.query.page ? parseInt(req.query.page.toString()) : 1; // Página actual, si no se proporciona, se asume 1
    const limit: number = 20; // Comentarios por página
    const offset: number = (page - 1) * limit; // Calculo del desplazamiento

    Publicacion.findAndCountAll(
        {
            where: {
                isValidate: true,
                id_usuario: id_usuario
            },
            order: [['f_reporte', 'DESC']],
            limit: limit,
            offset: offset,
            include: [
                {
                    model: Articulo,
                    required: true,
                    include: [
                        {
                            model: Category,
                            required: true,
                            where: {
                                id: [2, 3]
                            }
                        }
                    ],
                }
            ]
        })
        .then((value: any) => {
            return responsePaginateAPI(HttpStatus.OK, { res, req }, value, "Publicaciones encontradas con exito");
        })
        .catch((reason: any) => {
            return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, reason.message, reason.message);
        })
};

export const rechazarReportes = async (req: Request, res: Response) => {
    const { id_publicacion } = req.body;
    let publicacion = await Publicacion.findByPk(id_publicacion);
    if (publicacion === null) {
        return responseAPI(HttpStatus.NOT_FOUND, res, null, "Publicacion no encontrada", "La publicacion no existe");
    }
    publicacion.update({
        isReported: false,
        f_reporte: null
    }).then(async (value: any) => {
        //Eliminamos todos los reportes de la publicacion
        let cantidad: number = await Report.destroy({
            where: {
                id_publicacion: id_publicacion
            }
        });
        return responseAPI(HttpStatus.OK, res, value, "Se han rechazado " + cantidad + " reportes de la publicacion");
    }).catch((reason: any) => {
        return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, reason.message, reason.message);
    })
};

export const eliminarReporte = async (req: Request, res: Response) => {
    const { idReporte } = req.params;
    let reporte: any = await Report.findByPk(idReporte);
    if (reporte === null) {
        return responseAPI(HttpStatus.NOT_FOUND, res, null, "Reporte no encontrado", "El reporte no existe");
    }
    //Obtenemos el id de la publicacion
    const id_publicacion = reporte.id_publicacion;
    //Obtenemos la publicacion
    let publicacion = await Publicacion.findByPk(id_publicacion);
    reporte.destroy()
        .then(async (value: any) => {
            //Contamos cuantos reportes tiene la publicacion
            let cantidad: number = await Report.count({
                where: {
                    id_publicacion: id_publicacion
                }
            });
            //Si la cantidad es 0, eliminamos el estado de reportado de la publicacion
            if (cantidad === 0 && publicacion !== null) {
                await publicacion.update({
                    isReported: false,
                    f_reporte: null
                });
            }
            return responseAPI(HttpStatus.OK, res, value, "Reporte No." + idReporte + " eliminado con exito");
        })
        .catch((reason: any) => {
            return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, reason.message, reason.message);
        })
};

export const banearPublicacion = async (req: Request, res: Response) => {
    const { id_publicacion } = req.body;
    let publicacion: any = await Publicacion.findByPk(id_publicacion, { include: [{ model: Articulo, required: true }] });
    if (publicacion === null) {
        return responseAPI(HttpStatus.NOT_FOUND, res, null, "Publicacion no encontrada", "La publicacion no existe");
    }
    //Recuperamos el id de la persona que publico la publicacion
    const id_usuario_2: number = parseInt(publicacion.id_usuario);
    //Obtenemos el id del usuario del JWT
    const { tokenPayload } = req;
    const id_usuario_1: number = parseInt(tokenPayload.usuarioId);
    Publicacion.destroy({
        where: {
            id: id_publicacion
        }
    }).then(async (value: any) => {
        let chat: any = await findOrCreateChat(id_usuario_1, id_usuario_2);
        //Enviamos un mensaje al chat
        // await sendMessageOnChat(
        //     id_usuario_1,
        //     chat.id,
        //     `Tu publicacion del producto "${publicacion.articulo.nombre}" identificada con el id ${publicacion.id} ha sido baneada de la plataforma por multiples reportes. Si deseas apelar a esta decision, puedes hacerlo por medio de este chat.`
        // );
        await sendMessageOnChat(
            id_usuario_1,
            chat.id,
            `Tu publicacion del producto "${publicacion.articulo.nombre}" identificada con el id ${publicacion.id} ha sido baneada de la plataforma por multiples reportes.`
        );
        return responseAPI(HttpStatus.OK, res, value, "Publicacion baneada con exito");
    }).catch((reason: any) => {
        return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, reason.message, reason.message);
    });
};

export const deleteVoluntariadoTrabajo = async (req: Request, res: Response) => {
    const id_publicacion: number = parseInt(req.params.idPublicacion);
    const tokenPayload: TokenPayload = req.tokenPayload;
    //Buscamos la publicacion en base a su id y el id del usuario
    const publicacion: any = await Publicacion.findOne({
        where: {
            id: id_publicacion,
            id_usuario: tokenPayload.usuarioId
        }
        , include: [
            {
                model: Articulo,
                required: true
            }
        ]
    });
    const articulo: any = publicacion.articulo;
    const id_categoria: number = parseInt(publicacion.articulo.id_categoria);
    if (id_categoria === 1 || id_categoria === 4) {
        return responseAPI(HttpStatus.FORBIDDEN, res, null, "No tienes permiso para realizar esta accion", "La publicacion no es un voluntariado o trabajo");
    }
    const tipo = id_categoria === 3 ? "voluntariado" : "trabajo";
    if (publicacion === null) {
        return responseAPI(HttpStatus.NOT_FOUND, res, null, "Publicacion no encontrada", "La publicacion no existe");
    }
    //Obtenemos todas las compras relacionadas a la publicacion
    const buys: any[] = await Buy.findAll({
        where: {
            id_publicacion: id_publicacion
        }
    });
    //Retornamos los creditos utilizados en las compras al usuario que compro
    const t = await sequelize.transaction();
    try {
        let ids_buy: number[] = [];
        //Realizamos el retorno de creditos
        for (const buy of buys) {
            ids_buy.push(buy.id);
            const usuario: any = await Usuario.findByPk(buy.id_usuario_compra, { include: [{ model: Acount, required: true }] });
            const acount: any = usuario.acount;
            let chat: any = await findOrCreateChat(tokenPayload.usuarioId, buy.id_usuario_compra, t);
            if (buy.valida) {
                if (parseFloat(buy.creditos_retirables_usados) > 0) {
                    acount.update({
                        saldo_retirable: parseFloat(acount.saldo_retirable) + parseFloat(buy.creditos_retirables_usados)
                    }, { transaction: t });
                }
                if (parseFloat(buy.creditos_no_retirables_usados) > 0) {
                    acount.update({
                        saldo_no_retirable: parseFloat(acount.saldo_no_retirable) + parseFloat(buy.creditos_no_retirables_usados)
                    }, { transaction: t });
                }
                //Enviamos un mensaje al chat del usaurio que se retornaron sus creditos al eliminar el voluntariado o trabajo
                await sendMessageOnChat(
                    tokenPayload.usuarioId,
                    chat.id,
                    `Se eliminó el ${tipo} "${articulo.nombre}"\nSe han retornado los creditos utilizados en la entrada del ${tipo}:\nCreditos Retirables: ${buy.creditos_retirables_usados}\nCreditos No Retirables: ${buy.creditos_no_retirables_usados}`,
                    t
                );
            } else {
                await sendMessageOnChat(
                    tokenPayload.usuarioId,
                    chat.id,
                    `Se eliminó el ${tipo} "${articulo.nombre}" a la cual estaba aplicando`,
                    t
                );
            }
        }
        //Eliminamos las transacciones de las compras
        await BuyTransaccion.destroy({
            where: {
                id_buy: ids_buy
            },
            transaction: t
        });
        //Eliminamos las compras
        await Buy.destroy({
            where: {
                id: ids_buy
            },
            transaction: t
        });
        //Eliminamos la publicacion
        await publicacion.destroy({ transaction: t });
        await t.commit();
        responseAPI(HttpStatus.OK, res, null, "Publicacion eliminada con exito");
    } catch (error) {
        await t.rollback();
        return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, error.message, error.message);
    }
}

export const terminarVoluntariadoTrabajo = async (req: Request, res: Response) => {
    const { id_publicacion } = req.body;
    const tokenPayload: TokenPayload = req.tokenPayload;
    //Buscamos la publicacion en base a su id y el id del usuario
    const publicacion: any = await Publicacion.findOne({
        where: {
            id: id_publicacion,
            id_usuario: tokenPayload.usuarioId
        }
        , include: [
            {
                model: Articulo,
                required: true
            }
        ]
    });
    const articulo: any = publicacion.articulo;
    const id_categoria: number = parseInt(publicacion.articulo.id_categoria);
    if (id_categoria === 1 || id_categoria === 4) {
        return responseAPI(HttpStatus.FORBIDDEN, res, null, "No tienes permiso para realizar esta accion", "La publicacion no es un voluntariado o trabajo");
    }
    const tipo = id_categoria === 3 ? "voluntariado" : "trabajo";
    if (publicacion === null) {
        return responseAPI(HttpStatus.NOT_FOUND, res, null, "Publicacion no encontrada", "La publicacion no existe");
    }
    //Obtenemos todas las compras relacionadas a la publicacion
    const buys: any[] = await Buy.findAll({
        where: {
            id_publicacion: id_publicacion
        }
    });
    //Retornamos los creditos utilizados en las compras al usuario que compro
    const t = await sequelize.transaction();
    try {
        let ids_buy: number[] = [];
        //Realizamos el retorno de creditos
        const usuario_vendedor: any = await Usuario.findByPk(tokenPayload.usuarioId, { include: [{ model: Acount, required: true }] });
        const acount_vendedor: any = usuario_vendedor.acount;
        for (const buy of buys) {
            ids_buy.push(buy.id);
            const usuario_comprador: any = await Usuario.findByPk(buy.id_usuario_compra, { include: [{ model: Acount, required: true }] });
            const acount_comprador: any = usuario_comprador.acount;
            let chat: any = await findOrCreateChat(tokenPayload.usuarioId, buy.id_usuario_compra, t);
            if (buy.valida) {
                if (parseFloat(buy.creditos_retirables_usados) > 0) {
                    acount_vendedor.update({
                        saldo_retirable: parseFloat(acount_vendedor.saldo_retirable) + parseFloat(buy.creditos_retirables_usados)
                    }, { transaction: t });
                }
                if (parseFloat(buy.creditos_no_retirables_usados) > 0) {
                    acount_vendedor.update({
                        saldo_no_retirable: parseFloat(acount_vendedor.saldo_no_retirable) + parseFloat(buy.creditos_no_retirables_usados)
                    }, { transaction: t });
                }
                if (parseFloat(articulo.creditos_retirables_asignados) > 0) {
                    acount_comprador.update({
                        saldo_retirable: parseFloat(acount_comprador.saldo_retirable) + parseFloat(articulo.creditos_retirables_asignados)
                    }, { transaction: t });
                }
                if (parseFloat(articulo.creditos_no_retirables_asignados) > 0) {
                    acount_comprador.update({
                        saldo_no_retirable: parseFloat(acount_comprador.saldo_no_retirable) + parseFloat(articulo.creditos_no_retirables_asignados)
                    }, { transaction: t });
                }
                //Enviamos un mensaje al chat del usaurio que se retornaron sus creditos al eliminar el voluntariado o trabajo
                await sendMessageOnChat(
                    tokenPayload.usuarioId,
                    chat.id,
                    `Se termino el ${tipo} "${articulo.nombre}"\nRecibira la recompenza del ${tipo}:\nCreditos Retirables: ${articulo.creditos_retirables_asignados}\nCreditos No Retirables: ${articulo.creditos_no_retirables_asignados}`,
                    t
                );
            } else {
                await sendMessageOnChat(
                    tokenPayload.usuarioId,
                    chat.id,
                    `Se termino el ${tipo} "${articulo.nombre}" a la cual estaba aplicando`,
                    t
                );
            }
        }
        //finalizamos la publicacion
        await publicacion.update({
            finished_at: new Date()
        }, { transaction: t });
        await t.commit();
        responseAPI(HttpStatus.OK, res, null, "Publicacion terminada con exito");
    } catch (error) {
        await t.rollback();
        return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, error.message, error.message);
    }
}