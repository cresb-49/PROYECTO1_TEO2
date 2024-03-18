import { verifyToken } from '../middleware/authMiddleware';
import { Router } from 'express';
import { createCompra, getComprasUsuario, getVentasUsuario, getVentasValidar } from '../controllers/buy.controller';
const router = Router();

router.post('/compra', verifyToken, createCompra);
router.get('/compras/usuario', verifyToken, getComprasUsuario);
router.get('/ventas/usuario', verifyToken, getVentasUsuario);
router.get('/ventas/por-validar/usuario', verifyToken, getVentasValidar);

export default router;