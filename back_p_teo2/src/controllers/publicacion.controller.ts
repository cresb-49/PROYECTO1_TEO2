import { Request, Response } from 'express';
import { responseAPI } from '../handler/responseAPI';
import { HttpStatus } from '../enums/httpStatus';
import { TipoPublicacion } from '../models/tipo_publicacion';

export const getPublicaciones = async (req: Request, res: Response) => {

};

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

};

export const updatePublicacion = async (req: Request, res: Response) => {

};