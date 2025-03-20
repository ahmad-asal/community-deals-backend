module.exports = {
    up: async (queryInterface, Sequelize) => {
        const existingCategories = await queryInterface.sequelize.query(
            `SELECT category_name FROM categories;`,
            { type: Sequelize.QueryTypes.SELECT },
        );
        const existingNames = new Set(
            existingCategories.map(c => c.category_name),
        );

        const categoriesToInsert = [
            {
                category_name: 'Outsourcing',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                category_name: 'Partnerships',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                category_name: 'Real Estate',
                created_at: new Date(),
                updated_at: new Date(),
            },
        ].filter(c => !existingNames.has(c.category_name)); // Only insert new categories

        if (categoriesToInsert.length > 0) {
            await queryInterface.bulkInsert('categories', categoriesToInsert);
        }
    },

    down: async queryInterface => {
        await queryInterface.bulkDelete('categories', null, {});
    },
};
