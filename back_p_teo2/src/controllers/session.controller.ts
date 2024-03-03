import { Usuario } from "../models/usuario";
import { Request, Response } from "express";
import { Session } from "../models/session";
import bcrypt from "bcrypt"
import { generarToken } from "../handler/generateJWT";
import { Rol } from "../models/rol";
import { UsuarioRol } from "../models/usuario_rol";

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    Usuario.findOne({
        where: {
            email: email
        }
    })
        .then(async (usuario: any) => {
            if (usuario) {
                if (await bcrypt.compare(password, usuario.password)) {
                    //Creamos una session o modificamos la ya existene
                    let session = await Session.findOne({
                        where: {
                            id_usuario: usuario.id
                        }
                    });
                    //Generamos un token para el usuario de inicio de session
                    let token = await generarToken(usuario.id);
                    // Generamos la fecha actual
                    let fecha_validez = new Date();
                    // Añadimos 2 horas a la fecha actual
                    fecha_validez.setHours(fecha_validez.getHours() + 2);
                    if (session) {
                        session.update({
                            token: token,
                            f_validez: fecha_validez
                        });
                    } else {
                        session = await Session.create({
                            id_usuario: usuario.id,
                            token: token,
                            f_validez: fecha_validez
                        });
                    }
                    res.status(200).json(
                        {
                            data: {
                                token: token,
                                id_usuario: usuario.id,
                            },
                            mensaje: "Usuario logueado con exito"
                        });
                } else {
                    res.status(400).json({ mensaje: "Contrasena incorrecta" });
                }
            } else {
                res.status(400).json({ mensaje: "Usuario no encontrado" });
            }
        })
        .catch((reason: any) => {
            console.error(reason);
            res.status(500).json({ mensaje: reason.message });
        });


    console.log(email, password);
};
