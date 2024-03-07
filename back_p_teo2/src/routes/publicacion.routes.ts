import { verifyToken } from "../middleware/authMiddleware";
import { Router } from 'express';
import { getPublicaciones, getPublicacionesUsuario, createPublicacion, updatePublicacion } from "../controllers/publicacion.controller";

const router = Router()

router.get('/publicaciones', getPublicaciones);
router.get('/publicaciones/IdUsuario', getPublicacionesUsuario)
router.post('/publicacion/IdUsuario', createPublicacion)
router.put('/publicacion/IdUsuario', updatePublicacion)


export default router;