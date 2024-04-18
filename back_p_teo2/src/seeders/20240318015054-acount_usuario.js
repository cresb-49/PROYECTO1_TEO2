'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const cuentas = [
      {
        id: 1,
        nombres: 'Carlos',
        apellidos: 'Pac',
        saldo_retirable: 500,
        saldo_no_retirable: 500,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        nombres: 'Benjamin',
        apellidos: 'Flores',
        saldo_retirable: 500,
        saldo_no_retirable: 500,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        nombres: 'Sara',
        apellidos: 'Fransisca',
        saldo_retirable: 500,
        saldo_no_retirable: 500,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 4,
        nombres: 'Jose',
        apellidos: 'Lopez',
        saldo_retirable: 500,
        saldo_no_retirable: 500,
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
