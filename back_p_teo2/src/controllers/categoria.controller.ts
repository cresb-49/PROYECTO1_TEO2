import { Request, Response } from 'express';
import { responseAPI } from '../handler/responseAPI';
import { HttpStatus } from '../enums/httpStatus';
import { Category } from '../models/category';
import { Op } from 'sequelize';

export const getCategorias = async (req: Request, res: Response) => {
    const { nombre } = req.params
    console.log(nombre);
    
    let valor = ""
    if (nombre) {
        valor = nombre;
    }
    valor = valor.trim();
    if (valor.length === 0) {
        Category.findAll()
            .then((value: any[]) => {
                return responseAPI(HttpStatus.OK, res, value, "Categorias encontradas");
            })
            .catch((reason: any) => {
                return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, reason.message, reason.message);
            })
    } else {
        Category.findAll({
            where: {
                nombre: {
                    [Op.like]: `%${nombre}%`
                }
            }
        })
            .then((value: any[]) => {
                return responseAPI(HttpStatus.OK, res, value, "Categorias encontradas");
            })
            .catch((reason: any) => {
                return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, reason.message, reason.message);
            })
    }


};

export const getCategoria = async (req: Request, res: Response) => {

};

export const createCategoria = async (req: Request, res: Response) => {

};

export const updateCategoria = async (req: Request, res: Response) => {

};

export const deleteCategoria = async (req: Request, res: Response) => {

};