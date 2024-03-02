'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class comentario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  comentario.init({
    texto: DataTypes.TEXT,
    id_usuario: DataTypes.INTEGER,
    id_publicacion: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'comentario',
    underscored: true,
  });
  return comentario;
};