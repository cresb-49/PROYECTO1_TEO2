import { verifyToken } from "../middleware/authMiddleware";
import { Router } from 'express';
import { getImagen } from "../middleware/image.midelware";

const router = Router()

router.get('/image', getImagen);

export default router;