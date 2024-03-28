'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let articulos = [
      {
        id: 1,
        nombre: 'Tablet Amazon Fire HD 8',
        valor: 200,
        descripcion: 'Tablet Amazon Fire HD 8, pantalla HD de 8 pul gadas, 32 GB',
        id_categoria: 1,
        id_usuario: 4,
        cantidad: 20,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        nombre: 'Reloj inteligente',
        valor: 100,
        descripcion: 'Reloj inteligente Xiaomi Mi Band 6, pantalla AMOLED de 1.56 pulgadas, 30 modos de entrenamiento',
        id_categoria: 1,
        id_usuario: 4,
        cantidad: 20,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        nombre: 'Alexa Echo Dot',
        valor: 150,
        descripcion: 'Alexa Echo Dot (4ta generación), altavoz inteligente con reloj y Alexa, color blanco',
        id_categoria: 1,
        id_usuario: 5,
        cantidad: 20,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 4,
        nombre: 'Laptop HP',
        valor: 1100,
        descripcion: 'Laptop HP 15-dy2021nr, pantalla HD de 15.6 pulgadas, 8 GB de RAM, 256 GB de almacenamiento',
        id_categoria: 1,
        id_usuario: 5,
        cantidad: 20,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 5,
        nombre: 'Trabajo de construcción',
        valor: 0,
        recompenza: 2500,
        descripcion: 'Trabajo de construcción en una plaza comercial, se necesita de una persona para cubrir el puesto por el momento',
        id_categoria: 2,
        id_usuario: 5,
        creditos_retirables_asignados: 2500,
        creditos_no_retirables_asignados: 0,
        cantidad: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 6,
        nombre: 'Servicio de Reparación de celulares',
        valor: 300,
        descripcion: 'Servicio de Reparación de celulares',
        id_categoria: 4,
        id_usuario: 5,
        creditos_retirables_asignados: 0,
        creditos_no_retirables_asignados: 0,
        cantidad: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 7,
        nombre: 'Sembrar Arboles',
        valor: 0,
        recompenza: 150,
        descripcion: 'Siembra de arboles en Cerro el Baúl Quetzaltenango',
        id_categoria: 3,
        id_usuario: 5,
        creditos_retirables_asignados: 150,
        creditos_no_retirables_asignados: 0,
        cantidad: 1,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];
    await queryInterface.bulkInsert('articulo', articulos, {});
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
