'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Messages', 'deletedBy', {
            type: Sequelize.JSONB,
            allowNull: true,
            defaultValue: [],
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Messages', 'deletedBy');
    },
};
