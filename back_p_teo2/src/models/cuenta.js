'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class cuenta extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  cuenta.init({
    nombres: DataTypes.STRING,
    apellidos: DataTypes.STRING,
    saldo_retirable: DataTypes.DECIMAL,
    saldo_no_retirable: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'cuenta',
    underscored: true,
  });
  return cuenta;
};