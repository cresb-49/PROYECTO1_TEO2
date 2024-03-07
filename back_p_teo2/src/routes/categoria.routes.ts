import { verifyToken } from "../middleware/authMiddleware";
import { Router } from 'express';
import { getCategorias, getCategoria, createCategoria, updateCategoria } from "../controllers/categoria.controller";

const router = Router()

router.get('/categorias/:nombre?', getCategorias);
router.get('/categoria', getCategoria)
router.post('/categoria', createCategoria)
router.put('/categoria/IdCategoria', updateCategoria)


export default router;