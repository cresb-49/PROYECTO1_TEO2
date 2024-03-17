import { verifyToken } from "../middleware/authMiddleware";
import { Router } from 'express';
import { getImagen, getImagenb64 } from "../middleware/image.midelware";

const router = Router()

router.get('/image', getImagen);
router.get('/image/b64', getImagenb64);

export default router;