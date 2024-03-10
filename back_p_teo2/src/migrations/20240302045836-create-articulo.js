'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('articulo', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombre: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      valor: {
        type: Sequelize.DECIMAL(8,2),
        allowNull: false
      },
      descripcion: {
        type: Sequelize.TEXT
      },
      id_categoria: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'category',
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
      f_desactivado: {
        type: Sequelize.DATE
      },
      cantidad: {
        type: Sequelize.INTEGER
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('articulo');
  }
};