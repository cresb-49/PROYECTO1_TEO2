'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('usuario', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombres: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      apellidos: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      f_nacimiento: {
        type: Sequelize.DATE,
        allowNull: false
      },
      id_cuenta: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'acount',
          key: 'id'
        }
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      password: {
        type: Sequelize.STRING(100),
        allowNull: false
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
    await queryInterface.dropTable('usuario');
  }
};