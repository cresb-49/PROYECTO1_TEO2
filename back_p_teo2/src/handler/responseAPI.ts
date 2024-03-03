import { Response } from 'express';
export const responseAPI = (status: number, res: Response, data: any = null, mensaje: string = null, error: string = null, mensajes: Array<string> = [], errors: Array<string> = []) => {
    res.status(status)
        .json(
            {
                "data": data,
                "mensaje": mensaje,
                "mensajes": mensajes,
                "error": error,
                "errors": errors
            });
    return;
}