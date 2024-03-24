import { Request, Response } from 'express';
import { generatePagesToShow } from './generatePagesToShow';
export const responseAPI = (status: number, res: Response, data: any = null, mensaje: string = null, error: string = null, mensajes: Array<string> = [], errors: Array<string> = []) => {
    res.status(status)
        .json(
            {
                "data": data,
                "mensaje": mensaje,
                "mensajes": mensajes,
                "error": error,
                "errores": errors
            });
}

export const responsePaginateAPI = (status: number, http: { res: Response, req: Request }, data: any = null, mensaje: string = null, error: string = null, mensajes: Array<string> = [], errors: Array<string> = []) => {

    const page: number = http.req.query.page ? parseInt(http.req.query.page.toString()) : 1;
    const data_paginate = data.rows;
    const total_items = data.count;
    const total_pages = Math.ceil(total_items / data.rows.length);

    http.res.status(status)
        .json(
            {
                "data": data_paginate,
                "mensaje": mensaje,
                "mensajes": mensajes,
                "error": error,
                "errores": errors,
                "totalPages": total_pages,
                "currentPage": page,
                "previousPage": page > 1 ? page - 1 : null,
                "nextPage": page < total_pages ? page + 1 : null,
                "pagesToShow": generatePagesToShow(page, total_pages)
            });
}