import sequelize from "./database/database";
import express, { Application } from "express";
import bodyParser from "body-parser";
import cors from 'cors'
// import dotenv from 'dotenv';

//Carga de las variables de entorno

// dotenv.config({ path: __dirname + '/.env' });

const app: Application = express();
// Implementacion de body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//Uso de CORS
// const allowedOrigins = ['http://localhost:1420','https://tauri.localhost']
// const allowedOrigins = ['https://tauri.localhost']

const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
    exposedHeaders: 'Content-Disposition',
}
app.use(cors(corsOptions));

// app.use((req, res, next) => {
//     console.log('Origin:', req.headers.origin);
//     next();
// });

// Implementacion de las rutas
import usuarioRoutes from './routes/usuario.routes';
app.use('/api', usuarioRoutes);

import sessionRoutes from './routes/session.routes';
app.use('/api', sessionRoutes);

//Inicio del servidor
const PORT: string | undefined = process.env.SERVER_PORT;
app.listen(PORT, (): void => {
    console.log('SERVIDOR EN EL PUERTO:' + PORT);
});

//Prueba de conexion a la base de datos
async function main() {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
        app.listen(3000, () => {
            console.log("Server is running on port 3000");
        });
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
}

main();