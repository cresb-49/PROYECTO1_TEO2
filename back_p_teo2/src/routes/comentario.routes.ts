import { getComentariosPublicacion, createComentario } from "../controllers/comentario.controller";
import { verifyToken } from "../middleware/authMiddleware";
import { Router } from 'express';


const router = Router()

router.get('/comentarios/publicacion/:idPublicacion', getComentariosPublicacion);
router.post('/comentario/publicacion', verifyToken, createComentario);


export default router;