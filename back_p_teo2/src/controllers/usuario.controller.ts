import {Usuario} from '../models/usuario';

export const getUsuarios = async (req: Request, res: Response) => {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
};

export const getUsuario = async (req: Request, res: Response) => {

};

export const createUsuario = async (req: Request, res: Response) => {

};

export const updateUsuario = async (req: Request, res: Response) => {

};

export const deleteUsuario = async (req: Request, res: Response) => {

};