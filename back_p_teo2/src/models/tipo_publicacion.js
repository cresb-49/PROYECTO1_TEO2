'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tipo_publicacion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  tipo_publicacion.init({
    tipo: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'tipo_publicacion',
    underscored: true,
  });
  return tipo_publicacion;
};