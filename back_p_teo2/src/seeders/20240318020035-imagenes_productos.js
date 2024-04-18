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
      },
      {
        id_articulo: 5,
        url: 'construccion_imagen.ib64.model',
        prioridad: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id_articulo: 6,
        url: 'reparacion_cel_imagen.ib64.model',
        prioridad: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id_articulo: 7,
        url: 'arboles_imagen.ib64.model',
        prioridad: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id_articulo: 8,
        url: 'limpieza_imagen.ib64.model',
        prioridad: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id_articulo: 9,
        url: 'camara_imagen.ib64.model',
        prioridad: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id_articulo: 10,
        url: 'curso_imagen.ib64.model',
        prioridad: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id_articulo: 11,
        url: 'set_jardin_imagen.ib64.model',
        prioridad: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id_articulo: 12,
        url: 'membrecia_imagen.ib64.model',
        prioridad: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id_articulo: 13,
        url: 'bicicleta_imagen.ib64.model',
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
