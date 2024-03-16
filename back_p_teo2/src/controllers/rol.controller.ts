import { Request, Response } from 'express';
import { responseAPI } from '../handler/responseAPI';
import { Rol } from '../models/rol';

export const getRoles = async (req: Request, res: Response) => {
    const roles = await Rol.findAll({ attributes: ['id', 'nombre'] });
    return responseAPI(200, res, roles, 'Roles encontrados con exito');
};
