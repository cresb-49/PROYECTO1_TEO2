'use strict';
const bcrypt = require('bcrypt');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    //Codigo para comparacion
    // const isMatch = await bcrypt.compare(plainTextPassword, hashedPasswordFromDatabase);

    let usuarios = [
      {
        id: 1,
        nombres: 'admin',
        apellidos: 'admin',
        f_nacimiento: '2022-03-02',
        email: 'admin@admin.com',
        password: await bcrypt.hash('password', 10),
        created_at: new Date(),
        updated_at: new Date(),
      }, {
        id: 2,
        nombres: 'Jose',
        apellidos: 'Lopez',
        f_nacimiento: '2022-03-02',
        email: 'josel@gmail.com',
        password: await bcrypt.hash('12345', 10),
        created_at: new Date(),
        updated_at: new Date(),
      },{
        id: 3,
        nombres: 'Sara',
        apellidos: 'Fransisca',
        f_nacimiento: '2022-03-02',
        email: 'saraf@gmail.com',
        password: await bcrypt.hash('12345', 10),
        id_cuenta: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },{
        id: 4,
        nombres: 'Carlos',
        apellidos: 'Pac',
        f_nacimiento: '1999-04-09',
        email: 'carlospac@gmail.com',
        password: await bcrypt.hash('12345', 10),
        id_cuenta: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },{
        id: 5,
        nombres: 'Benjamin',
        apellidos: 'Flores',
        f_nacimiento: '1999-04-09',
        email: 'benf@gmail.com',
        password: await bcrypt.hash('12345', 10),
        id_cuenta: 2,
        created_at: new Date(),
        updated_at: new Date(),
      }
    ];
    await queryInterface.bulkInsert('usuario', usuarios, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
