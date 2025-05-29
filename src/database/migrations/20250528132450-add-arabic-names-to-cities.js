module.exports = {
    async up(queryInterface, Sequelize) {
        const tableInfo = await queryInterface.describeTable('cities');

        if (!tableInfo.name_ar) {
            await queryInterface.addColumn('cities', 'name_ar', {
                type: Sequelize.STRING,
                allowNull: true,
            });
        }

        if (!tableInfo.country_ar) {
            await queryInterface.addColumn('cities', 'country_ar', {
                type: Sequelize.STRING,
                allowNull: true,
            });
        }
    },

    async down(queryInterface) {
        await queryInterface.removeColumn('cities', 'name_ar');
        await queryInterface.removeColumn('cities', 'country_ar');
    },
};
