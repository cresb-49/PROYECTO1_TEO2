import { Usuario } from '../models/usuario';
import { Request, Response } from "express";
import bcrypt from "bcrypt"
import { Cuenta } from '../models/cuenta';
import { responseAPI } from '../handler/responseAPI';
import { HttpStatus } from '../enums/httpStatus';

export const getUsuarios = async (req: Request, res: Response) => {
    Usuario.findAll()
        .then((value: any[]) => {
            responseAPI(HttpStatus.OK, res, value, "Usuarios encontrados con exito");
        })
        .catch((reason: any) => {
            responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, reason.message, reason.message);
        })
};

export const getUsuario = async (req: Request, res: Response) => {
    const { idUsuario } = req.params;
    Usuario.findByPk(idUsuario)
        .then((value: any) => {
            let data = {
                "nombres": value.nombres,
                "apellidos": value.apellidos,
                "f_nacimiento": value.f_nacimiento,
                "email": value.email
            }
            responseAPI(HttpStatus.OK, res, data, "Usuario encontrado con exito");
        })
        .catch((reason: any) => {
            responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, reason.message, reason.message);
        })
};

export const createUsuario = async (req: Request, res: Response) => {
    const { nombres, apellidos, email, password, f_nacimiento, password2 } = req.body;

    if (!(password === password2)) {
        responseAPI(HttpStatus.BAD_REQUEST, res, null, "Las contrasenas no coinciden");
    } else {
        let nuevaCuenta = {
            "nombres": nombres,
            "apellidos": apellidos,
            "saldo_retirable": 0,
            "saldo_no_retirable": 0
        };
        let nuevoUsuario = {
            "nombres": nombres,
            "apellidos": apellidos,
            "id_cuenta": null,
            "email": email,
            "password": await bcrypt.hash(password, 10),
            "f_nacimiento": f_nacimiento
        };
        Cuenta.create(nuevaCuenta)
            .then(async (cuenta: any) => {
                nuevoUsuario.id_cuenta = cuenta.id;
                Usuario.create(nuevoUsuario)
                    .then((value: any) => {
                        responseAPI(HttpStatus.OK, res, null, "Usuario creado con exito");
                    }).catch((reason: any) => {
                        responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, reason.message, reason.message);
                    })
            })
            .catch((reason: any) => {
                responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, reason.message, reason.message);
            });
    }
};

export const updateUsuario = async (req: Request, res: Response) => {

};

export const deleteUsuario = async (req: Request, res: Response) => {

};