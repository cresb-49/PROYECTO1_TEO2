## COMANDOS DE SEQUELIZE
Todos estos comandos deben ser ejcutados en el carpeta 'src' de backend del proyecto
### CREAR UN SEEDER
```bash
npx sequelize seed:generate --name demo-user
```
### CREAR UNA MIGRACION
```bash
npx sequelize migration:create --name demo-user
```
### CORRER LAS MIGRACIONES
```bash
npx sequelize db:migrate
```