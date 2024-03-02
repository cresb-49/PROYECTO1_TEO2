import app from "./app";
import sequelize from "./database/database";
import { Rol } from "./models/rol";

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
    let result = Rol.create({
        nombre: "Administrador"
    });
    console.log(result);
}

main();