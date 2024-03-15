import { verifyToken } from '../middleware/authMiddleware';
import { Router } from 'express';
import { createCompra } from '../controllers/compra.controller';
const router = Router();

router.post('/compra', verifyToken, createCompra);

export default router;