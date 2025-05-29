'use strict';
const axios = require('axios');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        try {
            // 1. First add columns if they don't exist
            await queryInterface.addColumn('cities', 'name_ar', {
                type: Sequelize.STRING,
                allowNull: true,
            });
            await queryInterface.addColumn('cities', 'country_ar', {
                type: Sequelize.STRING,
                allowNull: true,
            });

            // 2. Get all countries data
            const response = await axios.get(
                'https://restcountries.com/v3.1/all',
            );

            // 3. Get existing cities that need Arabic names
            const [existingCities] = await queryInterface.sequelize.query(
                `SELECT name FROM cities WHERE name_ar IS NULL;`,
            );

            const existingCityNames = new Set(
                existingCities.map(city => city.name),
            );

            // 4. Prepare batch updates
            const updates = response.data
                .filter(country => existingCityNames.has(country.name.common))
                .map(country => ({
                    name: country.name.common,
                    name_ar: country.translations?.ara?.common || null,
                    country_ar: country.translations?.ara?.common || null,
                }));

            // 5. Execute updates in batches (better for large datasets)
            const BATCH_SIZE = 100;
            for (let i = 0; i < updates.length; i += BATCH_SIZE) {
                const batch = updates.slice(i, i + BATCH_SIZE);
                await Promise.all(
                    batch.map(item =>
                        queryInterface.sequelize.query(
                            `UPDATE cities SET 
                name_ar = :name_ar,
                country_ar = :country_ar
               WHERE name = :name`,
                            {
                                replacements: item,
                            },
                        ),
                    ),
                );
            }

            console.log(`Added Arabic names to ${updates.length} cities`);
        } catch (error) {
            console.error('Error seeding Arabic names:', error);
        }
    },

    async down(queryInterface) {
        await queryInterface.removeColumn('cities', 'name_ar');
        await queryInterface.removeColumn('cities', 'country_ar');
    },
};
