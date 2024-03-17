import { verifyToken } from "../middleware/authMiddleware";
import { Router } from 'express';
import { getArticulosUsuario, getArticulo, createArticulo, updateArticulo, getArticulosUsuarioSinPublicar, getArticulosPublicados } from "../controllers/articulo.controller";

const router = Router()

router.get('/articulos/usuario', verifyToken, getArticulosUsuario);
router.get('/articulos/usuario/sin-publicar', verifyToken, getArticulosUsuarioSinPublicar);
router.get('/articulos/usuario/publicados', verifyToken, getArticulosPublicados);
router.post('/articulo', verifyToken, createArticulo)
router.get('/articulo/:idArticulo', verifyToken, getArticulo)
router.put('/articulo/:idArticulo', verifyToken, updateArticulo)


export default router;