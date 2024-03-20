import { Usuario } from '../models/usuario';
import { Request, Response } from "express";
import bcrypt from "bcrypt"
import { Acount } from '../models/acount';
import { responseAPI } from '../handler/responseAPI';
import { HttpStatus } from '../enums/httpStatus';
import { UsuarioRol } from '../models/usuario_rol';
import { Op } from 'sequelize';

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
    const { nombres, apellidos, email, password, f_nacimiento, password2, rol } = req.body;

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

        if (rol !== undefined && rol === 0) {
            Acount.create(nuevaCuenta)
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
        } else {
            if (rol === undefined) {
                responseAPI(HttpStatus.BAD_REQUEST, res, null, "El rol no puede estar vacio");
            }
            Usuario.create(nuevoUsuario)
                .then((value: any) => {
                    UsuarioRol.create({ id_rol: rol, id_usuario: value.id }).then((value: any) => {
                        responseAPI(HttpStatus.OK, res, null, "Usuario creado con exito");
                    }).catch((reason: any) => {
                        responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, reason.message, reason.message);
                    });
                }).catch((reason: any) => {
                    responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, reason.message, reason.message);
                });
        }
    }
};

export const updateUsuarioEmail = async (req: Request, res: Response) => {
    //validamos que el token el id del usuario sea el mismo que el id del usuario a modificar
    const { tokenPayload } = req;
    const { idUsuario } = req.params;

    if (tokenPayload.usuarioId !== idUsuario) {
        return responseAPI(HttpStatus.UNAUTHORIZED, res, null, 'No tienes permisos para modificar este usuario');
    }
    //obtenemos el nuevo email del formulario
    const { email } = req.body;
    //verificamos que el campo no este vacio
    if (email === "" || email === null) {
        return responseAPI(HttpStatus.BAD_REQUEST, res, null, "El email no puede estar vacio", "El email no puede estar vacio");
    }
    //actualizamos el email del usuario
    Usuario.update({ "email": email }, { where: { id: idUsuario } })
        .then((value: any) => {
            responseAPI(HttpStatus.OK, res, null, "Email actualizado con exito");
        })
        .catch((reason: any) => {
            responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, "Error al actualizar el email", "Error al actualizar el email", null, [reason.message]);
        });
};

export const updateUsuarioPassword = async (req: Request, res: Response) => {
    //validamos que el token el id del usuario sea el mismo que el id del usuario a modificar
    const { tokenPayload } = req;
    const { idUsuario } = req.params;
    if (tokenPayload.usuarioId !== idUsuario) {
        return responseAPI(HttpStatus.UNAUTHORIZED, res, null, 'No tienes permisos para modificar este usuario');
    }
    //obtenemos el nuevo password y la confirmacion del password del formulario
    const { password, password2, password3 } = req.body;
    //verificamos que los campos no esten vacios
    if (password === "" || password === null) {
        return responseAPI(HttpStatus.BAD_REQUEST, res, null, "La contraseña Actual no puede estar vacia", "La contraseña Actual no puede estar vacia");
    }
    if (password2 === "" || password2 === null) {
        return responseAPI(HttpStatus.BAD_REQUEST, res, null, "La nueva contraseña no puede estar vacia", "La nueva contraseña no puede estar vacia");
    }
    if (password3 === "" || password3 === null) {
        return responseAPI(HttpStatus.BAD_REQUEST, res, null, "La confirmacion de la nueva contraseña no puede estar vacia", "La confirmacion de la nueva contraseña no puede estar vacia");
    }
    //validamos que password sea igual a la password que ya tiene el usuario
    const usuario: any = await Usuario.findByPk(idUsuario);
    const validPassword = await bcrypt.compare(password, usuario.password);
    if (!validPassword) {
        return responseAPI(HttpStatus.BAD_REQUEST, res, null, "El password no coincide con el password actual");
    }
    //validamos que password2 sea igual a password3
    if (!(password2 === password3)) {
        return responseAPI(HttpStatus.BAD_REQUEST, res, null, "Las contrasenas no coinciden");
    }
    //actualizamos el password del usuario
    Usuario.update({ "password": await bcrypt.hash(password2, 10) }, { where: { id: idUsuario } })
        .then((value: any) => {
            responseAPI(HttpStatus.OK, res, null, "Password actualizado con exito");
        })
        .catch((reason: any) => {
            responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, "Error al actualizar el password", "Error al actualizar el password", null, [reason.message]);
        });
};

export const deleteUsuario = async (req: Request, res: Response) => {

};

export const buscarContacto = async (req: Request, res: Response) => {
    const { email_name } = req.body;
    //Buscamos el usuario por email o por nombre mediante like
    //Hacemos un group by para que no se repitan los usuarios
    Usuario.findAll({
        where: {
            [Op.or]: [
                { email: { [Op.like]: `%${email_name}%` } },
                { nombres: { [Op.like]: `%${email_name}%` } }
            ]
        },
        attributes: ['id', 'nombres', 'apellidos', 'email'],
        group: ['id']
    })
        .then((usuarios: any) => {
            return responseAPI(HttpStatus.OK, res, usuarios, 'Usuarios encontrados con exito');
        })
        .catch((error: any) => {
            return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, 'Error al obtener usuarios', error.message);
        });
};