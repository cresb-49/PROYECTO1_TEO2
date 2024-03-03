import { Request, Response } from 'express';
import { responseAPI } from '../handler/responseAPI';
import { HttpStatus } from '../enums/httpStatus';
import { Cuenta } from '../models/cuenta';


export const getCuenta = async (req: Request, res: Response) => {
    const { tokenPayload } = req;
    const { idUsuario } = req.params;
    if (tokenPayload.usuarioId !== idUsuario) {
        return responseAPI(HttpStatus.UNAUTHORIZED, res, null, 'No tienes permisos para ver esta cuenta');
    }
    let cuenta: any = await Cuenta.findOne({ where: { id: idUsuario } });
    if (cuenta) {
        const data = {
            "nombres": cuenta.nombres,
            "apellidos": cuenta.apellidos,
            "saldo_retirable": cuenta.saldo_retirable,
            "saldo_no_retirable": cuenta.saldo_no_retirable
        }
        return responseAPI(HttpStatus.OK, res, data, 'Cuenta encontrada con exito');
    } else {
        return responseAPI(HttpStatus.NOT_FOUND, res, null, 'Cuenta no encontrada');
    }
}