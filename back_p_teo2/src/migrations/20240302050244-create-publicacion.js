'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('publicacion', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_articulo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'articulo',
          key: 'id'
        }
      },
      id_tipo_publicacion: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tipo_publicacion',
          key: 'id'
        }
      },
      id_usuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuario',
          key: 'id'
        }
      },
      isValidate: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      f_validacion: {
        type: Sequelize.DATE
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deleted_at: {
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('publicacion');
  }
};