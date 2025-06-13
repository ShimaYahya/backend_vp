module.exports = (sequelize, DataTypes) => {
  const Countries = sequelize.define('Countries', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });

  Countries.associate = (models) => {
    Countries.hasMany(models.Cities, {
      foreignKey: 'CountryId',
    });

    Countries.hasMany(models.Projects_Categories, {
      foreignKey: 'country_id',
    });
  };

  return Countries;
};
