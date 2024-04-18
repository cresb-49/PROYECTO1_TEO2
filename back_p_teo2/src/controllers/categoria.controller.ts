import { Request, Response } from 'express';
import { responseAPI } from '../handler/responseAPI';
import { HttpStatus } from '../enums/httpStatus';
import { Category } from '../models/category';
import { Op } from 'sequelize';
import sequelize from '../database/database';

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

export const updatePorcentajeCategoria = async (req: Request, res: Response) => {
    const { id_categoria, porcentaje } = req.body;
    const valorPorcentual = parseInt(porcentaje);
    //Obtenemos la categoria
    let cat: any = await Category.findByPk(id_categoria);
    if (cat === null) {
        return responseAPI(HttpStatus.NOT_FOUND, res, null, "Categoria no encontrada","Categoria no encontrada");
    }
    //Verificamos que el porcentaje sea un numero
    if (isNaN(valorPorcentual)) {
        return responseAPI(HttpStatus.BAD_REQUEST, res, null, "El porcentaje debe ser un numero","El porcentaje debe ser un numero");
    }
    //Verificamos que el porcentaje sea mayor a 0 y menor a 100
    if (valorPorcentual < 0 || valorPorcentual > 100) {
        return responseAPI(HttpStatus.BAD_REQUEST, res, null, "El porcentaje debe ser mayor a 0 y menor a 100","El porcentaje debe ser mayor a 0 y menor a 100");
    }
    //Actualizamos el porcentaje y lo devolvemos
    cat.porcentaje_ganancias = valorPorcentual;
    //Generamos una transaccion
    const t = await sequelize.transaction();
    try {
        await cat.save({ transaction: t });
        return responseAPI(HttpStatus.OK, res, cat, "Porcentaje actualizado");
    } catch (error) {
        return responseAPI(HttpStatus.INTERNAL_SERVER_ERROR, res, null, error.message, error.message);
    }
}

export const updateRecompenzaCategoria = async (req: Request, res: Response) => {

};

export const getCategoria = async (req: Request, res: Response) => {

};

export const createCategoria = async (req: Request, res: Response) => {

};

export const updateCategoria = async (req: Request, res: Response) => {

};

export const deleteCategoria = async (req: Request, res: Response) => {

};