import cityRepo from './city.repo';

const cityService = {
    getAllCountries: async () => {
        try {
            const countries = await cityRepo.getAllCountries();

            // Map and return country names in English
            return countries.map((country: any) => ({
                name: country, // This is the English name of the country
            }));
        } catch (error) {
            throw new Error('Failed to fetch countries from the service');
        }
    },
};

export default cityService;
