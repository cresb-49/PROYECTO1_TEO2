'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class articulo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  articulo.init({
    nombre: DataTypes.STRING,
    valor: DataTypes.DECIMAL,
    descripcion: DataTypes.TEXT,
    id_categoria: DataTypes.INTEGER,
    id_usuario: DataTypes.INTEGER,
    f_desactivado: DataTypes.DATE,
    cantidad: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'articulo',
    underscored: true,
  });
  return articulo;
};