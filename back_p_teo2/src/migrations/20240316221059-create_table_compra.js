'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('buy', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_usuario_compra: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuario',
          key: 'id'
        }
      },
      id_usuario_venta: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuario',
          key: 'id'
        }
      },
      id_articulo_venta: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'articulo',
          key: 'id'
        }
      },
      cantidad_articulo_venta: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      id_articulo_cambio: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'articulo',
          key: 'id'
        }
      },
      cantidad_articulo_cambio: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      valida: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      valor_venta: {
        type: Sequelize.DECIMAL(8, 2),
        allowNull: false,
      },
      creditos_retirables_usados: {
        type: Sequelize.DECIMAL(8, 2),
        allowNull: false,
        defaultValue: 0
      },
      creditos_no_retirables_usados: {
        type: Sequelize.DECIMAL(8, 2),
        allowNull: false,
        defaultValue: 0
      },
      creditos_generados: {
        type: Sequelize.DECIMAL(8, 2),
        allowNull: false,
        defaultValue: 0,
      },
      mensaje: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      validate_at: {
        allowNull: true,
        type: Sequelize.DATE
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('buy');
  }
};
