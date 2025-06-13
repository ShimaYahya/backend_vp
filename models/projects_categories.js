'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Projects_Categories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Projects_Categories.belongsTo(models.Categories, {
        foreignKey: 'category_id'
      })
      Projects_Categories.belongsTo(models.Projects, {
        foreignKey: 'project_id'
      })
      
      
    }
  }
  Projects_Categories.init({
    category_id: DataTypes.INTEGER,
    project_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Projects_Categories',
  });
  return Projects_Categories;
};