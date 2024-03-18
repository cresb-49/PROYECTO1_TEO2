'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const cuentas = [
      {
        id: 1,
        nombres: 'Carlos',
        apellidos: 'Pac',
        saldo_retirable: 0,
        saldo_no_retirable: 0,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        nombres: 'Carlos',
        apellidos: 'Pac',
        saldo_retirable: 0,
        saldo_no_retirable: 0,
        created_at: new Date(),
        updated_at: new Date(),
      }
    ];
    await queryInterface.bulkInsert('acount', cuentas, {});
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
