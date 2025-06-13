'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Execution_types extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Execution_types.hasMany(models.Projects, {
        foreignKey: 'execution_type_id'
      })
      
    }
  }
  Execution_types.init({
    execution_type: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Execution_types',
  });
  return Execution_types;
};