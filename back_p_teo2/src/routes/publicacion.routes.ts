import { verifyToken } from "../middleware/authMiddleware";
import { Router } from 'express';
import { getPublicaciones, getPublicacionesUsuario, createPublicacion, updatePublicacion, getTipoPublicacion } from "../controllers/publicacion.controller";

const router = Router()

router.get('/publicaciones', getPublicaciones);
router.get('/publicaciones/tipo', getTipoPublicacion);
router.get('/publicaciones/IdUsuario', getPublicacionesUsuario)

router.post('/publicacion',verifyToken, createPublicacion)
router.put('/publicacion', updatePublicacion)


export default router;