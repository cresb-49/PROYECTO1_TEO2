import { verifyToken } from "../middleware/authMiddleware";
import { isConfirm } from "../middleware/roles.middelware";
import { Router } from 'express';
import { getPublicaciones, getPublicacionesUsuario, createPublicacion, updatePublicacion, getTipoPublicacion, getPublicacion, getPublicacionesPorConfirmar, confirmarPublicacion } from "../controllers/publicacion.controller";

const router = Router()

router.get('/publicaciones', getPublicaciones);
router.get('/publicaciones/sin-confirmar', getPublicacionesPorConfirmar);
router.get('/publicaciones/tipo', getTipoPublicacion);
router.get('/publicaciones/IdUsuario', getPublicacionesUsuario)

router.get('/publicacion/:id', getPublicacion);

router.post('/publicacion', verifyToken, createPublicacion)
router.post('/publicacion/confirmar', verifyToken, isConfirm, confirmarPublicacion)
router.put('/publicacion', updatePublicacion)


export default router;