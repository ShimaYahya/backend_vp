module.exports = (sequelize, DataTypes) => {
  const Cities = sequelize.define('Cities', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });

  Cities.associate = (models) => {
    Cities.belongsTo(models.Countries, {
      foreignKey: 'CountryId',
    });

    Cities.hasMany(models.Projects_Categories, {
      foreignKey: 'city_id',
    });
    
  };

  return Cities;

};


