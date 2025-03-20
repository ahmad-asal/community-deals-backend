module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Conversations', 'deletedBy', {
            type: Sequelize.JSONB,
            allowNull: false,
            defaultValue: [],
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Conversations', 'deletedBy');
    },
};
