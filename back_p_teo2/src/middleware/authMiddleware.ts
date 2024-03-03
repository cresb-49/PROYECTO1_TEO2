import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { responseAPI } from '../handler/responseAPI';
import { HttpStatus } from '../enums/httpStatus';

export interface TokenPayload {
    usuarioId: string;
    create_at: number;
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    let token = req.header('Authorization');
    //Quitamos la palabra Bearer del token y los espacios al inicio y al final
    token = token?.replace('Bearer', '').trim();
    if (!token) return responseAPI(HttpStatus.UNAUTHORIZED, res, null, 'Acceso denegado\nInicia sesion para continuar');
    try {
        const payload = jwt.verify(token, 'ItR2z9hm3') as TokenPayload;
        req.tokenPayload = payload;
        next();
    } catch (error) {
        // return res.status(400).json({ data: null, mensaje: 'Token no válido\nInicia sesion nuevamente', error: error.message });
        return responseAPI(HttpStatus.BAD_REQUEST, res, null, 'Inicia sesion nuevamente', 'Inicia sesion nuevamente', null, [error.message]);
    }
}