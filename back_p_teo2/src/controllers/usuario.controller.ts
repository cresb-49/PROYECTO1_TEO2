import { Usuario } from '../models/usuario';
import { Request, Response } from "express";

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
    const nuevoUsuario = {
        nombres,
        apellidos,
        email,
        password,
        f_nacimiento,
        password2
    };
    console.log(nuevoUsuario);
    
};

export const updateUsuario = async (req: Request, res: Response) => {

};

export const deleteUsuario = async (req: Request, res: Response) => {

};