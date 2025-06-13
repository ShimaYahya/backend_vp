const { Countries, Cities, sequelize } = require('../models');
const countries = require('countries-cities');

async function seed() {
  try {
    await sequelize.sync({ force: true });

    const countryNames = countries.getCountries();

    for (const name of countryNames) {
      const country = await Countries.findOrCreate({ where: { name } });
      const cityList = countries.getCities(name) || [];

      for (const city of cityList) {
        await Cities.findOrCreate({
          where: { name: city, CountryId: country[0].id }
        });
      }

      console.log(`✔️ Added ${name} with ${cityList.length} cities.`);
    }

    console.log("✅ Seeding finished.");
  } catch (err) {
    console.error("❌ Error seeding data:", err);
  } finally {
    await sequelize.close();
  }
}

seed();
