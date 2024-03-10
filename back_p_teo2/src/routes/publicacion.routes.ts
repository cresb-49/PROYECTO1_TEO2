import { verifyToken } from "../middleware/authMiddleware";
import { Router } from 'express';
import { getPublicaciones, getPublicacionesUsuario, createPublicacion, updatePublicacion, getTipoPublicacion } from "../controllers/publicacion.controller";

const router = Router()

router.get('/publicaciones', getPublicaciones);
router.get('/publicaciones/tipo', getTipoPublicacion);
router.get('/publicaciones/IdUsuario', getPublicacionesUsuario)
router.post('/publicacion/:idArticulo',verifyToken, createPublicacion)
router.put('/publicacion/IdUsuario', updatePublicacion)


export default router;