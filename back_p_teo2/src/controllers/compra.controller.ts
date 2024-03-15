import { Request, Response } from 'express';
import { responseAPI } from '../handler/responseAPI';
import { HttpStatus } from '../enums/httpStatus';
import { Publicacion } from '../models/publicacion';
import { Articulo } from '../models/articulo';
import { Category } from '../models/category';


export const createCompra = async (req: Request, res: Response) => {
    const { tokenPayload } = req;
    const { id_publicacion, creditos, articulo_cambio, cantidad } = req.body;
    const id_usuario = tokenPayload.usuarioId;
    console.log('id_publicacion', id_publicacion);
    console.log('creditos', creditos);
    console.log('articulo_cambio', articulo_cambio);
    console.log('cantidad', cantidad);
    console.log('id_usuario', id_usuario);

    if (cantidad < 1) {
        return responseAPI(HttpStatus.BAD_REQUEST, res, null, "Cantidad invalida del producto a comprar", "Cantidad invalida del producto a comprar");
    }
    //Ahora sumamos la cantidad de creditos y valor de producto a comprar
    let total_creditos = 0;
    let articulo_intercambiar = null;
    // articulo_cambio { id_articulo: num, cantidad_articulo: num }
    if (articulo_cambio.cantidad_articulo > 0) {
        articulo_intercambiar = await Articulo.findByPk(articulo_cambio.id_articulo);
        if (articulo_intercambiar === null) {
            return responseAPI(HttpStatus.NOT_FOUND, res, null, "Articulo de intercambio no existe", "El articulo de intercambio no existe");
        }
        total_creditos = total_creditos + (parseFloat(articulo_intercambiar.valor) * parseFloat(articulo_cambio.cantidad_articulo));
    }
    // creditos { retirables: num, no_retirables: num }
    total_creditos = total_creditos + parseFloat(creditos.retirables) + parseFloat(creditos.no_retirables);
    console.log('total_creditos', total_creditos);

    //Obtenemos la publicacion con su respectivo articulo
    let publicacion: any = await Publicacion.findByPk(id_publicacion, {
        include: [
            {
                model: Articulo,
                required: true,
                include: [
                    {
                        model: Category,
                        required: false
                    }
                ]
            }
        ]
    });
    if (publicacion === null) {
        return responseAPI(HttpStatus.NOT_FOUND, res, null, "Publicacion no encontrada", "La publicacion no existe");
    }
    let articulo = publicacion.articulo;
    if (articulo === null) {
        return responseAPI(HttpStatus.NOT_FOUND, res, null, "Articulo no encontrado", "El articulo no existe");
    }
    let valor_compra = parseFloat(articulo.valor) * parseFloat(cantidad);
    if (valor_compra > total_creditos) {
        return responseAPI(HttpStatus.BAD_REQUEST, res, null, "Creditos insuficientes", "No tienes suficientes creditos para realizar esta compra");
    } else if (valor_compra < total_creditos) {
        return responseAPI(HttpStatus.BAD_REQUEST, res, null, "Creditos excedentes", "Tienes creditos excedentes para realizar esta compra");
    }
    return responseAPI(HttpStatus.OK, res, publicacion, "Publicacion encontrada con exito");
}