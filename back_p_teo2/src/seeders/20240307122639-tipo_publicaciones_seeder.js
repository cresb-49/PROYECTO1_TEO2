'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let tipo_publicacion = [
      {
        tipo: "normal",
      },
      {
        tipo: "voluntariado",
      }
    ];
    await queryInterface.bulkInsert('tipo_publicacion', tipo_publicacion, {});
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
