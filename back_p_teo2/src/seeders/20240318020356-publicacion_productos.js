'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let publicaciones = [
      {
        id: 1,
        id_articulo: 2,
        id_tipo_publicacion: 1,
        id_usuario: 4,
        isValidate: true,
        f_validacion: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        id_articulo: 1,
        id_tipo_publicacion: 1,
        id_usuario: 4,
        isValidate: true,
        f_validacion: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        id_articulo: 4,
        id_tipo_publicacion: 1,
        id_usuario: 5,
        isValidate: true,
        f_validacion: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 4,
        id_articulo: 3,
        id_tipo_publicacion: 1,
        id_usuario: 5,
        isValidate: true,
        f_validacion: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 5,
        id_articulo: 7,
        id_tipo_publicacion: 1,
        id_usuario: 5,
        isValidate: true,
        f_validacion: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 6,
        id_articulo: 6,
        id_tipo_publicacion: 1,
        id_usuario: 5,
        isValidate: true,
        f_validacion: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 7,
        id_articulo: 5,
        id_tipo_publicacion: 1,
        id_usuario: 5,
        isValidate: true,
        f_validacion: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 8,
        id_articulo: 8,
        id_tipo_publicacion: 1,
        id_usuario: 5,
        isValidate: true,
        f_validacion: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 9,
        id_articulo: 9,
        id_tipo_publicacion: 1,
        id_usuario: 2,
        isValidate: true,
        f_validacion: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 10,
        id_articulo: 10,
        id_tipo_publicacion: 1,
        id_usuario: 2,
        isValidate: true,
        f_validacion: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 11,
        id_articulo: 11,
        id_tipo_publicacion: 1,
        id_usuario: 2,
        isValidate: true,
        f_validacion: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 12,
        id_articulo: 12,
        id_tipo_publicacion: 1,
        id_usuario: 3,
        isValidate: true,
        f_validacion: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 13,
        id_articulo: 13,
        id_tipo_publicacion: 1,
        id_usuario: 3,
        isValidate: true,
        f_validacion: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      }
    ];
    await queryInterface.bulkInsert('publicacion', publicaciones, {});
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
