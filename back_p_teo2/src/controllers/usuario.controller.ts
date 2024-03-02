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

};

export const updateUsuario = async (req: Request, res: Response) => {

};

export const deleteUsuario = async (req: Request, res: Response) => {

};