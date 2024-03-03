import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { responseAPI } from '../handler/responseAPI';
import { HttpStatus } from '../enums/httpStatus';

export interface TokenPayload {
    usuarioId: string;
    create_at: number;
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization');
    console.log(token);
    // if (!token) return res.status(401).json({ data: null, mensaje: 'Acceso denegado\nInicia sesion para continuar', error: null });
    if (!token) return responseAPI(HttpStatus.UNAUTHORIZED, res, null, 'Acceso denegado\nInicia sesion para continuar');
    try {
        const payload = jwt.verify(token, 'ItR2z9hm3') as TokenPayload;
        req.tokenPayload = payload;
        next();
    } catch (error) {
        // return res.status(400).json({ data: null, mensaje: 'Token no válido\nInicia sesion nuevamente', error: error.message });
        return responseAPI(HttpStatus.BAD_REQUEST, res, null, 'Token no válido\nInicia sesion nuevamente', error.message);
    }

}