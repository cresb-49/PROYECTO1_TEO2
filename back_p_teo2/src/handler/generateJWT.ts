import jwt from 'jsonwebtoken';
import { TokenPayload } from '../middleware/authMiddleware';

// Clave secreta para firmar el token (puedes cambiarla)
const secretKey = 'ItR2z9hm3';

// Función para generar el token de inicio de sesión
export const generarToken = async (usuarioId: string | number) => {
    // Datos que se incluirán en el token
    // Si es de tipo int convertirmos el valor a string
    if (typeof usuarioId === 'number') {
        usuarioId = usuarioId.toString();
    }
    const payload:TokenPayload = {
        usuarioId: usuarioId,
        create_at: new Date().getTime(),
        // Puedes incluir más datos relevantes aquí
    };
    // Se firma el token con la clave secreta y se establece un tiempo de expiración
    const token = jwt.sign(payload, secretKey, { expiresIn: '2h' });
    return token;
}