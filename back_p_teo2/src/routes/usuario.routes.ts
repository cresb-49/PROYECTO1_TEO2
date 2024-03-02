import { Router } from 'express';
import { getUsuario, getUsuarios, deleteUsuario, updateUsuario, createUsuario } from '../controllers/usuario.controller';
const router = Router();

router.get('/usuarios', getUsuario);

router.get('/usuario/:id', getUsuario);

router.post('/usuario', createUsuario);

router.put('/usuario', updateUsuario);

router.delete('/usuario/:id', deleteUsuario);

export default router;
