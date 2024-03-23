'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let categorias = [
      {
        "id": 1,
        "nombre": "Productos",
        "id_categoria_padre": null
      },
      {
        "id": 2,
        "nombre": "Trabajos",
        "id_categoria_padre": null
      },
      {
        "id": 3,
        "nombre": "Voluntariados",
        "id_categoria_padre": null
      },
      {
        "id": 4,
        "nombre": "Servicios",
        "id_categoria_padre": null
      },
      // {
      //   "id": 5,
      //   "nombre": "Electrónicos",
      //   "id_categoria_padre": 1
      // },
      // {
      //   "id": 6,
      //   "nombre": "Hogar",
      //   "id_categoria_padre": 1
      // },
      // {
      //   "id": 7,
      //   "nombre": "Moda",
      //   "id_categoria_padre": 1
      // },
      // {
      //   "id": 8,
      //   "nombre": "Tecnología",
      //   "id_categoria_padre": 1
      // },
      // {
      //   "id": 9,
      //   "nombre": "Tiempo completo",
      //   "id_categoria_padre": 2
      // },
      // {
      //   "id": 10,
      //   "nombre": "Medio tiempo",
      //   "id_categoria_padre": 2
      // },
      // {
      //   "id": 11,
      //   "nombre": "Por horas",
      //   "id_categoria_padre": 2
      // },
      // {
      //   "id": 12,
      //   "nombre": "No remunerados",
      //   "id_categoria_padre": 3
      // },
      // {
      //   "id": 13,
      //   "nombre": "Remunerados",
      //   "id_categoria_padre": 3
      // },
      // {
      //   "id": 14,
      //   "nombre": "Consultoría",
      //   "id_categoria_padre": 4
      // },
      // {
      //   "id": 15,
      //   "nombre": "Limpieza",
      //   "id_categoria_padre": 4
      // },
      // {
      //   "id": 16,
      //   "nombre": "Reparación",
      //   "id_categoria_padre": 4
      // },
      // {
      //   "id": 17,
      //   "nombre": "Accesorios para teléfonos móviles",
      //   "id_categoria_padre": 5
      // },
      // {
      //   "id": 18,
      //   "nombre": "Computadoras portátiles",
      //   "id_categoria_padre": 5
      // },
      // {
      //   "id": 19,
      //   "nombre": "Televisores",
      //   "id_categoria_padre": 5
      // },
      // {
      //   "id": 20,
      //   "nombre": "Cocina y comedor",
      //   "id_categoria_padre": 6
      // },
      // {
      //   "id": 21,
      //   "nombre": "Muebles de sala",
      //   "id_categoria_padre": 6
      // },
      // {
      //   "id": 22,
      //   "nombre": "Electrodomésticos",
      //   "id_categoria_padre": 6
      // },
      // {
      //   "id": 23,
      //   "nombre": "Ropa de mujer",
      //   "id_categoria_padre": 7
      // },
      // {
      //   "id": 24,
      //   "nombre": "Ropa de hombre",
      //   "id_categoria_padre": 7
      // },
      // {
      //   "id": 25,
      //   "nombre": "Calzado",
      //   "id_categoria_padre": 7
      // },
      // {
      //   "id": 26,
      //   "nombre": "Electrónica de consumo",
      //   "id_categoria_padre": 8
      // },
      // {
      //   "id": 27,
      //   "nombre": "Software",
      //   "id_categoria_padre": 8
      // },
      // {
      //   "id": 28,
      //   "nombre": "Desarrollo web",
      //   "id_categoria_padre": 8
      // },
      // {
      //   "id": 29,
      //   "nombre": "Desarrollo móvil",
      //   "id_categoria_padre": 8
      // },
      // {
      //   "id": 30,
      //   "nombre": "Desarrollo de aplicaciones",
      //   "id_categoria_padre": 8
      // },
      // {
      //   "id": 31,
      //   "nombre": "Diseño gráfico",
      //   "id_categoria_padre": 8
      // },
      // {
      //   "id": 32,
      //   "nombre": "Redes y seguridad",
      //   "id_categoria_padre": 8
      // },
      // {
      //   "id": 33,
      //   "nombre": "Ingeniería eléctrica",
      //   "id_categoria_padre": 8
      // },
      // {
      //   "id": 34,
      //   "nombre": "Ingeniería mecánica",
      //   "id_categoria_padre": 8
      // },
      // {
      //   "id": 35,
      //   "nombre": "Ingeniería civil",
      //   "id_categoria_padre": 8
      // },
      // {
      //   "id": 36,
      //   "nombre": "Ingeniería química",
      //   "id_categoria_padre": 8
      // },
      // {
      //   "id": 37,
      //   "nombre": "Ingeniería industrial",
      //   "id_categoria_padre": 8
      // },
      // {
      //   "id": 38,
      //   "nombre": "Diseño de interiores",
      //   "id_categoria_padre": 8
      // },
      // {
      //   "id": 39,
      //   "nombre": "Diseño de moda",
      //   "id_categoria_padre": 8
      // },
      // {
      //   "id": 40,
      //   "nombre": "Marketing digital",
      //   "id_categoria_padre": 8
      // },
      // {
      //   "id": 41,
      //   "nombre": "Publicidad",
      //   "id_categoria_padre": 8
      // },
      // {
      //   "id": 42,
      //   "nombre": "Contabilidad",
      //   "id_categoria_padre": 8
      // },
      // {
      //   "id": 43,
      //   "nombre": "Finanzas",
      //   "id_categoria_padre": 8
      // },
      // {
      //   "id": 44,
      //   "nombre": "Recursos humanos",
      //   "id_categoria_padre": 8
      // },
      // {
      //   "id": 45,
      //   "nombre": "Gestión de proyectos",
      //   "id_categoria_padre": 8
      // },
      // {
      //   "id": 46,
      //   "nombre": "Consultoría empresarial",
      //   "id_categoria_padre": 8
      // },
      // {
      //   "id": 47,
      //   "nombre": "Alimentación",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 48,
      //   "nombre": "Ropa y moda",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 49,
      //   "nombre": "Belleza y cuidado personal",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 50,
      //   "nombre": "Salud y bienestar",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 51,
      //   "nombre": "Viajes y turismo",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 52,
      //   "nombre": "Deportes y ocio",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 53,
      //   "nombre": "Arte y cultura",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 54,
      //   "nombre": "Educación y formación",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 55,
      //   "nombre": "Idiomas",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 56,
      //   "nombre": "Ingeniería y arquitectura",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 57,
      //   "nombre": "Limpieza y mantenimiento",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 58,
      //   "nombre": "Transporte y logística",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 59,
      //   "nombre": "Inmobiliaria",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 60,
      //   "nombre": "Seguridad y protección",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 61,
      //   "nombre": "Tecnología",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 62,
      //   "nombre": "Medios de comunicación",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 63,
      //   "nombre": "Asistencia sanitaria",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 64,
      //   "nombre": "Legal",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 65,
      //   "nombre": "Consultoría",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 66,
      //   "nombre": "Publicidad y marketing",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 67,
      //   "nombre": "Finanzas y contabilidad",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 68,
      //   "nombre": "Recursos humanos",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 69,
      //   "nombre": "Energía y medio ambiente",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 70,
      //   "nombre": "Fotografía y vídeo",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 71,
      //   "nombre": "Diseño gráfico y multimedia",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 72,
      //   "nombre": "Comunicación y relaciones públicas",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 73,
      //   "nombre": "Ciencias sociales",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 74,
      //   "nombre": "Investigación y desarrollo",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 75,
      //   "nombre": "Artes visuales",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 76,
      //   "nombre": "Desarrollo de software",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 77,
      //   "nombre": "Desarrollo web",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 78,
      //   "nombre": "Aplicaciones móviles",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 79,
      //   "nombre": "Redes y sistemas",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 80,
      //   "nombre": "Seguridad informática",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 81,
      //   "nombre": "Programación",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 82,
      //   "nombre": "Diseño web",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 83,
      //   "nombre": "Marketing digital",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 84,
      //   "nombre": "SEO y SEM",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 85,
      //   "nombre": "Email marketing",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 86,
      //   "nombre": "Redes sociales",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 87,
      //   "nombre": "Analítica web",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 88,
      //   "nombre": "Finanzas personales",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 89,
      //   "nombre": "Inversiones",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 90,
      //   "nombre": "Ahorro",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 91,
      //   "nombre": "Préstamos y créditos",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 92,
      //   "nombre": "Impuestos",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 93,
      //   "nombre": "Seguros",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 94,
      //   "nombre": "Planificación financiera",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 95,
      //   "nombre": "Contabilidad personal",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 96,
      //   "nombre": "Gestión del tiempo",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 97,
      //   "nombre": "Productividad personal",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 98,
      //   "nombre": "Desarrollo personal",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 99,
      //   "nombre": "Autocuidado",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 100,
      //   "nombre": "Relaciones interpersonales",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 101,
      //   "nombre": "Liderazgo y gestión",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 102,
      //   "nombre": "Habilidades sociales",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 103,
      //   "nombre": "Comunicación efectiva",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 104,
      //   "nombre": "Resolución de conflictos",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 105,
      //   "nombre": "Trabajo en equipo",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 106,
      //   "nombre": "Inteligencia emocional",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 107,
      //   "nombre": "Mindfulness",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 108,
      //   "nombre": "Autogestión",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 109,
      //   "nombre": "Gestión del estrés",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 110,
      //   "nombre": "Organización personal",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 111,
      //   "nombre": "Creación de hábitos",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 112,
      //   "nombre": "Aprendizaje continuo",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 113,
      //   "nombre": "Formación online",
      //   "id_categoria_padre": 9
      // },
      // {
      //   "id": 114,
      //   "nombre": "Desarrollo profesional",
      //   "id_categoria_padre": 9
      // }
    ];

    categorias.forEach(categoria => {
      categoria.porcentaje_ganancias = 25;
      categoria.created_at = new Date();
      categoria.updated_at = new Date();
    });
    await queryInterface.bulkInsert('category', categorias, {});
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
