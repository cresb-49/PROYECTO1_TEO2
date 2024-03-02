'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let roles = [
      {
        nombre: 'admin',
      },
      {
        nombre: 'vendedor',
      },
      {
        nombre: 'categorias',
      }
    ];
    roles.forEach(roles => {
      roles.created_at = new Date();
      roles.updated_at = new Date();
      roles.deleted_at = null;
    });
    await queryInterface.bulkInsert('rol', roles, {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
