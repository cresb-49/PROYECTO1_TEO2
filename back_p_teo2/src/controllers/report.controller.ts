import { Request, Response } from 'express';
import { responseAPI } from '../handler/responseAPI';
import { HttpStatus } from '../enums/httpStatus';
import { Report } from '../models/report';
import { TokenPayload } from '../middleware/authMiddleware';

export const createReport = async (req: Request, res: Response) => {
    //Obtenemos del body el id_publicacion y el comentario
    const { id_publicacion, comentario } = req.body;
    //Obtenermos el IdUsuario del token
    const tokenPayload: TokenPayload = req.tokenPayload;
    const id_usuario = tokenPayload.usuarioId;
    //Creamos el reporte
    Report.create({ id_usuario, id_publicacion, comentario })
        .then((report: any) => {
            return responseAPI(HttpStatus.CREATED, res, report, 'Reporte creado con exito');
        })
        .catch((error: any) => {
            return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, 'Error al crear reporte', error.message);
        });
};
