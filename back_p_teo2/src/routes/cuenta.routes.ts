import { verifyToken } from '../middleware/authMiddleware';
import { Router } from 'express';
import { getCuenta } from '../controllers/cuenta.controller';
const router = Router();

router.get('/cuenta/:idUsuario', verifyToken, getCuenta);

export default router;