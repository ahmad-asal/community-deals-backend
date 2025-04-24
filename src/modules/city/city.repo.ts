import { DB } from '@/database';

const cityRepo = {
    getAllCountries: async () => {
        try {
            // Fetch unique country names from the cities table
            const countries = await DB.Cities.findAll({
                attributes: ['country'],
                group: ['country'], // Ensures distinct countries
                raw: true, // Returns plain objects, not Sequelize instances
            });

            return countries.map(country => country.country);
        } catch (error) {
            console.log('Error fetching countries from DB:', error);
            throw new Error('Failed to fetch countries from database');
        }
    },
};

export default cityRepo;
