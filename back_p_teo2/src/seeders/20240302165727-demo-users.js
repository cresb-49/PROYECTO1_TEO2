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
