'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transaccion', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_cuenta_origen: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'cuenta',
          key: 'id'
        }
      },
      id_cuenta_destino: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'cuenta',
          key: 'id'
        }
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
    await queryInterface.dropTable('transaccion');
  }
};