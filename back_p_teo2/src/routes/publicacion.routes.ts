import { verifyToken } from "../middleware/authMiddleware";
import { isAdmin, isConfirm } from "../middleware/roles.middelware";
import { Router } from 'express';
import { getPublicaciones, getPublicacionesUsuario, createPublicacion, getTipoPublicacion, getPublicacion, getPublicacionesPorConfirmar, confirmarPublicacion, reportarPublicacion, getPublicacionesReportadas, rechazarReportes, eliminarReporte, banearPublicacion, getPublicacionesTrabajosVoluntariados } from "../controllers/publicacion.controller";

const router = Router()

router.get('/publicaciones', getPublicaciones);
router.get('/publicaciones/sin-confirmar', getPublicacionesPorConfirmar);
router.get('/publicaciones/reportadas', verifyToken, isAdmin, getPublicacionesReportadas);
router.get('/publicaciones/tipo', getTipoPublicacion);
router.get('/publicaciones/IdUsuario', getPublicacionesUsuario)

router.get('/publicaciones/trabajos-voluntariados', verifyToken, getPublicacionesTrabajosVoluntariados);

router.get('/publicacion/:id', getPublicacion);

router.post('/publicacion', verifyToken, createPublicacion)
router.post('/publicacion/confirmar', verifyToken, isConfirm, confirmarPublicacion)
router.post('/publicacion/reportar', verifyToken, reportarPublicacion)
// router.put('/publicacion', updatePublicacion)
router.post('/publicacion/rechazar-reportes', verifyToken, isAdmin, rechazarReportes)
router.delete('/reporte/:idReporte', verifyToken, isAdmin, eliminarReporte)
router.post('/publicacion/banear', verifyToken, isAdmin, banearPublicacion)

export default router;