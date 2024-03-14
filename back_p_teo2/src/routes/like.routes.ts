import { createLike, deleteLike, getLikePublicacion, getLikesPublicacion, updateLike } from "../controllers/like.controller";
import { verifyToken } from "../middleware/authMiddleware";
import { Router } from 'express';


const router = Router();

router.get('/likes/publicacion/:idPublicacion', getLikesPublicacion);
router.get('/like/usuario/publicacion/:idPublicacion', verifyToken, getLikePublicacion);
router.post('/like/publicacion', verifyToken, createLike);
router.put('/like/publicacion', verifyToken, updateLike);
router.delete('/like/publicacion/:idPublicacion', verifyToken, deleteLike);

export default router;