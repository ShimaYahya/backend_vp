'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Projects extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Projects.belongsTo(models.Countries, {
        foreignKey: 'country_id'
      })
      Projects.belongsTo(models.Cities, {
        foreignKey: 'city_id'
      })
      Projects.hasMany(models.Projects_Categories, {
        foreignKey: 'project_id'
      })
      Projects.belongsTo(models.Execution_types, {
        foreignKey: 'execution_type_id'
      })


    }
  }
  Projects.init({
    project_name: DataTypes.STRING,
    start_date: DataTypes.DATEONLY,
    end_date: DataTypes.DATEONLY,
    country_id: DataTypes.INTEGER,
    city_id: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    project_manager: DataTypes.STRING,
    contact_person: DataTypes.STRING,
    contact_phone: DataTypes.STRING,
    contact_email: DataTypes.STRING,
    project_points: DataTypes.INTEGER,
    num_voliunteers: DataTypes.INTEGER,
    deadline: DataTypes.DATEONLY,
    conditions: DataTypes.TEXT,
    execution_type_id: DataTypes.INTEGER,
    available: DataTypes.BOOLEAN,
    photo: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Projects',
  });
  return Projects;
};