import { Usuario } from '../models/usuario';
import { Request, Response } from "express";
import bcrypt from "bcrypt"
import { Cuenta } from '../models/cuenta';

export const getUsuarios = async (req: Request, res: Response) => {
    Usuario.findAll()
        .then((value: any[]) => {
            res.status(200).json(value);
        })
        .catch((reason: any) => {
            res.status(500).json(reason);
        })
};

export const getUsuario = async (req: Request, res: Response) => {

};

export const createUsuario = async (req: Request, res: Response) => {
    const { nombres, apellidos, email, password, f_nacimiento, password2 } = req.body;

    if (!(password === password2)) {
        res.status(400).json({ mensaje: "Las contrasenas no coinciden" })
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
                        res.status(200).json({ mensaje: "Usuario creado con exito" });
                    }).catch((reason: any) => {
                        console.error(reason);
                        res.status(500).json({ mensaje: reason });
                    })
            })
            .catch((reason: any) => {
                console.error(reason);
                res.status(500).json({ mensaje: reason });
            });
    }
};

export const updateUsuario = async (req: Request, res: Response) => {

};

export const deleteUsuario = async (req: Request, res: Response) => {

};