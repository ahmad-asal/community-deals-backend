import cityRepo from './city.repo';

const cityService = {
    getAllCountries: async () => {
        try {
            const countries = await cityRepo.getAllCountries();
            return countries.map((country: any) => ({
                name: country,
            }));
        } catch (error) {
            throw new Error('Failed to fetch countries from the service');
        }
    },
};

export default cityService;
