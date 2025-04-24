'use strict';
const axios = require('axios');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        try {
            const response = await axios.get(
                'https://restcountries.com/v3.1/all',
            );

            const existingCities = await queryInterface.sequelize.query(
                `SELECT name FROM cities;`,
                { type: Sequelize.QueryTypes.SELECT },
            );

            const existingNames = new Set(
                existingCities.map(city => city.name),
            );

            const newCountries = response.data
                .map(country => ({
                    name: country.name.common,
                    country: country.name.common,
                    created_at: new Date(),
                    updated_at: new Date(),
                }))
                .filter(country => !existingNames.has(country.name)); // Only insert new countries

            if (newCountries.length > 0) {
                await queryInterface.bulkInsert('cities', newCountries);
            }
        } catch (error) {
            console.error('Error seeding countries:', error);
        }
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('cities', null, {});
    },
};
