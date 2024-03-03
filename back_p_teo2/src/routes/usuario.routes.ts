import { Router } from 'express';
import { verifyToken } from '../middleware/authMiddleware';
import { getUsuario, getUsuarios, deleteUsuario, updateUsuario, createUsuario } from '../controllers/usuario.controller';
const router = Router();

router.get('/usuarios', getUsuarios);

router.get('/usuario/:idUsuario', verifyToken, getUsuario);

router.post('/usuario', createUsuario);

router.put('/usuario', updateUsuario);

router.delete('/usuario/:id', deleteUsuario);

export default router;
