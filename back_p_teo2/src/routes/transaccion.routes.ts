import { verifyToken } from "../middleware/authMiddleware";
import { Router } from 'express';
import { buyCreditos, retirarCreditos, getTransaccionesUsuario } from "../controllers/transaccion.controller";

const router = Router()

router.get('/transaccion/usuario', verifyToken, getTransaccionesUsuario)
router.post('/transaccion/comprar-creditos', verifyToken, buyCreditos)
router.post('/transaccion/retirar-creditos', verifyToken, retirarCreditos)

export default router;