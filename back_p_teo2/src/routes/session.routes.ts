import { Router } from 'express';
import { login } from '../controllers/session.controller';
const router = Router();

router.post('/login', login);

export default router;