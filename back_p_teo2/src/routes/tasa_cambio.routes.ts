import { Router } from 'express';
import { verifyToken } from '../middleware/authMiddleware';
import { isAdmin } from '../middleware/roles.middelware';
import { getTasa, updateTasa } from '../controllers/tasa_cambio.controller';

const tasaCambioRoutes = Router();

tasaCambioRoutes.get('/tasa', getTasa);
tasaCambioRoutes.put('/tasa', verifyToken, isAdmin, updateTasa);

export default tasaCambioRoutes;