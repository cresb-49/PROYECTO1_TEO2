import { verifyToken } from '../middleware/authMiddleware';
import { Router } from 'express';
import { aceptarSolicitud, createCompra, getCompraValidar, getComprasUsuario, getVentasUsuario, getVentasValidar, getVentasValidarTrabajosVoluntariados, rechazarCompra, rechazarSolicitud, validarCompra } from '../controllers/buy.controller';
const router = Router();

router.post('/compra', verifyToken, createCompra);
router.get('/compras/usuario', verifyToken, getComprasUsuario);
router.get('/ventas/usuario', verifyToken, getVentasUsuario);
router.put('/ventas/aceptar-intercambio/:idCompra', verifyToken, validarCompra);
router.put('/ventas/rechazar-intercambio/:idCompra', verifyToken, rechazarCompra);

router.put('/ventas/aceptar-solicitud/:idCompra', verifyToken, aceptarSolicitud);
router.put('/ventas/rechazar-solicitud/:idCompra', verifyToken, rechazarSolicitud);

router.get('/ventas/por-validar/usuario', verifyToken, getVentasValidar);
router.get('/ventas/por-validar/usuario/comprador', verifyToken, getCompraValidar);
router.get('/ventas/solicitudes/por-validar/usuario', verifyToken, getVentasValidarTrabajosVoluntariados);

export default router;