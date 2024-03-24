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

};