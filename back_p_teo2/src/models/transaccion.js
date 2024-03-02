'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaccion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  transaccion.init({
    f_creado: DataTypes.DATE,
    id_cuenta_origen: DataTypes.INTEGER,
    id_cuenta_destino: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'transaccion',
    underscored: true,
  });
  return transaccion;
};