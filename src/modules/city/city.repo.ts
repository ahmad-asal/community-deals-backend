import { DB } from '@/database';

const cityRepo = {
    getAllCountries: async () => {
        try {
            // Fetch unique country names from the cities table
            const countries = await DB.Cities.findAll({
                attributes: ['country', 'country_ar'],
                group: ['country', 'country_ar'],
                raw: true,
            });

            return countries.filter((c: any) => c.country && c.country_ar);
        } catch (error) {
            console.log('Error fetching countries from DB:', error);
            throw new Error('Failed to fetch countries from database');
        }
    },
};

export default cityRepo;
