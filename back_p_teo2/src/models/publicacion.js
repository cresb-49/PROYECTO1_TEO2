'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class publicacion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  publicacion.init({
    id_articulo: DataTypes.INTEGER,
    id_tipo_publicacion: DataTypes.INTEGER,
    id_usuario: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'publicacion',
    underscored: true,
  });
  return publicacion;
};