import { Router } from 'express';
import { verifyToken } from '../middleware/authMiddleware';
import { getUsuario, getUsuarios, deleteUsuario, updateUsuarioEmail, updateUsuarioPassword, createUsuario } from '../controllers/usuario.controller';
const router = Router();

router.get('/usuarios', getUsuarios);

router.get('/usuario/:idUsuario', verifyToken, getUsuario);

router.post('/usuario', createUsuario);

router.put('/usuario/email/:idUsuario', verifyToken, updateUsuarioEmail);
router.put('/usuario/password/:idUsuario', verifyToken, updateUsuarioPassword);

router.delete('/usuario/:id', deleteUsuario);

export default router;
