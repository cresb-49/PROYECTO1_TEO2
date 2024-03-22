import { verifyToken } from "../middleware/authMiddleware";
import { Router } from 'express';
import { getChatsUsuario, getChat, getMensajesChat, eliminarChat, getChatById, sendMessageChat } from "../controllers/chat.controller";
import { buscarContacto } from "../controllers/usuario.controller";
//Tanto el Router como el controller tambien manejan la logica de los mensajes de los chats
const router = Router()
router.get('/chats', verifyToken, getChatsUsuario);
router.post('/chat', verifyToken, getChat);
router.post('/chat/id', verifyToken, getChatById);
router.delete('/chat', verifyToken, eliminarChat);
router.post('/chat/mensajes', verifyToken, getMensajesChat);
router.post('/chat/send', verifyToken, sendMessageChat);
router.post('/chat/contacto', verifyToken, buscarContacto);
export default router;