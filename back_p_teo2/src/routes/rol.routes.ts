import { Router } from 'express';
import { verifyToken } from '../middleware/authMiddleware';
import { isAdmin } from '../middleware/roles.middelware';
import { getRoles } from '../controllers/rol.controller';
const router = Router();

router.get('/roles', verifyToken, isAdmin, getRoles);

export default router;
