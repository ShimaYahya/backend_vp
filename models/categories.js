'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Categories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Categories.hasMany(models.Projects_Categories, {
        foreignKey: 'category_id'
      })
      
    }
  }
  Categories.init({
    category_name: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Categories',
  });
  return Categories;
};