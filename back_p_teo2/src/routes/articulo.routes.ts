import { verifyToken } from "../middleware/authMiddleware";
import { Router } from 'express';
import { getArticulosUsuario, getArticulo, createArticulo, updateArticulo } from "../controllers/articulo.controller";

const router = Router()

router.get('/articulos/usuario', verifyToken, getArticulosUsuario);
router.get('/acticulo', verifyToken, getArticulo)
router.post('/articulo', verifyToken, createArticulo)
router.put('/articulo/:idArticulo', verifyToken, updateArticulo)


export default router;