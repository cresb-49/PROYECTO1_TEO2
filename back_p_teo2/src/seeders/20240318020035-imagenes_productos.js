'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let images = [
      {
        id_articulo: 1,
        url: 'tablet_imagen.ib64.model',
        prioridad: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id_articulo: 2,
        url: 'reloj_imagen.ib64.model',
        prioridad: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id_articulo: 3,
        url: 'bocina_imagen.ib64.model',
        prioridad: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id_articulo: 4,
        url: 'laptop_imagen.ib64.model',
        prioridad: 1,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];
    await queryInterface.bulkInsert('image', images, {});
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
