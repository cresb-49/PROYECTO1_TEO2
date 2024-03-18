'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let usuario_rol = [
      {
        id_usuario: 1,
        id_rol: 1
      }, {
        id_usuario: 1,
        id_rol: 2
      }, {
        id_usuario: 1,
        id_rol: 3
      }
    ];
    await queryInterface.bulkInsert('usuario_rol', usuario_rol, {});
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
