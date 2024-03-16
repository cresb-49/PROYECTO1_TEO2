'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('buy_transaccion', {
      id_buy: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'buy',
          key: 'id'
        }
      },
      id_transaccion: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'transaccion',
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
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('buy_transaccion'); 
  }
};
