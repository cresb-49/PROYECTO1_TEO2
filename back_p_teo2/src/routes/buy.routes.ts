import { verifyToken } from '../middleware/authMiddleware';
import { Router } from 'express';
import { createCompra, getComprasUsuario, getVentasUsuario, getVentasValidar, rechazarCompra, validarCompra } from '../controllers/buy.controller';
const router = Router();

router.post('/compra', verifyToken, createCompra);
router.get('/compras/usuario', verifyToken, getComprasUsuario);
router.get('/ventas/usuario', verifyToken, getVentasUsuario);
router.put('/ventas/aceptar-intercambio/:idCompra', verifyToken, validarCompra);
router.put('/ventas/rechazar-intercambio/:idCompra', verifyToken, rechazarCompra);
router.get('/ventas/por-validar/usuario', verifyToken, getVentasValidar);

export default router;