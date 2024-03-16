import { Request, Response, NextFunction } from 'express';
import { Roles } from '../enums/roles';
import { responseAPI } from '../handler/responseAPI';
import { HttpStatus } from '../enums/httpStatus';
import { TokenPayload } from './authMiddleware';
import { UsuarioRol } from '../models/usuario_rol';

export const isConfirm = async (req: Request, res: Response, next: NextFunction) => {
    const token: TokenPayload = req.tokenPayload;
    let usuario_rol = await UsuarioRol.findOne({ where: { 'id_usuario': token.usuarioId, 'id_rol': Roles.CONFIRM } });
    if (usuario_rol) {
        next();
    } else {
        return responseAPI(HttpStatus.UNAUTHORIZED, res, null, 'Acceso denegado', 'Acceso denegado');
    }
}

export const isCategory = async (req: Request, res: Response, next: NextFunction) => {
    const token: TokenPayload = req.tokenPayload;
    let usuario_rol = await UsuarioRol.findOne({ where: { 'id_usuario': token.usuarioId, 'id_rol': Roles.CATEGORY } });
    if (usuario_rol) {
        next();
    } else {
        return responseAPI(HttpStatus.UNAUTHORIZED, res, null, 'Acceso denegado', 'Acceso denegado');
    }
}

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const token: TokenPayload = req.tokenPayload;
    let usuario_rol = await UsuarioRol.findOne({ where: { 'id_usuario': token.usuarioId, 'id_rol': Roles.ADMIN } });
    if (usuario_rol) {
        next();
    } else {
        return responseAPI(HttpStatus.UNAUTHORIZED, res, null, 'Acceso denegado', 'Acceso denegado');
    }
}