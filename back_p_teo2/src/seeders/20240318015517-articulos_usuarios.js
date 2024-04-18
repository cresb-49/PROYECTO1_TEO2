'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let articulos = [
      {
        id: 1,
        nombre: 'Tablet Amazon Fire HD 8',
        valor: 200,
        valor_entrada: 0,
        recompenza: 0,
        creditos_retirables_asignados: 0,
        creditos_no_retirables_asignados: 0,
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
        valor_entrada: 0,
        recompenza: 0,
        creditos_retirables_asignados: 0,
        creditos_no_retirables_asignados: 0,
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
        valor_entrada: 0,
        recompenza: 0,
        creditos_retirables_asignados: 0,
        creditos_no_retirables_asignados: 0,
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
        valor_entrada: 0,
        recompenza: 0,
        creditos_retirables_asignados: 0,
        creditos_no_retirables_asignados: 0,
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
        valor_entrada: 0,
        recompenza: 2500,
        creditos_retirables_asignados: 2000,
        creditos_no_retirables_asignados: 500,
        descripcion: 'Trabajo de construcción en una plaza comercial, se necesita de una persona para cubrir el puesto por el momento',
        id_categoria: 2,
        id_usuario: 5,
        cantidad: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 6,
        nombre: 'Servicio de Reparación de celulares',
        valor: 300,
        valor_entrada: 0,
        recompenza: 0,
        creditos_retirables_asignados: 0,
        creditos_no_retirables_asignados: 0,
        descripcion: 'Servicio de Reparación de celulares',
        id_categoria: 4,
        id_usuario: 5,
        cantidad: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 7,
        nombre: 'Sembrar Arboles',
        valor: 0,
        valor_entrada: 0,
        recompenza: 150,
        creditos_retirables_asignados: 125,
        creditos_no_retirables_asignados: 25,
        descripcion: 'Siembra de arboles en Cerro el Baúl Quetzaltenango',
        id_categoria: 3,
        id_usuario: 5,
        cantidad: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 8,
        nombre: 'Limpieza del Campo',
        valor: 0,
        valor_entrada: 10,
        recompenza: 25,
        creditos_retirables_asignados: 20,
        creditos_no_retirables_asignados: 5,
        descripcion: 'Limpieza de un campo recreativo usado el fin de semana, con el motivo de ayudar al sector en la prevención de enfermedades',
        id_categoria: 3,
        id_usuario: 5,
        cantidad: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 9,
        nombre: 'Cámara DSLR Canon',
        valor: 800,
        valor_entrada: 0,
        recompenza: 0,
        creditos_retirables_asignados: 0,
        creditos_no_retirables_asignados: 0,
        descripcion: 'Cámara DSLR Canon EOS Rebel T7, sensor de imagen CMOS de 24.1 MP, incluye lente 18-55mm',
        id_categoria: 1,
        id_usuario: 2,
        cantidad: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 10,
        nombre: 'Curso de Fotografía',
        valor: 0,
        valor_entrada: 20,
        recompenza: 1,
        creditos_retirables_asignados: 0,
        creditos_no_retirables_asignados: 1,
        descripcion: 'Curso introductorio de fotografía digital, 5 sesiones en línea',
        id_categoria: 2,
        id_usuario: 2,
        cantidad: 15,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 11,
        nombre: 'Set de Jardinería',
        valor: 50,
        valor_entrada: 0,
        recompenza: 0,
        creditos_retirables_asignados: 0,
        creditos_no_retirables_asignados: 0,
        descripcion: 'Set de herramientas de jardinería, incluye 5 herramientas básicas y guantes',
        id_categoria: 1,
        id_usuario: 2,
        cantidad: 30,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 12,
        nombre: 'Membresía de Gimnasio',
        valor: 200,
        valor_entrada: 0,
        recompenza: 0,
        creditos_retirables_asignados: 0,
        creditos_no_retirables_asignados: 0,
        descripcion: 'Membresía mensual para gimnasio local con acceso a todas las instalaciones',
        id_categoria: 4,
        id_usuario: 3,
        cantidad: 50,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 13,
        nombre: 'Bicicleta de montaña',
        valor: 300,
        valor_entrada: 0,
        recompenza: 0,
        creditos_retirables_asignados: 0,
        creditos_no_retirables_asignados: 0,
        descripcion: 'Bicicleta de montaña con marco de aluminio y frenos de disco, ideal para terrenos difíciles',
        id_categoria: 1,
        id_usuario: 3,
        cantidad: 5,
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
