'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('deals', 'audience', {
            type: Sequelize.ENUM('public', 'friends', 'custom'),
            allowNull: false,
            defaultValue: 'public',
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('deals', 'audience');
    },
};
